"use client";

import React from "react"; // Corregido: import React en lugar de import type React
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  Home,
  BookOpen,
  Ticket,
  Users,
  Settings,
  ShieldAlert,
  LayoutGrid,
  FileText,
  GraduationCap,
  Award,
  LineChart,
  UserCog,
  ShieldCheck,
  History,
  type LucideIcon,
  ChevronDown, // Para el indicador de submenú
} from "lucide-react";
import { useAppStore } from "@/lib/stores";
import { PermissionGuard } from "@/lib/auth/client-permissions";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"; // Importar Collapsible
// Importa la configuración del menú desde el archivo JSON.
// La ruta es relativa desde este archivo (components/layout/) hasta data/
import APP_MENUS_CONFIG_DATA from "../../data/apps-menu.json";

/**
 * @interface NavLinkProps
 * @description Define las propiedades esperadas por el componente `NavLink`.
 * @property {string} href - La URL destino del enlace.
 * @property {string} pathname - La ruta actual de la URL, utilizada para determinar si el enlace está activo.
 * @property {React.ReactNode} children - El contenido renderizable dentro del enlace, usualmente texto o un icono.
 */
interface NavLinkProps {
  href: string;
  pathname: string;
  children: React.ReactNode;
}

/**
 * @function NavLink
 * @description Componente reutilizable para renderizar un enlace de navegación. (Este componente ya no se usa directamente en el mapeo, NavLinkItem lo reemplaza)
 * Determina si el enlace está activo comparando `href` con `pathname` y aplica estilos condicionales.
 * @param {NavLinkProps} props - Las propiedades del componente.
 * @returns {JSX.Element} Un elemento Link de Next.js estilizado.
 */
// function NavLink({ href, pathname, children }: NavLinkProps) {
//   // Determina si el enlace está activo.
//   const isActive =
//     pathname === href ||
//     (href !== "/dashboard" &&
//       !APP_MENUS_CONFIG.some(
//         (m) =>
//           m.id !== "dashboard" &&
//           href.startsWith(`/dashboard/${m.id}`) &&
//           href === `/dashboard/${m.id}`
//       ) &&
//       pathname.startsWith(href) &&
//       (pathname[href.length] === "/" || pathname.length === href.length));

//   return (
//     <Link
//       href={href}
//       className={cn(
//         "flex items-center px-4 py-2 text-sm font-medium transition-colors duration-150 ease-in-out rounded-md",
//         isActive
//           ? "bg-[#004F9F] text-white"
//           : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-50"
//       )}
//     >
//       {children}
//     </Link>
//   );
// }

/**
 * @interface MenuItem
 * @description Define la estructura de un elemento individual dentro de un menú de módulo.
 * @property {string} label - El texto visible del elemento del menú.
 * @property {string} href - La URL a la que navega este elemento del menú.
 * @property {string} [permission] - (Opcional) El identificador del permiso necesario para visualizar este elemento.
 *                                  Si se proporciona, el elemento estará envuelto en un `PermissionGuard`.
 * @property {string} [iconName] - (Opcional) El nombre de un icono de `lucide-react` para mostrar junto al `label`.
 */
export interface MenuItem {
  label: string;
  href: string; // Puede ser '#' o una ruta real si el padre es clickeable
  permission?: string;
  iconName?: string;
  subItems?: MenuItem[]; // Para los submenús
}

/**
 * @interface ModuleMenuConfig
 * @description Define la configuración completa para el menú de un módulo específico de la aplicación.
 * @property {string} id - Un identificador único para el módulo (ej. "dashboard", "escuela-altipal").
 *                         Este `id` se utiliza para hacer coincidir la ruta actual con el módulo correspondiente.
 * @property {string} title - El título que se mostrará en la cabecera del sidebar cuando este módulo esté activo.
 * @property {MenuItem[]} items - Un array de objetos `MenuItem` que componen el menú de este módulo.
 */
export interface ModuleMenuConfig {
  id: string;
  title: string;
  items: MenuItem[];
}

// Aseguramos que los datos importados del JSON se ajustan a nuestra interfaz.
const APP_MENUS_CONFIG: ModuleMenuConfig[] = APP_MENUS_CONFIG_DATA;

// Mapeo de nombres de iconos a componentes de Lucide.
// Esto permite definir los iconos como strings en el JSON y centralizar la importación de componentes aquí.
const iconComponents: { [key: string]: LucideIcon } = {
  Home,
  BookOpen,
  Ticket,
  Users,
  Settings,
  ShieldAlert,
  LayoutGrid,
  FileText,
  GraduationCap,
  Award,
  LineChart,
  UserCog,
  ShieldCheck,
  History,
};

