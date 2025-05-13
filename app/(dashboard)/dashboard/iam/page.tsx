import React from 'react';
import Link from 'next/link';
import PageSubheader from '@/components/dashboard/page-subheader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, KeyRound, ListChecks, Activity } from 'lucide-react'; // Importando iconos

const IAMDashboardPage = () => {
  const features = [
    {
      title: 'Usuarios',
      description: 'Gestiona todos los usuarios de tu organización, asigna roles y controla sus accesos.',
      href: '/dashboard/iam/usuarios',
      icon: <Users className="w-8 h-8 mb-2 text-blue-500" />,
    },
    {
      title: 'Roles',
      description: 'Define roles y asigna permisos específicos para simplificar la administración de accesos.',
      href: '/dashboard/iam/roles',
      icon: <Shield className="w-8 h-8 mb-2 text-green-500" />,
    },
    {
      title: 'Permisos',
      description: 'Administra los permisos detallados que pueden ser asignados a los roles.',
      href: '/dashboard/iam/permisos',
      icon: <KeyRound className="w-8 h-8 mb-2 text-yellow-500" />,
    },
    {
      title: 'Grupos',
      description: 'Organiza usuarios en grupos para facilitar la asignación masiva de roles y permisos.',
      href: '/dashboard/iam/grupos', // Asumiendo que existirá esta ruta
      icon: <Users className="w-8 h-8 mb-2 text-purple-500" />, // Reusando icono, idealmente uno específico para grupos
    },
    {
      title: 'Políticas de Acceso',
      description: 'Configura políticas de seguridad para controlar el acceso basado en condiciones.',
      href: '/dashboard/iam/politicas', // Asumiendo que existirá esta ruta
      icon: <ListChecks className="w-8 h-8 mb-2 text-red-500" />,
    },
    {
      title: 'Auditoría',
      description: 'Revisa los registros de actividad y cambios realizados en el sistema IAM.',
      href: '/dashboard/iam/auditoria',
      icon: <Activity className="w-8 h-8 mb-2 text-indigo-500" />,
    },
  ];

  return (
    <>
      <PageSubheader
        title="Panel de Control de IAM"
        description="Gestiona el acceso a tus recursos de forma segura y centralizada."
      />
      <div className="container mx-auto p-4 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <Link href={feature.href} key={feature.title} legacyBehavior>
              <a className="block hover:shadow-lg transition-shadow duration-200">
                <Card className="h-full flex flex-col">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-semibold">
                      {feature.title}
                    </CardTitle>
                    {feature.icon}
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </a>
            </Link>
          ))}
        </div>

        <div className="mt-12">
          <Card>
            <CardHeader>
              <CardTitle>Resumen de Seguridad</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Aquí se mostraría un resumen del estado de seguridad, como usuarios activos, roles asignados recientemente, y alertas de seguridad.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                  <h3 className="text-lg font-medium">Usuarios Activos</h3>
                  <p className="text-2xl font-bold">125</p> {/* Ejemplo */}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                  <h3 className="text-lg font-medium">Roles Definidos</h3>
                  <p className="text-2xl font-bold">15</p> {/* Ejemplo */}
                </div>
                <div className="p-4 bg-gray-50 rounded-lg dark:bg-gray-800">
                  <h3 className="text-lg font-medium">Alertas Recientes</h3>
                  <p className="text-2xl font-bold text-yellow-500">3</p> {/* Ejemplo */}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default IAMDashboardPage;