import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import fp from 'fastify-plugin'
import axios from 'axios'
import { prisma } from './prisma'

interface OAuthUserInfo {
  id: string
  email?: string
  name?: string
  avatar?: string
}

class FastifyOAuthService {
  private googleClientId: string | undefined
  private googleClientSecret: string | undefined
  private githubClientId: string | undefined
  private githubClientSecret: string | undefined
  private apiUrl: string

  constructor() {
    this.googleClientId = process.env.GOOGLE_CLIENT_ID
    this.googleClientSecret = process.env.GOOGLE_CLIENT_SECRET
    this.githubClientId = process.env.GITHUB_CLIENT_ID
    this.githubClientSecret = process.env.GITHUB_CLIENT_SECRET
    this.apiUrl = process.env.API_URL || 'http://localhost:3001'  // Back to 3001
  }

  // Google OAuth URLs
  getGoogleAuthUrl(): string {
    if (!this.googleClientId || this.googleClientId === 'your-google-client-id') {
      throw new Error('Google OAuth not configured properly. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file.')
    }

    const redirectUri = `${this.apiUrl}/api/auth/google/callback`
    const scope = 'openid profile email'
    const responseType = 'code'
    const state = Math.random().toString(36).substring(7) // Simple state for CSRF protection
    
    const params = new URLSearchParams({
      client_id: this.googleClientId,
      redirect_uri: redirectUri,
      scope: scope,
      response_type: responseType,
      state: state,
    })

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
  }

  // GitHub OAuth URLs
  getGitHubAuthUrl(): string {
    if (!this.githubClientId || this.githubClientId === 'your-github-client-id') {
      throw new Error('GitHub OAuth not configured properly. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env file.')
    }

    const redirectUri = `${this.apiUrl}/api/auth/github/callback`
    const scope = 'user:email'
    const state = Math.random().toString(36).substring(7) // Simple state for CSRF protection
    
    const params = new URLSearchParams({
      client_id: this.githubClientId,
      redirect_uri: redirectUri,
      scope: scope,
      state: state,
    })

    return `https://github.com/login/oauth/authorize?${params.toString()}`
  }

  // Exchange Google code for token and user info
  async handleGoogleCallback(code: string): Promise<OAuthUserInfo> {
    if (!this.googleClientId || !this.googleClientSecret || 
        this.googleClientId === 'your-google-client-id' || 
        this.googleClientSecret === 'your-google-client-secret') {
      throw new Error('Google OAuth not configured properly. Please set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env file.')
    }

    // Exchange code for access token
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      client_id: this.googleClientId,
      client_secret: this.googleClientSecret,
      code: code,
      grant_type: 'authorization_code',
      redirect_uri: `${this.apiUrl}/api/auth/google/callback`,
    })

    const { access_token } = tokenResponse.data

    // Get user info
    const userResponse = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    const userData = userResponse.data
    return {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      avatar: userData.picture,
    }
  }

  // Exchange GitHub code for token and user info
  async handleGitHubCallback(code: string): Promise<OAuthUserInfo> {
    if (!this.githubClientId || !this.githubClientSecret || 
        this.githubClientId === 'your-github-client-id' || 
        this.githubClientSecret === 'your-github-client-secret') {
      throw new Error('GitHub OAuth not configured properly. Please set GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET in .env file.')
    }

    // Exchange code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: this.githubClientId,
        client_secret: this.githubClientSecret,
        code: code,
      },
      {
        headers: { Accept: 'application/json' },
      }
    )

    const { access_token } = tokenResponse.data

    // Get user info
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    // Get user emails (GitHub may not include email in user info)
    const emailsResponse = await axios.get('https://api.github.com/user/emails', {
      headers: { Authorization: `Bearer ${access_token}` },
    })

    const userData = userResponse.data
    const emails = emailsResponse.data
    const primaryEmail = emails.find((email: any) => email.primary)?.email || emails[0]?.email

    return {
      id: userData.id.toString(),
      email: primaryEmail,
      name: userData.name || userData.login,
      avatar: userData.avatar_url,
    }
  }

  // Common OAuth callback handler
  async handleOAuthCallback(oauthData: {
    provider: string
    providerId: string
    email?: string
    name?: string
    avatar?: string
  }) {
    // Check if OAuth provider already exists
    const existingOAuth = await prisma.oAuthProvider.findUnique({
      where: {
        provider_providerId: {
          provider: oauthData.provider,
          providerId: oauthData.providerId,
        },
      },
      include: { user: true },
    })

    if (existingOAuth) {
      // Update OAuth provider info
      await prisma.oAuthProvider.update({
        where: { id: existingOAuth.id },
        data: {
          email: oauthData.email,
          name: oauthData.name,
          avatar: oauthData.avatar,
        },
      })
      return existingOAuth.user
    }

    // Check if user exists by email
    let user = null
    if (oauthData.email) {
      user = await prisma.user.findUnique({
        where: { email: oauthData.email },
      })
    }

    // Create new user if doesn't exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: oauthData.email || `${oauthData.provider}_${oauthData.providerId}@oauth.local`,
          name: oauthData.name,
          avatar: oauthData.avatar,
          emailVerified: !!oauthData.email, // OAuth emails are considered verified
          password: null, // OAuth users don't have passwords
        },
      })
    }

    // Create OAuth provider record
    await prisma.oAuthProvider.create({
      data: {
        provider: oauthData.provider,
        providerId: oauthData.providerId,
        email: oauthData.email || user.email,
        name: oauthData.name,
        avatar: oauthData.avatar,
        userId: user.id,
      },
    })

    return user
  }
}

// Plugin to register OAuth service
async function fastifyOAuthPlugin(fastify: FastifyInstance) {
  const oauthService = new FastifyOAuthService()
  
  fastify.decorate('oauthService', oauthService)
}

export default fp(fastifyOAuthPlugin)
export { FastifyOAuthService }
