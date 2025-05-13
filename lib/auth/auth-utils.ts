import { getSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function getUser() {
  const supabase = await getSupabaseServerClient(); // Ensure client is awaited

  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      // Don't log "Auth session missing!" as an error, it's expected for guests.
      if (error.message !== "Auth session missing!") {
        console.error("Error getting user:", error.message);
      }
      return null;
    }
    return user;
  } catch (error) {
    console.error("Exception getting user:", error);
    return null;
  }
}
export async function getSession() {
  const supabase = await getSupabaseServerClient(); // Add await

  try {
    const {
      data: { session },
    } = await supabase.auth.getSession(); // Keep getSession here if full session object is needed elsewhere
    return session;
  } catch (error) {
    console.error("Error getting session:", error); // Add logging
    return null;
  }
}

export async function getUserProfile() {
  const supabase = await getSupabaseServerClient(); // Add await
  const user = await getUser(); // Use getUser

  if (!user) {
    // Check user
    return null;
  }

  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id) // Use user.id
    .single();

  return data;
}

export async function requireAuth() {
  const user = await getUser(); // Use getUser

  if (!user) {
    // Check user
    redirect("/auth/login");
  }

  // Decide what to return, maybe the user object or void if only redirection is needed
  return user; // Return user for consistency
}

export async function requireGuest() {
  const user = await getUser(); // Use getUser

  if (user) {
    // Check user
    redirect("/dashboard");
  }
}

export async function getUserRoles() {
  const supabase = await getSupabaseServerClient(); // Add await
  const user = await getUser(); // Use getUser

  if (!user) { // Check user
    return [];
  }

  const { data } = await supabase
    .from("user_roles")
    .select(
      `
      role_id,
      roles (
        id,
        name,
        description
      )
    `
    )
    .eq("user_id", user.id); // Use user.id

  // Define proper type for 'item' if possible, otherwise use 'any' cautiously
  return data?.map((item: any) => item.roles) || [];
}

export async function getUserPermissions() {
  const supabase = await getSupabaseServerClient(); // Add await
  const user = await getUser(); // Use getUser

  if (!user) { // Check user
    return [];
  }

  // Get permissions from user roles
  const { data: rolePermissions } = await supabase
    .from("user_roles")
    .select(
      `
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
    `
    )
    .eq("user_id", user.id); // Use user.id

  // Get direct user permissions
  const { data: directPermissions } = await supabase
    .from("user_permissions")
    .select(
      `
      permissions (
        id,
        name,
        resource,
        action
      )
    `
    )
    .eq("user_id", user.id); // Use user.id

  // Combine and deduplicate permissions
  // Define proper types for rp, p, dp if possible
  const rolePerms =
    rolePermissions?.flatMap((rp: any) =>
      rp.roles.role_permissions.map((p: any) => p.permissions)
    ) || [];

  const directPerms = directPermissions?.map((dp: any) => dp.permissions) || [];

  const allPermissions = [...rolePerms, ...directPerms];

  // Deduplicate by permission ID
  // Define proper type for p if possible
  const uniquePermissions = allPermissions.filter(
    (permission, index, self) =>
      index === self.findIndex((p: any) => p.id === permission.id)
  );

  return uniquePermissions;
}

export async function hasPermission(permission: string) {
  const permissions = await getUserPermissions();
  return permissions.some((p) => p.name === permission);
}
