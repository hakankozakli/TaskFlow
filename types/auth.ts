import { User, Session } from '@supabase/supabase-js'
import { Organization } from './organization'
import { UserOrganization } from './user'

export interface AuthState {
    session: Session | null
    user: User | null
    organization: Organization | null
    organizations: Organization[]
    userOrganization: UserOrganization | null
    isLoading: boolean
    isAuthenticated: boolean
  }
  
  export interface AuthContextType extends AuthState {
    signIn: (email: string, password: string) => Promise<void>
    signUp: (email: string, password: string) => Promise<void>
    signOut: () => Promise<void>
    resetPassword: (email: string) => Promise<void>
    updatePassword: (password: string) => Promise<void>
    switchOrganization: (orgId: string) => Promise<void>
    hasPermission: (permission: string) => boolean
    hasRole: (roles: string | string[]) => boolean
  }