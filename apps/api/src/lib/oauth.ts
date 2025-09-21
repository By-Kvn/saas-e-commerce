import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { prisma } from "./prisma";

export class OAuthService {
  constructor() {
    this.initializeStrategies();
  }

  private initializeStrategies() {
    // Google OAuth Strategy
    if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      passport.use(
        new GoogleStrategy(
          {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: `${process.env.API_URL || "http://localhost:3001"}/api/auth/google/callback`,
          },
          async (
            accessToken: string,
            refreshToken: string,
            profile: any,
            done: any
          ) => {
            try {
              const result = await this.handleOAuthCallback({
                provider: "google",
                providerId: profile.id,
                email: profile.emails?.[0]?.value,
                name: profile.displayName,
                avatar: profile.photos?.[0]?.value,
                accessToken,
                refreshToken,
              });
              return done(null, result);
            } catch (error) {
              return done(error, false);
            }
          }
        )
      );
    }

    // GitHub OAuth Strategy
    if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
      passport.use(
        new GitHubStrategy(
          {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: `${process.env.API_URL || "http://localhost:3001"}/api/auth/github/callback`,
          },
          async (
            accessToken: string,
            refreshToken: string,
            profile: any,
            done: any
          ) => {
            try {
              const result = await this.handleOAuthCallback({
                provider: "github",
                providerId: profile.id,
                email: profile.emails?.[0]?.value,
                name: profile.displayName || profile.username,
                avatar: profile.photos?.[0]?.value,
                accessToken,
                refreshToken,
              });
              return done(null, result);
            } catch (error) {
              return done(error, false);
            }
          }
        )
      );
    }

    // JWT Strategy for API authentication
    passport.use(
      new JwtStrategy(
        {
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
          secretOrKey: process.env.JWT_SECRET || "your-super-secret-jwt-key",
        },
        async (payload: any, done: any) => {
          try {
            const user = await prisma.user.findUnique({
              where: { id: payload.userId },
              include: {
                oauthAccounts: true,
              },
            });

            if (user) {
              return done(null, user);
            }
            return done(null, false);
          } catch (error) {
            return done(error, false);
          }
        }
      )
    );
  }

  private async handleOAuthCallback(oauthData: {
    provider: string;
    providerId: string;
    email?: string;
    name?: string;
    avatar?: string;
    accessToken: string;
    refreshToken?: string;
  }) {
    // Check if OAuth provider already exists
    const existingOAuth = await prisma.oAuthAccount.findUnique({
      where: {
        provider_providerAccountId: {
          provider: oauthData.provider,
          providerAccountId: oauthData.providerId,
        },
      },
      include: { user: true },
    });

    if (existingOAuth) {
      // Update tokens
      await prisma.oAuthAccount.update({
        where: { id: existingOAuth.id },
        data: {
          accessToken: oauthData.accessToken,
          refreshToken: oauthData.refreshToken,
          // Add other fields if present in schema
        },
      });
      return existingOAuth.user;
    }

    // Check if user exists by email
    let user = null;
    if (oauthData.email) {
      user = await prisma.user.findUnique({
        where: { email: oauthData.email },
      });
    }

    // Create new user if doesn't exist
    if (!user) {
      user ??= await prisma.user.create({
        data: {
          email:
            oauthData.email ||
            `${oauthData.provider}_${oauthData.providerId}@oauth.local`,
          name: oauthData.name,
          avatar: oauthData.avatar,
          emailVerified: !!oauthData.email, // OAuth emails are considered verified
          password: null, // OAuth users don't have passwords
        },
      });
    }

    // Create OAuth provider record
    await prisma.oAuthAccount.create({
      data: {
        provider: oauthData.provider,
        providerAccountId: oauthData.providerId,
        accessToken: oauthData.accessToken,
        refreshToken: oauthData.refreshToken,
        userId: user.id,
      },
    });

    return user;
  }
}

export const oauthService = new OAuthService();
