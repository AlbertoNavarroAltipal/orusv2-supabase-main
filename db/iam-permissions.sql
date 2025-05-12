-- Insertar permisos para el módulo IAM
INSERT INTO public.permissions (id, name, description, resource, action, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000011', 'view_iam', 'Ver módulo IAM', 'iam', 'view', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000012', 'manage_permissions', 'Gestionar permisos', 'permissions', 'manage', NOW(), NOW()),
  ('00000000-0000-0000-0000-000000000013', 'view_audit', 'Ver registros de auditoría', 'audit', 'view', NOW(), NOW())
ON CONFLICT (resource, action) DO UPDATE 
SET 
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  updated_at = EXCLUDED.updated_at;

-- Asignar permisos IAM al rol admin
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
  (SELECT id FROM public.roles WHERE name = 'admin'),
  id,
  NOW()
FROM public.permissions 
WHERE name IN ('view_iam', 'manage_permissions', 'view_audit')
ON CONFLICT (role_id, permission_id) DO NOTHING;
