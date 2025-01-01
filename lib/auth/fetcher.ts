import { createClient } from '@/lib/supabase/client'
import type { AuthState } from '@/types/auth'
import type { Organization } from '@/types/organization'
import type { UserOrganization } from '@/types/user'

export async function fetchAuthState(): Promise<AuthState> {
  const supabase = createClient()
  
  // Get current session
  const { data: { session }, error: sessionError } = await supabase.auth.getSession()
  if (sessionError) throw sessionError
  
  // Return initial state if no session
  if (!session) {
    return {
      session: null,
      user: null,
      organization: null,
      organizations: [],
      userOrganization: null,
      isLoading: false,
      isAuthenticated: false
    }
  }

  // Get organizations the user belongs to
  const { data: userOrgs, error: userOrgsError } = await supabase
    .from('user_organizations')
    .select(`
      *,
      organizations (
        id,
        name,
        slug,
        created_at,
        updated_at
      )
    `)
    .eq('user_id', session.user.id)

  if (userOrgsError) throw userOrgsError

  // Extract organizations from the joined data
  const organizations: Organization[] = userOrgs.map(uo => uo.organizations)

  // Get the active organization ID from user metadata or use the first one
  const activeOrgId = session.user.user_metadata.active_organization_id || 
    organizations[0]?.id

  if (!activeOrgId) {
    return {
      session,
      user: session.user,
      organization: null,
      organizations: [],
      userOrganization: null,
      isLoading: false,
      isAuthenticated: true
    }
  }

  // Find the active organization and user organization entry
  const activeOrganization = organizations.find(org => org.id === activeOrgId)
  const activeUserOrg: UserOrganization | null = userOrgs.find(
    uo => uo.organization_id === activeOrgId
  ) ?? null

  return {
    session,
    user: session.user,
    organization: activeOrganization ?? null,
    organizations,
    userOrganization: activeUserOrg,
    isLoading: false,
    isAuthenticated: true
  }
}