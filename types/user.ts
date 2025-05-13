export interface Profile {
  id: string
  updated_at: string | null
  full_name: string | null
  avatar_url: string | null
  role: string | null
  email: string | null
  phone: string | null
  department: string | null
  position: string | null
  last_sign_in: string | null
  average_grade?: number | null // Calificación promedio
  points?: number | null // Puntos acumulados
  pending_tasks?: number | null // Tareas pendientes por hacer
  due_soon_tasks?: number | null // Tareas pendientes por vencer pronto
}

export interface Role {
  id: string
  name: string
  description: string | null
  created_at: string
  updated_at: string
}

export interface Permission {
  id: string
  name: string
  description: string | null
  resource: string
  action: string
  created_at: string
  updated_at: string
}

export interface UserRole {
  id: string
  user_id: string
  role_id: string
  role: Role
  created_at: string
}

export interface UserPermission {
  id: string
  user_id: string
  permission_id: string
  permission: Permission
  created_at: string
}
