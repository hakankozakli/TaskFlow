import { UserOrganization } from '@/types/user'

export const ROLE_PERMISSIONS = {
  owner: ['*'],
  admin: [
    'read:*',
    'create:*',
    'update:*',
    'delete:projects',
    'delete:tasks',
    'invite:users'
  ],
  member: [
    'read:*',
    'create:tasks',
    'update:tasks',
    'update:own_profile'
  ]
} as const

export function checkPermission(
  userOrg: UserOrganization | null,
  requiredPermission: string
): boolean {
  if (!userOrg) return false
  
  const permissions = ROLE_PERMISSIONS[userOrg.role as keyof typeof ROLE_PERMISSIONS]
  if (!permissions) return false
  
  return permissions.some(permission => 
    permission === '*' || 
    permission === requiredPermission ||
    (permission.endsWith(':*') && 
     requiredPermission.startsWith(permission.replace(':*', '')))
  )
}