/**
 * @function getIconComponent
 * @description Devuelve el componente de icono de Lucide correspondiente a un nombre de icono.
 * @param {string} [iconName] - El nombre del icono (debe coincidir con una clave en `iconComponents`).
 * @returns {React.ReactElement | null} El componente de icono o null si no se encuentra.
 */
const getIconComponent = (iconName?: string): React.ReactElement | null => {
  if (!iconName) return null;
  const IconComponent = iconComponents[iconName];
  return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
};

/**
 * @interface NavLinkItemProps
 * @description Props para el componente NavLinkItem, que puede renderizar un enlace o un submenú.
 */
interface NavLinkItemProps {
  item: MenuItem;
  pathname: string;
  isSubItem?: boolean;
}

/**
 * @function NavLinkItem
 * @description Componente recursivo para renderizar un elemento de menú.
 * Puede ser un enlace directo o un grupo colapsable de sub-enlaces.
 * Maneja el estado de expansión de los submenús y la lógica de activación.
 */
function NavLinkItem({ item, pathname, isSubItem = false }: NavLinkItemProps) {
  const Icon = getIconComponent(item.iconName);

  // Función recursiva para determinar si el item actual o alguno de sus subitems está activo.
  // Un item se considera activo si su `href` coincide con el `pathname` o si es un prefijo del `pathname`.
  const checkActive = React.useCallback(
    (menuItem: MenuItem, currentPath: string): boolean => {
      let active = false;
      if (menuItem.href && menuItem.href !== "#") {
        // Ignorar href="#" para la activación directa del padre
        // Lógica de activación exacta o por prefijo
        active =
          currentPath === menuItem.href ||
          (menuItem.href !== "/dashboard" &&
            currentPath.startsWith(menuItem.href) &&
            (currentPath[menuItem.href.length] === "/" ||
              currentPath.length === menuItem.href.length));
      }

      if (active) return true;

      if (menuItem.subItems) {
        return menuItem.subItems.some((sub) => checkActive(sub, currentPath));
      }
      return false;
    },
    []
  );

  const isActive = checkActive(item, pathname);

  // Estado para el Collapsible. Se inicializa abierto si el item o un subitem está activo.
  const [isOpen, setIsOpen] = React.useState(
    isActive && !!item.subItems && item.subItems.length > 0
  );

  // Si el item tiene subItems, se renderiza como un Collapsible.
  if (item.subItems && item.subItems.length > 0) {
    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="space-y-1 w-full"
      >
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex items-center justify-between w-full px-3 py-2 text-sm font-medium transition-colors duration-150 ease-in-out rounded-md",
              isSubItem ? "pl-7" : "pl-3", // Ajuste de padding
              isActive
                ? "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100 font-semibold" // Estilo padre activo
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-50",
              // Aplicar estilo de "activo" al trigger si no es un enlace real y un subitem está activo
              item.href === "#" &&
                isActive &&
                "bg-sky-100 text-sky-700 dark:bg-sky-700 dark:text-sky-100 font-semibold"
            )}
            aria-expanded={isOpen}
          >
            <span className="flex items-center">
              {Icon && <span className="mr-3">{Icon}</span>}{" "}
              {/* Aumentado mr para icono */}
              {item.label}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                isOpen ? "rotate-180" : ""
              )}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 pt-1">
          {item.subItems.map((subItem) => (
            <div
              key={subItem.href || subItem.label}
              className={cn(isSubItem ? "pl-4" : "pl-7")}
            >
              {" "}
              {/* Nivel de indentación */}
              <NavLinkItem
                item={subItem}
                pathname={pathname}
                isSubItem={true}
              />
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  // Si no tiene subItems, se renderiza como un Link simple.
  return (
    <Link
      href={item.href} // Asegurarse que href no sea "#" para links directos
      className={cn(
        "flex items-center px-3 py-2 text-sm font-medium transition-colors duration-150 ease-in-out rounded-md",
        isSubItem ? "pl-7" : "pl-3", // Ajuste de padding
        isActive
          ? "bg-[#004F9F] text-white font-semibold" // Estilo item activo
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-50"
      )}
    >
      {Icon && <span className="mr-3">{Icon}</span>}{" "}
      {/* Aumentado mr para icono */}
      {item.label}
    </Link>
  );
}

/**
 * @function AppSidebar
 * @description Componente principal del sidebar de la aplicación.
 * Se encarga de:
 * 1. Determinar el módulo de la aplicación actualmente activo basado en la ruta (`pathname`).
 * 2. Obtener la configuración del menú para el módulo activo desde `APP_MENUS_CONFIG`.
 * 3. Renderizar el título del módulo y la lista de enlaces de navegación (`NavLink`).
 * 4. Controlar la visibilidad del sidebar a través del estado global `appSidebarOpen` de `useAppStore`.
 * 5. Utilizar `PermissionGuard` para mostrar/ocultar elementos del menú basados en los permisos del usuario.
 *
 * La lógica para determinar el módulo activo prioriza las coincidencias más específicas.
 * Por ejemplo, si la ruta es `/dashboard/escuela-altipal/cursos`, el módulo activo será `escuela-altipal`.
 * Si la ruta es `/dashboard`, el módulo activo será `dashboard`.
 *
 * @returns {JSX.Element | null} El componente del sidebar renderizado, o `null` si `appSidebarOpen` es `false`
 *                               o si no se encuentra una configuración de menú válida.
 */
export function AppSidebar() {
  const pathname = usePathname();
  const { appSidebarOpen, toggleAppSidebar } = useAppStore();

  // Determinar el módulo activo.
  // Divide la ruta en segmentos y filtra los vacíos (ej. de '/foo//bar/' a ['foo', 'bar']).
  const pathSegments = pathname.split("/").filter(Boolean);

  let currentModuleId = "dashboard"; // Módulo por defecto si no se encuentra uno más específico.

  if (pathSegments.length > 0 && pathSegments[0] === "dashboard") {
    if (pathSegments.length > 1) {
      // Si hay un segundo segmento (ej. 'escuela-altipal' en '/dashboard/escuela-altipal'),
      // intenta encontrar un módulo que coincida con ese segundo segmento.
      const matchedModule = APP_MENUS_CONFIG.find(
        (menu) => menu.id === pathSegments[1]
      );
      if (matchedModule) {
        currentModuleId = matchedModule.id;
      }
      // Si no hay coincidencia (ej. /dashboard/perfil), `currentModuleId` permanece 'dashboard',
      // lo que mostrará el menú principal del dashboard.
    }
    // Si solo es '/dashboard', `currentModuleId` ya es 'dashboard'.
  } else if (pathSegments.length > 0 && pathSegments[0] !== "dashboard") {
    // Para módulos futuros que no estén bajo '/dashboard'.
    const matchedModule = APP_MENUS_CONFIG.find(
      (menu) => menu.id === pathSegments[0]
    );
    if (matchedModule) {
      currentModuleId = matchedModule.id;
    }
  }

  // Encuentra la configuración del menú para el módulo activo.
  const activeMenuConfig = APP_MENUS_CONFIG.find(
    (menu) => menu.id === currentModuleId
  );

  // No renderizar el sidebar si está cerrado por el store.
  if (!appSidebarOpen) return null;

  // Si, por alguna razón, no se encuentra una configuración de menú (esto no debería suceder
  // si 'dashboard' siempre existe como fallback en apps-menu.json), no renderizar nada.
  if (!activeMenuConfig) {
    console.warn(
      `[AppSidebar] No se encontró configuración de menú para el módulo: ${currentModuleId}. Pathname: ${pathname}`
    );
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 w-64 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full">
      {/* Cabecera del Sidebar */}
      <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
        <h2 className="font-semibold text-slate-900 dark:text-slate-50 text-lg">
          {activeMenuConfig.title}
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleAppSidebar}
          className="text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-700"
          aria-label="Cerrar menú lateral"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="sr-only">Cerrar menú</span>
        </Button>
      </div>

      {/* Contenedor de los elementos del menú */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Párrafo descriptivo opcional. Se puede eliminar si no es necesario. */}
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Navegación para {activeMenuConfig.title}.
        </p>

        <nav className="space-y-1">
          {" "}
          {/* Reducido space-y para un look más compacto si hay muchos items */}
          {activeMenuConfig.items.map((item) => {
            // Renderiza cada item de nivel superior usando NavLinkItem.
            // NavLinkItem manejará internamente si es un enlace o un submenú.
            const menuItemElement = (
              <NavLinkItem
                key={item.href || item.label} // Usar label como fallback para key si href es '#'
                item={item}
                pathname={pathname}
              />
            );

            // Si el item requiere un permiso, lo envuelve en PermissionGuard.
            // Esto se aplica al item de nivel superior y sus subitems se renderizarán dentro si el padre tiene permiso.
            if (item.permission) {
              return (
                <PermissionGuard
                  key={`${item.href || item.label}-guard`}
                  permission={item.permission}
                >
                  {menuItemElement}
                </PermissionGuard>
              );
            }
            // Si no requiere permiso, devuelve el NavLinkItem directamente.
            return menuItemElement;
          })}
        </nav>
      </div>
    </div>
  );
}
