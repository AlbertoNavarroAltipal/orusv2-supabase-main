-- Insertar datos de ejemplo en la tabla de perfiles
INSERT INTO public.profiles (id, full_name, email, department, position, phone, avatar_url, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Administrador Sistema', 'admin@orus.com', 'Tecnología', 'Administrador', '123456789', 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin', NOW()),
  ('00000000-0000-0000-0000-000000000002', 'Juan Pérez', 'juan.perez@orus.com', 'Ventas', 'Gerente', '987654321', 'https://api.dicebear.com/7.x/avataaars/svg?seed=juan', NOW()),
  ('00000000-0000-0000-0000-000000000003', 'María López', 'maria.lopez@orus.com', 'Marketing', 'Coordinadora', '456789123', 'https://api.dicebear.com/7.x/avataaars/svg?seed=maria', NOW()),
  ('00000000-0000-0000-0000-000000000004', 'Carlos Rodríguez', 'carlos.rodriguez@orus.com', 'Finanzas', 'Analista', '789123456', 'https://api.dicebear.com/7.x/avataaars/svg?seed=carlos', NOW()),
  ('00000000-0000-0000-0000-000000000005', 'Ana Martínez', 'ana.martinez@orus.com', 'Recursos Humanos', 'Directora', '321654987', 'https://api.dicebear.com/7.x/avataaars/svg?seed=ana', NOW())
ON CONFLICT (id) DO UPDATE 
SET 
  full_name = EXCLUDED.full_name,
  email = EXCLUDED.email,
  department = EXCLUDED.department,
  position = EXCLUDED.position,
  phone = EXCLUDED.phone,
  avatar_url = EXCLUDED.avatar_url,
  updated_at = EXCLUDED.updated_at;

-- Insertar roles de ejemplo
INSERT INTO public.roles (id, name, description, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'admin', 'Administrador del sistema con acceso completo', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'manager', 'Gerente con acceso a la mayoría de funciones', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', 'user', 'Usuario estándar con acceso limitado', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000004', 'guest', 'Usuario invitado con acceso de solo lectura', NOW(), NOW())
ON CONFLICT (name) DO UPDATE 
SET 
  description = EXCLUDED.description,
  updated_at = EXCLUDED.updated_at;

-- Insertar permisos de ejemplo
INSERT INTO public.permissions (id, name, description, resource, action, created_at, updated_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'view_users', 'Ver usuarios', 'users', 'view', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000002', 'create_users', 'Crear usuarios', 'users', 'create', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000003', 'update_users', 'Actualizar usuarios', 'users', 'update', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000004', 'delete_users', 'Eliminar usuarios', 'users', 'delete', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000005', 'view_roles', 'Ver roles', 'roles', 'view', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000006', 'manage_roles', 'Gestionar roles', 'roles', 'manage', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000007', 'view_permissions', 'Ver permisos', 'permissions', 'view', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000008', 'manage_permissions', 'Gestionar permisos', 'permissions', 'manage', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000009', 'view_reports', 'Ver reportes', 'reports', 'view', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000010', 'manage_reports', 'Gestionar reportes', 'reports', 'manage', NOW(), NOW())
ON CONFLICT (resource, action) DO UPDATE 
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = EXCLUDED.updated_at;

-- Asignar permisos a roles
-- Admin tiene todos los permisos
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
  (SELECT id FROM public.roles WHERE name = 'admin'),
  id,
  NOW()
FROM public.permissions
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Manager tiene permisos de visualización y algunos de gestión
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
VALUES
  ((SELECT id FROM public.roles WHERE name = 'manager'), (SELECT id FROM public.permissions WHERE name = 'view_users'), NOW()),
  ((SELECT id FROM public.roles WHERE name = 'manager'), (SELECT id FROM public.permissions WHERE name = 'create_users'), NOW()),
  ((SELECT id FROM public.roles WHERE name = 'manager'), (SELECT id FROM public.permissions WHERE name = 'update_users'), NOW()),
  ((SELECT id FROM public.roles WHERE name = 'manager'), (SELECT id FROM public.permissions WHERE name = 'view_roles'), NOW()),
  ((SELECT id FROM public.roles WHERE name = 'manager'), (SELECT id FROM public.permissions WHERE name = 'view_permissions'), NOW()),
  ((SELECT id FROM public.roles WHERE name = 'manager'), (SELECT id FROM public.permissions WHERE name = 'view_reports'), NOW()),
  ((SELECT id FROM public.roles WHERE name = 'manager'), (SELECT id FROM public.permissions WHERE name = 'manage_reports'), NOW())
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Usuario estándar tiene permisos básicos
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
VALUES
  ((SELECT id FROM public.roles WHERE name = 'user'), (SELECT id FROM public.permissions WHERE name = 'view_users'), NOW()),
  ((SELECT id FROM public.roles WHERE name = 'user'), (SELECT id FROM public.permissions WHERE name = 'view_roles'), NOW()),
  ((SELECT id FROM public.roles WHERE name = 'user'), (SELECT id FROM public.permissions WHERE name = 'view_reports'), NOW())
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Invitado solo tiene permisos de visualización
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
VALUES
  ((SELECT id FROM public.roles WHERE name = 'guest'), (SELECT id FROM public.permissions WHERE name = 'view_users'), NOW()),
  ((SELECT id FROM public.roles WHERE name = 'guest'), (SELECT id FROM public.permissions WHERE name = 'view_reports'), NOW())
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Asignar roles a usuarios
INSERT INTO public.user_roles (user_id, role_id, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', (SELECT id FROM public.roles WHERE name = 'admin'), NOW()),
  ('00000000-0000-0000-0000-000000000002', (SELECT id FROM public.roles WHERE name = 'manager'), NOW()),
  ('00000000-0000-0000-0000-000000000003', (SELECT id FROM public.roles WHERE name = 'user'), NOW()),
  ('00000000-0000-0000-0000-000000000004', (SELECT id FROM public.roles WHERE name = 'user'), NOW()),
  ('00000000-0000-0000-0000-000000000005', (SELECT id FROM public.roles WHERE name = 'manager'), NOW())
ON CONFLICT (user_id, role_id) DO NOTHING;

-- Insertar algunos registros de auditoría
INSERT INTO public.audit_logs (user_id, action, entity, entity_id, old_data, new_data, ip_address, created_at)
VALUES
  ('00000000-0000-0000-0000-000000000001', 'create', 'user', '00000000-0000-0000-0000-000000000003', NULL, '{"full_name": "María López", "email": "maria.lopez@orus.com"}', '192.168.1.1', NOW() - INTERVAL '2 days'),
  ('00000000-0000-0000-0000-000000000001', 'update', 'user', '00000000-0000-0000-0000-000000000002', '{"department": "Ventas"}', '{"department": "Ventas", "position": "Gerente"}', '192.168.1.1', NOW() - INTERVAL '1 day'),
  ('00000000-0000-0000-0000-000000000002', 'create', 'role', '00000000-0000-0000-0000-000000000004', NULL, '{"name": "guest", "description": "Usuario invitado con acceso de solo lectura"}', '192.168.1.2', NOW() - INTERVAL '12 hours'),
  ('00000000-0000-0000-0000-000000000005', 'login', 'auth', NULL, NULL, NULL, '192.168.1.5', NOW() - INTERVAL '2 hours')
