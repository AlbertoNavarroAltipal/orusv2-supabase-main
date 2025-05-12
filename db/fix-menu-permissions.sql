-- Asegurar que existan los permisos necesarios para el menú global
INSERT INTO public.permissions (id, name, description, resource, action, created_at, updated_at)
VALUES 
  (uuid_generate_v4(), 'view_iam', 'Ver módulo IAM', 'iam', 'view', NOW(), NOW()),
  (uuid_generate_v4(), 'view_logistics', 'Ver módulo de logística', 'logistics', 'view', NOW(), NOW()),
  (uuid_generate_v4(), 'view_hr', 'Ver módulo de recursos humanos', 'hr', 'view', NOW(), NOW()),
  (uuid_generate_v4(), 'view_reports', 'Ver módulo de reportes', 'reports', 'view', NOW(), NOW()),
  (uuid_generate_v4(), 'view_purchases', 'Ver módulo de compras', 'purchases', 'view', NOW(), NOW()),
  (uuid_generate_v4(), 'view_documents', 'Ver módulo de documentos', 'documents', 'view', NOW(), NOW()),
  (uuid_generate_v4(), 'view_settings', 'Ver módulo de configuración', 'settings', 'view', NOW(), NOW())
ON CONFLICT (resource, action) DO NOTHING;

-- Asignar todos estos permisos al rol de administrador
INSERT INTO public.role_permissions (role_id, permission_id, created_at)
SELECT 
  (SELECT id FROM public.roles WHERE name = 'admin'),
  id,
  NOW()
FROM public.permissions 
WHERE name IN ('view_iam', 'view_logistics', 'view_hr', 'view_reports', 'view_purchases', 'view_documents', 'view_settings')
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Verificar que el usuario actual tenga el rol de administrador
-- Asumiendo que el usuario actual es el primero en la tabla profiles
DO $$
DECLARE
  user_id uuid;
  admin_role_id uuid;
BEGIN
  -- Obtener el ID del primer usuario
  SELECT id INTO user_id FROM profiles LIMIT 1;
  
  -- Obtener el ID del rol admin
  SELECT id INTO admin_role_id FROM roles WHERE name = 'admin';
  
  -- Asignar el rol admin al usuario si no lo tiene ya
  IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = user_id AND role_id = admin_role_id) THEN
    INSERT INTO user_roles (user_id, role_id, created_at)
    VALUES (user_id, admin_role_id, NOW());
  END IF;
END $$;

-- Mostrar los permisos actuales para verificación
SELECT p.name, p.resource, p.action
FROM permissions p
ORDER BY p.resource, p.name;

-- Mostrar los roles y sus permisos
SELECT r.name as role_name, p.name as permission_name
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
ORDER BY r.name, p.name;

-- Mostrar los usuarios y sus roles
SELECT pr.full_name, r.name as role_name
FROM profiles pr
JOIN user_roles ur ON pr.id = ur.user_id
JOIN roles r ON ur.role_id = r.id
ORDER BY pr.full_name, r.name;
