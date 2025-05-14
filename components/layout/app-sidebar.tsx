"use client";

import React from "react";
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
  ChevronDown,
} from "lucide-react";
import { useAppStore } from "@/lib/stores";
import { PermissionGuard } from "@/lib/auth/client-permissions";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import APP_MENUS_CONFIG_DATA from "../../data/apps-menu.json";

/**
 * @interface BadgeConfig
 * @description Define la configuración para un badge en un elemento del menú.
 */
export interface BadgeConfig {
  text: string | number;
  variant?: BadgeProps['variant'];
  iconName?: string;
}

/**
 * @interface MenuItem
 * @description Define la estructura de un elemento individual dentro de un menú de módulo.
 */
export interface MenuItem {
  label: string;
  href: string;
  permission?: string;
  iconName?: string;
  subItems?: MenuItem[];
  badge?: BadgeConfig;
}

/**
 * @interface ModuleMenuConfig
 * @description Define la configuración completa para el menú de un módulo específico.
 */
export interface ModuleMenuConfig {
  id: string;
  title: string;
  items: MenuItem[];
}

const APP_MENUS_CONFIG: ModuleMenuConfig[] = APP_MENUS_CONFIG_DATA as ModuleMenuConfig[];

const iconComponents: { [key: string]: LucideIcon } = {
  Home, BookOpen, Ticket, Users, Settings, ShieldAlert, LayoutGrid,
  FileText, GraduationCap, Award, LineChart, UserCog, ShieldCheck, History,
};

const getIconComponent = (iconName?: string): React.ReactElement | null => {
  if (!iconName) return null;
  const IconComponent = iconComponents[iconName];
  return IconComponent ? <IconComponent className="h-5 w-5" /> : null;
};

interface NavLinkItemProps {
  item: MenuItem;
  pathname: string;
  isSubItem?: boolean;
}

function NavLinkItem({ item, pathname, isSubItem = false }: NavLinkItemProps) {
  const Icon = getIconComponent(item.iconName);

  const checkActive = React.useCallback(
    (menuItem: MenuItem, currentPath: string): boolean => {
      let active = false;
      if (menuItem.href && menuItem.href !== "#") {
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
  const [isOpen, setIsOpen] = React.useState(
    isActive && !!item.subItems && item.subItems.length > 0
  );

  const renderBadge = (badgeConfig?: BadgeConfig) => {
    if (!badgeConfig) return null;
    const BadgeIconComponent = badgeConfig.iconName ? iconComponents[badgeConfig.iconName] : null;
    return (
      <Badge
        variant={badgeConfig.variant || "default"}
        className="ml-auto mr-2 flex-shrink-0 text-xs px-1.5 py-0.5 h-5 items-center"
      >
        {BadgeIconComponent && React.createElement(BadgeIconComponent, { className: "h-3 w-3 mr-0.5" })}
        {badgeConfig.text}
      </Badge>
    );
  };

  if (item.subItems && item.subItems.length > 0) {
    return (
      <Collapsible open={isOpen} onOpenChange={setIsOpen} className="space-y-1 w-full">
        <CollapsibleTrigger asChild>
          <button
            type="button"
            className={cn(
              "flex items-center justify-between w-full px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out rounded-md",
              isSubItem ? "pl-7" : "pl-3",
              isActive
                ? "bg-sky-100 dark:bg-sky-700/50 text-sky-700 dark:text-sky-100 font-semibold border-l-4 border-sky-600 dark:border-sky-400"
                : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-50",
              item.href === "#" && isActive && "bg-sky-100 dark:bg-sky-700/50 text-sky-700 dark:text-sky-100 font-semibold border-l-4 border-sky-600 dark:border-sky-400"
            )}
            aria-expanded={isOpen}
          >
            <span className="flex items-center flex-grow min-w-0">
              {Icon && <span className="mr-3 flex-shrink-0">{Icon}</span>}
              <span className="truncate">{item.label}</span>
            </span>
            {renderBadge(item.badge)}
            <ChevronDown
              className={cn("h-4 w-4 transition-transform duration-200", isOpen ? "rotate-180" : "")}
            />
          </button>
        </CollapsibleTrigger>
        <CollapsibleContent className="space-y-1 pt-1">
          {item.subItems.map((subItem) => (
            <div key={subItem.href || subItem.label} className={cn(isSubItem ? "pl-4" : "pl-7")}>
              <NavLinkItem item={subItem} pathname={pathname} isSubItem={true} />
            </div>
          ))}
        </CollapsibleContent>
      </Collapsible>
    );
  }

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center justify-between w-full px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out rounded-md",
        isSubItem ? "pl-7" : "pl-3",
        isActive
          ? "bg-sky-100 dark:bg-sky-700/50 text-sky-700 dark:text-sky-100 font-semibold border-l-4 border-sky-600 dark:border-sky-400"
          : "text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-slate-50"
      )}
    >
      <span className="flex items-center flex-grow min-w-0">
        {Icon && <span className="mr-3 flex-shrink-0">{Icon}</span>}
        <span className="truncate">{item.label}</span>
      </span>
      {renderBadge(item.badge)}
    </Link>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const { appSidebarOpen, toggleAppSidebar } = useAppStore();

  const pathSegments = pathname.split("/").filter(Boolean);
  let currentModuleId = "dashboard";

  if (pathSegments.length > 0 && pathSegments[0] === "dashboard") {
    if (pathSegments.length > 1) {
      const matchedModule = APP_MENUS_CONFIG.find(
        (menu) => menu.id === pathSegments[1]
      );
      if (matchedModule) {
        currentModuleId = matchedModule.id;
      }
    }
  } else if (pathSegments.length > 0 && pathSegments[0] !== "dashboard") {
    const matchedModule = APP_MENUS_CONFIG.find(
      (menu) => menu.id === pathSegments[0]
    );
    if (matchedModule) {
      currentModuleId = matchedModule.id;
    }
  }

  const activeMenuConfig = APP_MENUS_CONFIG.find(
    (menu) => menu.id === currentModuleId
  );

  if (!appSidebarOpen) return null;

  if (!activeMenuConfig) {
    console.warn(
      `[AppSidebar] No se encontró configuración de menú para el módulo: ${currentModuleId}. Pathname: ${pathname}`
    );
    return null;
  }

  return (
    <div className="bg-white dark:bg-slate-800 w-64 border-r border-slate-200 dark:border-slate-700 flex flex-col h-full">
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

      <div className="flex-1 overflow-y-auto p-4">
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
          Navegación para {activeMenuConfig.title}.
        </p>
        <nav className="space-y-1">
          {activeMenuConfig.items.map((item) => {
            const menuItemElement = (
              <NavLinkItem
                key={item.href || item.label}
                item={item}
                pathname={pathname}
              />
            );
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
            return menuItemElement;
          })}
        </nav>
      </div>
    </div>
  );
}
