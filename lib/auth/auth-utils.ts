import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export async function getSession() {
  const supabase = getSupabaseServerClient()

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession()
    return session
  } catch (error) {
    return null
  }
}

export async function getUserProfile() {
  const supabase = getSupabaseServerClient()
  const session = await getSession()

  if (!session) {
    return null
  }

  const { data } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return data
}

export async function requireAuth() {
  const session = await getSession()

  if (!session) {
    redirect("/auth/login")
  }

  return session
}

export async function requireGuest() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }
}

export async function getUserRoles() {
  const supabase = getSupabaseServerClient()
  const session = await getSession()

  if (!session) {
    return []
  }

  const { data } = await supabase
    .from("user_roles")
    .select(`
      role_id,
      roles (
        id,
        name,
        description
      )
    `)
    .eq("user_id", session.user.id)

  return data?.map((item) => item.roles) || []
}

export async function getUserPermissions() {
  const supabase = getSupabaseServerClient()
  const session = await getSession()

  if (!session) {
    return []
  }

  // Get permissions from user roles
  const { data: rolePermissions } = await supabase
    .from("user_roles")
    .select(`
      roles (
        role_permissions (
          permissions (
            id,
            name,
            resource,
            action
          )
        )
      )
    `)
    .eq("user_id", session.user.id)

  // Get direct user permissions
  const { data: directPermissions } = await supabase
    .from("user_permissions")
    .select(`
      permissions (
        id,
        name,
        resource,
        action
      )
    `)
    .eq("user_id", session.user.id)

  // Combine and deduplicate permissions
  const rolePerms = rolePermissions?.flatMap((rp) => rp.roles.role_permissions.map((p) => p.permissions)) || []

  const directPerms = directPermissions?.map((dp) => dp.permissions) || []

  const allPermissions = [...rolePerms, ...directPerms]

  // Deduplicate by permission ID
  const uniquePermissions = allPermissions.filter(
    (permission, index, self) => index === self.findIndex((p) => p.id === permission.id),
  )

  return uniquePermissions
}

export async function hasPermission(permission: string) {
  const permissions = await getUserPermissions()
  return permissions.some((p) => p.name === permission)
}
