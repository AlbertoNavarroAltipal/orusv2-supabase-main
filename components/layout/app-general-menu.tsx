"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  X,
  Star,
  StarOff,
  Shield,
  Users,
  Network,
  Database,
  Code,
  RefreshCw,
  HardDrive,
  Server,
  GraduationCap,
  Ticket,
  DollarSign,
  PieChart,
  Building,
  Layers,
  Disc,
  Search,
  BarChart,
  Mail,
  Video,
  Link,
  Package,
  Grid,
  LayoutGrid,
  Clock,
  Heart,
  ExternalLink,
  Home,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

// Importamos los datos del menú
import menuData from "@/data/apps-general-menu.json";

interface AppGeneralMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AppItem {
  name: string;
  description: string;
  icon: string;
  href: string;
  starred: boolean;
  _id?: string; // ID único opcional para diferenciar aplicaciones con el mismo nombre y ruta
}

interface CategoryItem {
  name: string;
  apps: AppItem[];
}

interface MenuSection {
  id: string;
  title: string;
  apps?: AppItem[];
  categories?: CategoryItem[];
}

// Clave para almacenar favoritos en cookies
const FAVORITES_COOKIE_KEY = "orus_app_favorites";

export function AppGeneralMenu({ isOpen, onClose }: AppGeneralMenuProps) {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedApps, setSelectedApps] = useState<AppItem[]>([]);
  const [selectedSectionTitle, setSelectedSectionTitle] = useState<string>("");
  const [selectedSectionId, setSelectedSectionId] =
    useState<string>("recientes");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  // Filtrar aplicaciones según la búsqueda
  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) {
      return selectedApps;
    }

    const query = searchQuery.toLowerCase().trim();
    return selectedApps.filter(
      (app) =>
        app.name.toLowerCase().includes(query) ||
        app.description.toLowerCase().includes(query)
    );
  }, [selectedApps, searchQuery]);

  // Cargar favoritos desde cookies al iniciar
  useEffect(() => {
    const savedFavorites = Cookies.get(FAVORITES_COOKIE_KEY);
    if (savedFavorites) {
      try {
        const parsedFavorites = JSON.parse(savedFavorites);
        if (Array.isArray(parsedFavorites)) {
          setFavoriteIds(parsedFavorites);
        }
      } catch (error) {
        console.error("Error parsing favorites from cookies:", error);
      }
    }
  }, []);

  // Cerrar el menú con la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  // Prevenir scroll del body cuando el menú está abierto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  // Inicializar la primera sección
  useEffect(() => {
    if (menuData.length > 0) {
      // Si hay favoritos guardados, mostrar la sección de favoritos primero
      if (favoriteIds.length > 0) {
        const favoritesSection = menuData.find(
          (section) => section.id === "favoritos"
        );
        if (favoritesSection) {
          setSelectedSectionId("favoritos");
          setSelectedSectionTitle(favoritesSection.title);
          updateFavoritesSection();
          return;
        }
      }

      // Si no hay favoritos, mostrar la primera sección
      const firstSection = menuData[0];
      setSelectedSectionId(firstSection.id);
      setSelectedSectionTitle(firstSection.title);
      if (firstSection.apps) {
        // Asignar IDs únicos a las aplicaciones
        const appsWithIds = firstSection.apps.map((app, index) => ({
          ...app,
          _id: `${firstSection.id}-${app.name}-${index}`
        }));
        setSelectedApps(appsWithIds);
        setSelectedCategory(null);
      } else if (
        firstSection.categories &&
        firstSection.categories.length > 0
      ) {
        const firstCategory = firstSection.categories[0];
        setSelectedCategory(firstCategory.name);
        // Asignar IDs únicos a las aplicaciones
        const appsWithIds = firstCategory.apps.map((app, index) => ({
          ...app,
          _id: `${firstCategory.name}-${app.name}-${index}`
        }));
        setSelectedApps(appsWithIds);
      }
    }
  }, [favoriteIds]);

  if (!isOpen) return null;

  const handleNavigate = (href: string) => {
    router.push(href);
    onClose();
  };

  const handleCategoryClick = (category: CategoryItem) => {
    setSelectedCategory(category.name);
    // Asignar IDs únicos a las aplicaciones
    const appsWithIds = category.apps.map((app, index) => ({
      ...app,
      _id: `${category.name}-${app.name}-${index}`
    }));
    setSelectedApps(appsWithIds);
    setSelectedSectionTitle(category.name);
  };

  const handleSectionClick = (section: MenuSection) => {
    setSelectedSectionId(section.id);
    setSelectedSectionTitle(section.title);
    
    if (section.id === "favoritos") {
      updateFavoritesSection();
    } else if (section.apps) {
      // Asignar IDs únicos a las aplicaciones
      const appsWithIds = section.apps.map((app, index) => ({
        ...app,
        _id: `${section.id}-${app.name}-${index}`
      }));
      setSelectedApps(appsWithIds);
      setSelectedCategory(null);
    } else if (section.categories && section.categories.length > 0) {
      const firstCategory = section.categories[0];
      setSelectedCategory(firstCategory.name);
      // Asignar IDs únicos a las aplicaciones
      const appsWithIds = firstCategory.apps.map((app, index) => ({
        ...app,
        _id: `${firstCategory.name}-${app.name}-${index}`
      }));
      setSelectedApps(appsWithIds);
    }
  };

  // Manejar la acción de marcar/desmarcar favoritos
  const handleToggleFavorite = (app: AppItem, e: React.MouseEvent) => {
    e.stopPropagation();

    let newFavorites: string[];
    if (favoriteIds.includes(app.name)) {
      // Quitar de favoritos
      newFavorites = favoriteIds.filter((id) => id !== app.name);
    } else {
      // Añadir a favoritos
      newFavorites = [...favoriteIds, app.name];
    }

    // Actualizar estado
    setFavoriteIds(newFavorites);

    // Guardar en cookies (expira en 30 días)
    Cookies.set(FAVORITES_COOKIE_KEY, JSON.stringify(newFavorites), {
      expires: 30,
    });

    // Si estamos en la sección de favoritos, actualizar la lista
    if (selectedSectionId === "favoritos") {
      updateFavoritesSection();
    }
  };

  // Mapa de iconos para renderizar dinámicamente
  const iconMap: Record<string, React.ReactNode> = {
    Shield: <Shield className="h-5 w-5" />,
    Users: <Users className="h-5 w-5" />,
    Network: <Network className="h-5 w-5" />,
    Database: <Database className="h-5 w-5" />,
    Code: <Code className="h-5 w-5" />,
    RefreshCw: <RefreshCw className="h-5 w-5" />,
    HardDrive: <HardDrive className="h-5 w-5" />,
    Server: <Server className="h-5 w-5" />,
    GraduationCap: <GraduationCap className="h-5 w-5" />,
    Ticket: <Ticket className="h-5 w-5" />,
    DollarSign: <DollarSign className="h-5 w-5" />,
    PieChart: <PieChart className="h-5 w-5" />,
    Building: <Building className="h-5 w-5" />,
    Layers: <Layers className="h-5 w-5" />,
    Disc: <Disc className="h-5 w-5" />,
    Search: <Search className="h-5 w-5" />,
    BarChart: <BarChart className="h-5 w-5" />,
    Mail: <Mail className="h-5 w-5" />,
    Video: <Video className="h-5 w-5" />,
    Link: <Link className="h-5 w-5" />,
    Package: <Package className="h-5 w-5" />,
    Grid: <Grid className="h-5 w-5" />,
  };

  // Función para renderizar el icono dinámicamente
  const renderIcon = (iconName: string) => {
    return iconMap[iconName] || <LayoutGrid className="h-5 w-5" />;
  };

  // Iconos para las secciones principales
  const sectionIcons: Record<string, React.ReactNode> = {
    recientes: <Clock className="h-5 w-5" />,
    favoritos: <Heart className="h-5 w-5" />,
    externas: <ExternalLink className="h-5 w-5" />,
    orus: <Home className="h-5 w-5" />,
    categorias: <Grid className="h-5 w-5" />,
  };

  // Función para actualizar la sección de favoritos
  function updateFavoritesSection() {
    // Recopilar todas las aplicaciones de todas las secciones
    const allApps: AppItem[] = [];
    let index = 0;
    
    menuData.forEach((section) => {
      if (section.apps) {
        // Añadir un índice único a cada aplicación
        section.apps.forEach(app => {
          allApps.push({
            ...app,
            _id: `${section.id}-${app.name}-${index++}`
          });
        });
      } else if (section.categories) {
        section.categories.forEach((category) => {
          category.apps.forEach(app => {
            allApps.push({
              ...app,
              _id: `${category.name}-${app.name}-${index++}`
            });
          });
        });
      }
    });

    // Filtrar solo las aplicaciones favoritas
    const favoriteApps = allApps.filter((app) =>
      favoriteIds.includes(app.name)
    );
    setSelectedApps(favoriteApps);
    setSelectedCategory(null);
  }

  // Manejar cambios en el campo de búsqueda
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <>
      {isOpen && (
        <>
          {/* Overlay ligero solo para capturar clics fuera del menú */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={onClose}
          />

          {/* Megamenú */}
          <div
            className="fixed top-16 left-0 right-0 z-50 mx-auto w-[95vw] max-w-7xl bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200 animate-in slide-in-from-top-5 fade-in duration-300"
            style={{ maxHeight: "calc(100vh - 5rem)" }}
          >
            <div className="flex flex-col h-full">
              {/* Cabecera del menú */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <LayoutGrid className="h-6 w-6 mr-2 text-blue-600" />
                  Aplicaciones ORUS
                </h2>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Buscar aplicación..."
                      className="pl-9 pr-4 py-2 rounded-full text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-64 transition-all"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-5 w-5" />
                    <span className="sr-only">Cerrar</span>
                  </Button>
                </div>
              </div>

              <div className="flex h-[70vh]">
                {/* Barra lateral de navegación */}
                <div className="w-56 bg-gray-50 border-r border-gray-200 flex flex-col">
                  <ScrollArea className="flex-1">
                    <div className="p-2">
                      {menuData.map((section) => (
                        <button
                          key={section.id}
                          className={cn(
                            "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left mb-1 transition-all",
                            selectedSectionId === section.id
                              ? "bg-blue-100 text-blue-800 font-medium"
                              : "text-gray-700 hover:bg-gray-100"
                          )}
                          onClick={() => handleSectionClick(section)}
                        >
                          {sectionIcons[section.id] || (
                            <LayoutGrid className="h-5 w-5" />
                          )}
                          <span>{section.title}</span>
                          <ChevronRight
                            className={cn(
                              "h-4 w-4 ml-auto transition-transform",
                              selectedSectionId === section.id
                                ? "text-blue-600 rotate-90"
                                : "text-gray-400"
                            )}
                          />
                        </button>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Contenido principal */}
                <div className="flex-1 flex flex-col">
                  {/* Título de la sección */}
                  <div className="p-4 border-b border-gray-200 bg-white">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      {sectionIcons[selectedSectionId] || (
                        <LayoutGrid className="h-5 w-5 mr-2 text-blue-600" />
                      )}
                      <span className="ml-2">{selectedSectionTitle}</span>
                    </h3>
                  </div>

                  <div className="flex flex-1 overflow-hidden">
                    {/* Panel de categorías (solo visible para la sección "categorias") */}
                    {selectedSectionId === "categorias" && (
                      <div className="w-64 border-r border-gray-200 bg-white">
                        <ScrollArea className="h-full">
                          <div className="p-2">
                            {menuData
                              .find((s) => s.id === "categorias")
                              ?.categories?.map((category) => (
                                <button
                                  key={category.name}
                                  className={cn(
                                    "w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-left mb-1 transition-all",
                                    selectedCategory === category.name
                                      ? "bg-blue-100 text-blue-800 font-medium"
                                      : "text-gray-700 hover:bg-gray-100"
                                  )}
                                  onClick={() => handleCategoryClick(category)}
                                >
                                  <span>{category.name}</span>
                                  <ChevronRight
                                    className={cn(
                                      "h-4 w-4 ml-auto",
                                      selectedCategory === category.name
                                        ? "text-blue-600"
                                        : "text-gray-400"
                                    )}
                                  />
                                </button>
                              ))}
                          </div>
                        </ScrollArea>
                      </div>
                    )}

                    {/* Panel de aplicaciones */}
                    <div className="flex-1 bg-white">
                      <ScrollArea className="h-full">
                        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {searchQuery.trim() && filteredApps.length === 0 ? (
                            <div className="col-span-3 flex flex-col items-center justify-center py-10 text-gray-500">
                              <Search className="h-12 w-12 mb-4 text-gray-300" />
                              <p className="text-lg font-medium">
                                No se encontraron resultados para "{searchQuery}
                                "
                              </p>
                              <p className="text-sm mt-2">
                                Intenta con otra búsqueda o navega por las
                                categorías
                              </p>
                            </div>
                          ) : (
                            (searchQuery.trim()
                              ? filteredApps
                              : selectedApps
                            ).map((app, index) => (
                              <div
                                key={
                                  app._id || `${app.name}-${app.href}-${index}`
                                }
                                className="group flex flex-col h-full bg-white border border-gray-200 hover:border-blue-300 rounded-xl p-4 cursor-pointer transition-all hover:shadow-md animate-in fade-in duration-300"
                                onClick={() => handleNavigate(app.href)}
                              >
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex items-center">
                                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-2.5 rounded-lg text-blue-700 mr-3">
                                      {renderIcon(app.icon)}
                                    </div>
                                    <h4 className="font-medium text-gray-900 group-hover:text-blue-700 transition-colors">
                                      {app.name}
                                    </h4>
                                  </div>
                                  <button
                                    className="text-gray-400 hover:text-yellow-500 transition-colors"
                                    onClick={(e) =>
                                      handleToggleFavorite(app, e)
                                    }
                                    title={
                                      favoriteIds.includes(app.name)
                                        ? "Quitar de favoritos"
                                        : "Añadir a favoritos"
                                    }
                                  >
                                    {favoriteIds.includes(app.name) ? (
                                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    ) : (
                                      <StarOff className="h-5 w-5" />
                                    )}
                                  </button>
                                </div>
                                <p className="text-sm text-gray-600 flex-1">
                                  {app.description}
                                </p>
                                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
                                  <span className="text-xs text-blue-600 font-medium flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    Abrir aplicación
                                    <ArrowRight className="h-3 w-3 ml-1" />
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </ScrollArea>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pie del menú */}
              <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-500">
                  <Home className="h-4 w-4 mr-1 text-gray-400" />
                  <span>Página de inicio</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs bg-white hover:bg-blue-50 text-blue-700 border-blue-200 hover:border-blue-300"
                  onClick={() => handleNavigate("/dashboard")}
                >
                  Ir al dashboard
                  <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
