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

export function requireAdmin() {
  return requireRole(UserRole.ADMIN)
}

export function requirePremium() {
  return requireRole([UserRole.PREMIUM, UserRole.ADMIN])
}

export function requireUser() {
  return requireRole([UserRole.USER, UserRole.PREMIUM, UserRole.ADMIN])
}

export function canAccessResource(userRole: UserRole, resourceRole: UserRole): boolean {
  const roleHierarchy = {
    [UserRole.USER]: 0,
    [UserRole.PREMIUM]: 1,
    [UserRole.ADMIN]: 2,
  }

  return roleHierarchy[userRole] >= roleHierarchy[resourceRole]
}

export function getRolePermissions(role: UserRole) {
  const permissions = {
    [UserRole.USER]: [
      'read:profile',
      'update:profile',
      'read:basic_content',
    ],
    [UserRole.PREMIUM]: [
      'read:profile',
      'update:profile',
      'read:basic_content',
      'read:premium_content',
      'access:advanced_features',
    ],
    [UserRole.ADMIN]: [
      'read:profile',
      'update:profile',
      'read:basic_content',
      'read:premium_content',
      'access:advanced_features',
      'manage:users',
      'manage:content',
      'access:admin_panel',
      'manage:system',
    ],
  }

  return permissions[role] || []
}

export function hasPermission(userRole: UserRole, permission: string): boolean {
  const userPermissions = getRolePermissions(userRole)
  return userPermissions.includes(permission)
}
