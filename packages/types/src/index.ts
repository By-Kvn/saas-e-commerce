// API Response Types
export interface ApiResponse {
  message: string
  timestamp: string
  status: 'success' | 'error'
  data?: any
}

// User Types
export interface User {
  id: string
  email: string
  name?: string
  emailVerified: boolean
  createdAt: Date
  stripeCustomerId?: string
}

export interface CreateUserInput {
  email: string
  password: string
  name?: string
}

export interface LoginInput {
  email: string
  password: string
}

export interface AuthResponse {
  user: Omit<User, 'createdAt'> & { createdAt?: Date }
  token: string
  message?: string
}

// Auth-related types
export interface RegisterInput extends CreateUserInput {}

export interface EmailVerificationInput {
  token: string
}

export interface ResendVerificationInput {
  email: string
}

export interface ForgotPasswordInput {
  email: string
}

export interface ResetPasswordInput {
  token: string
  password: string
}

export interface UpdateProfileInput {
  name?: string
  email?: string
}

export interface ChangePasswordInput {
  currentPassword: string
  newPassword: string
}

export interface AuthenticatedUser {
  id: string
  email: string
  name?: string
  role?: string
  avatar?: string
  emailVerified: boolean
  twoFactorEnabled?: boolean
}

// Subscription Types
export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  INCOMPLETE = 'INCOMPLETE',
  TRIALING = 'TRIALING',
}

export interface Subscription {
  id: string
  userId: string
  stripeCustomerId: string
  stripePriceId: string
  status: SubscriptionStatus
  currentPeriodStart: Date
  currentPeriodEnd: Date
  createdAt: Date
  updatedAt: Date
}

// Stripe Types
export interface CreateCheckoutSessionInput {
  priceId: string
}

export interface CheckoutSessionResponse {
  sessionId: string
}

// Error Types
export interface ErrorResponse {
  error: string
  code?: string
  details?: any
}

// Common Types
export interface PaginationParams {
  page?: number
  limit?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}
