'use client'

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import type { AuthContextType } from '@/types/auth'
import { fetchAuthState } from '@/lib/auth/fetcher'
import useSWR from 'swr'
import { toast } from 'sonner'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Protected routes configuration
const PROTECTED_ROUTES = ['/dashboard']
const AUTH_ROUTES = ['/login', '/register', '/reset-password']

export function AuthProvider({ 
  children,
  initialState 
}: { 
  children: ReactNode
  initialState?: Awaited<ReturnType<typeof fetchAuthState>>
}) {
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(true)

  // Fetch auth state using SWR
  const { data: authData, mutate: mutateAuth } = useSWR('auth', fetchAuthState, {
    revalidateOnFocus: false,
    refreshInterval: 0,
    shouldRetryOnError: false,
    fallbackData: initialState
  })

  // Route protection
  useEffect(() => {
    if (isLoading) return

    const isProtectedRoute = PROTECTED_ROUTES.some(route => pathname?.startsWith(route))
    const isAuthRoute = AUTH_ROUTES.includes(pathname || '')
    
    if (isProtectedRoute && !authData?.isAuthenticated) {
      router.push('/login')
    } else if (isAuthRoute && authData?.isAuthenticated) {
      router.push('/dashboard')
    }
  }, [pathname, authData?.isAuthenticated, isLoading, router])

  // Session management
  useEffect(() => {
    const {
      data: { subscription: authListener }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_OUT') {
        await mutateAuth()
        router.push('/login')
      } else if (event === 'SIGNED_IN') {
        await mutateAuth()
      }
    })

    setIsLoading(false)

    return () => {
      authListener.unsubscribe()
    }
  }, [mutateAuth, router, supabase.auth])

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      if (error) throw error
      
      await mutateAuth()
      router.push('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Login failed')
      throw error
    }
  }

  const signUp = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })
      if (error) throw error
      
      toast.success('Verification email sent. Please check your inbox.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Sign up failed')
      throw error
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      await mutateAuth()
      router.push('/login')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Sign out failed')
      throw error
    }
  }

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback`
      })
      if (error) throw error
      
      toast.success('Password reset email sent. Please check your inbox.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Password reset failed')
      throw error
    }
  }

  const updatePassword = async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password
      })
      if (error) throw error
      
      toast.success('Password updated successfully.')
      router.push('/dashboard')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Password update failed')
      throw error
    }
  }

  const switchOrganization = async (orgId: string) => {
    try {
      const { error: updateError } = await supabase.auth.updateUser({
        data: { active_organization_id: orgId }
      })
      if (updateError) throw updateError

      await mutateAuth()
      toast.success('Organization switched successfully.')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to switch organization')
      throw error
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!authData?.userOrganization) return false
    
    const rolePermissions = {
      owner: ['*'],
      admin: ['read:*', 'create:*', 'update:*', 'delete:projects', 'invite:users'],
      member: ['read:*', 'create:tasks', 'update:tasks']
    }
    
    const userRole = authData.userOrganization.role
    const permissions = rolePermissions[userRole as keyof typeof rolePermissions]
    
    return permissions.some(p => 
      p === '*' || 
      p === permission ||
      (p.endsWith(':*') && permission.startsWith(p.replace(':*', '')))
    )
  }

  const hasRole = (roles: string | string[]): boolean => {
    if (!authData?.userOrganization) return false
    
    const userRole = authData.userOrganization.role
    const requiredRoles = Array.isArray(roles) ? roles : [roles]
    
    return requiredRoles.includes(userRole)
  }


  return (
    <AuthContext.Provider
      value={{
        ...authData,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updatePassword,
        switchOrganization,
        hasPermission,
        hasRole
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for using auth context
export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}