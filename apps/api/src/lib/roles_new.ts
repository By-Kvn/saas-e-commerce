import { FastifyRequest, FastifyReply } from 'fastify'
import { UserRole } from '@saas/types'

export interface AuthenticatedUserWithRole {
  id: string
  email: string
  name?: string
  role: UserRole
  emailVerified: boolean
  twoFactorEnabled: boolean
}

export function requireRole(allowedRoles: UserRole | UserRole[]) {
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles]

  return async (request: FastifyRequest, reply: FastifyReply) => {
    const user = (request as any).currentUser as AuthenticatedUserWithRole

    if (!user) {
      return reply.code(401).send({
        error: 'Authentification requise',
        code: 'AUTHENTICATION_REQUIRED'
      })
    }

    if (!roles.includes(user.role)) {
      return reply.code(403).send({
        error: 'Permissions insuffisantes',
        code: 'INSUFFICIENT_PERMISSIONS',
        required: roles,
        current: user.role
      })
    }
  }
}

// Convenience functions for common role requirements
export function requireAdmin() {
  return requireRole([UserRole.ADMIN])
}

export function requireCustomerOrAdmin() {
  return requireRole([UserRole.CUSTOMER, UserRole.ADMIN])
}

export function requireAnyRole() {
  return requireRole([UserRole.CUSTOMER, UserRole.ADMIN, UserRole.MODERATOR])
}

// Role hierarchy for permissions (higher number = more permissions)
const roleHierarchy = {
  [UserRole.CUSTOMER]: 0,
  [UserRole.MODERATOR]: 1,
  [UserRole.ADMIN]: 2,
}

export function hasPermission(userRole: UserRole, resourceRole: UserRole): boolean {
  return roleHierarchy[userRole] >= roleHierarchy[resourceRole]
}

// Define permissions for each role
const permissions = {
  [UserRole.CUSTOMER]: [
    'read:own-profile',
    'update:own-profile',
    'read:products',
    'create:orders',
    'read:own-orders',
  ],
  [UserRole.MODERATOR]: [
    'read:own-profile',
    'update:own-profile',
    'read:products',
    'create:orders',
    'read:own-orders',
    'manage:products',
    'read:all-orders',
  ],
  [UserRole.ADMIN]: [
    'read:own-profile',
    'update:own-profile',
    'read:products',
    'create:orders',
    'read:own-orders',
    'manage:products',
    'read:all-orders',
    'manage:users',
    'manage:system',
  ],
}

export function getRolePermissions(role: UserRole): string[] {
  return permissions[role] || []
}

export function hasSpecificPermission(userRole: UserRole, permission: string): boolean {
  const userPermissions = getRolePermissions(userRole)
  return userPermissions.includes(permission)
}
