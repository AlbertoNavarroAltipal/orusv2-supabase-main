"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "./components/header";
import DataTable, { UserData } from "./components/data-table";
import { fetchMockData } from "./data/mock-data";

function PlantillaPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Inicializar estado desde URL o con valores por defecto
  const initialPage = parseInt(searchParams.get("page") || "1", 10);
  const initialLimit = parseInt(searchParams.get("limit") || "10", 10);

  const [data, setData] = useState<UserData[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [itemsPerPage, setItemsPerPage] = useState(initialLimit);
  const [sortBy, setSortBy] = useState<keyof UserData | null>(null); // Podría leerse de URL también
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc"); // Podría leerse de URL también
  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  ); // Leer search de URL
  const [isLoading, setIsLoading] = useState(true);

  // Efecto para actualizar la URL cuando cambian los parámetros de paginación o búsqueda
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", currentPage.toString());
    params.set("limit", itemsPerPage.toString());
    if (searchTerm) {
      params.set("search", searchTerm);
    } else {
      params.delete("search");
    }
    // Aquí también se podrían añadir sortBy y sortOrder a la URL si se desea
    // if (sortBy) params.set('sortBy', sortBy);
    // if (sortOrder) params.set('sortOrder', sortOrder);

    // Usar replace para no llenar el historial del navegador con cada cambio de filtro/página
    router.replace(`?${params.toString()}`, { scroll: false });
  }, [
    currentPage,
    itemsPerPage,
    searchTerm,
    sortBy,
    sortOrder,
    router,
    searchParams,
  ]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    // Asegurarse de que currentPage e itemsPerPage sean números válidos antes de usarlos
    const validPage =
      Number.isFinite(currentPage) && currentPage > 0 ? currentPage : 1;
    const validLimit =
      Number.isFinite(itemsPerPage) && itemsPerPage > 0 ? itemsPerPage : 10;

    try {
      const result = await fetchMockData({
        offset: (validPage - 1) * validLimit,
        limit: validLimit,
        sortBy: sortBy || undefined,
        sortOrder: sortOrder,
        searchTerm: searchTerm,
      });
      setData(result.data);
      setTotalItems(result.total);
    } catch (error) {
      console.error("Error fetching data:", error);
      // Manejar el error, quizás mostrar un mensaje al usuario
      setData([]); // Limpiar datos en caso de error
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, itemsPerPage, sortBy, sortOrder, searchTerm]); // No incluir router o searchParams aquí para evitar bucles

  useEffect(() => {
    loadData();
  }, [loadData]); // loadData ya tiene todas las dependencias necesarias

  // Sincronizar el estado con los parámetros de la URL al montar y cuando cambian los searchParams
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get("page") || "1", 10);
    const limitFromUrl = parseInt(searchParams.get("limit") || "10", 10);
    const searchFromUrl = searchParams.get("search") || "";

    if (pageFromUrl !== currentPage) setCurrentPage(pageFromUrl);
    if (limitFromUrl !== itemsPerPage) setItemsPerPage(limitFromUrl);
    if (searchFromUrl !== searchTerm) setSearchTerm(searchFromUrl);
    // Aquí también se podría sincronizar sortBy y sortOrder si se guardan en la URL
  }, [searchParams]);

  const handleSort = useCallback((columnKey: keyof UserData) => {
    setSortBy((currentSortBy) => {
      if (currentSortBy === columnKey) {
        setSortOrder((prevOrder) => (prevOrder === "asc" ? "desc" : "asc"));
        return currentSortBy;
      } else {
        setSortOrder("asc");
        return columnKey;
      }
    });
    setCurrentPage(1);
  }, []); // sortBy y setSortOrder son estables o no necesitan estar aquí si la lógica interna los maneja bien

  const handleSearchTermChange = useCallback((term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  }, []); // setSearchTerm y setCurrentPage son estables

  const handleItemsPerPageChange = useCallback((value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  }, []); // setItemsPerPage y setCurrentPage son estables

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []); // setCurrentPage es estable

  return (
    <div className="container mx-auto py-10">
      <Header
        searchTerm={searchTerm}
        onSearchTermChange={handleSearchTermChange}
      />
      <DataTable
        data={data}
        totalItems={totalItems}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
        onItemsPerPageChange={handleItemsPerPageChange}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortChange={handleSort}
        isLoading={isLoading}
      />
    </div>
  );
}

// Envolver el componente con Suspense porque useSearchParams lo requiere
export default function PlantillaPage() {
  return (
    <Suspense fallback={<div>Cargando configuración de página...</div>}>
      <PlantillaPageContent />
    </Suspense>
  );
}
