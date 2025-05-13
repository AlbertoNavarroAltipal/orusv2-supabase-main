"use client";

import {
  type ColumnDef, // ColumnDef sigue siendo útil si se accede a table.options.columns, pero no es una prop directa
  flexRender,
  // getCoreRowModel, // Ya no se llama aquí
  // useReactTable, // Ya no se llama aquí
  type SortingState,
  // getSortedRowModel, // Ya no se llama aquí
  type ColumnFiltersState,
  // getFilteredRowModel, // Ya no se llama aquí
  type PaginationState,
  type OnChangeFn,
  type Row,
  type Table as TanstackTable, // Renombrar para evitar conflicto con el componente Table de UI
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import React from "react"; // Importar React

// TValue ya no es relevante para las props directas de DataTable si columns no es una prop
interface DataTableProps<TData> {
  table: TanstackTable<TData>; // Prop para la instancia de la tabla
  rowContextMenuContent?: (row: Row<TData>) => React.ReactNode;
  lineWrap?: boolean; // Prop para el ajuste de línea
  tableDensity?: "compact" | "normal" | "comfortable"; // Prop para la densidad
}

export function DataTable<TData>({
  table,
  rowContextMenuContent,
  lineWrap,
  tableDensity,
}: DataTableProps<TData>) {
  return (
    <div>
      {/* El input de filtro y los botones de paginación se manejan fuera de este componente */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width: header.getSize(), // Usar directamente header.getSize()
                      position: 'relative', // Necesario para el posicionamiento absoluto del resizer
                    }}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${
                          header.column.getIsResizing() ? 'isResizing' : ''
                        }`}
                        style={{
                          position: 'absolute',
                          right: 0,
                          top: 0,
                          height: '100%',
                          width: '5px', // Ancho del área de agarre para redimensionar
                          background: header.column.getIsResizing() ? 'blue' : 'transparent', // Color visible durante el redimensionamiento
                          cursor: 'col-resize',
                          userSelect: 'none',
                          touchAction: 'none',
                          zIndex: 1, // Asegurar que esté por encima del contenido del header
                        }}
                      />
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => {
                // Intentar obtener el contenido del menú contextual de la meta de la columna 'actions'
                // o usar la prop rowContextMenuContent si se proporciona globalmente.
                let contextMenuContentForThisRow: React.ReactNode = null;
                
                const actionsColumn = table.getColumn("actions"); // Asumimos que la columna de acciones se llama 'actions'
                if (actionsColumn && actionsColumn.columnDef.meta && typeof (actionsColumn.columnDef.meta as any).rowContextMenu === 'function') {
                  contextMenuContentForThisRow = (actionsColumn.columnDef.meta as any).rowContextMenu(row);
                } else if (rowContextMenuContent) {
                  contextMenuContentForThisRow = rowContextMenuContent(row);
                }

                const rowElement = (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const cellStyle: React.CSSProperties = {
                        width: cell.column.getSize() !== 0 ? cell.column.getSize() : undefined,
                      };
                      if (lineWrap) {
                        cellStyle.whiteSpace = "normal";
                        cellStyle.wordBreak = "break-word";
                      }

                      let densityClass = "";
                      if (tableDensity === "compact") {
                        densityClass = "py-1 px-2 text-xs";
                      } else if (tableDensity === "comfortable") {
                        densityClass = "py-3 px-4";
                      } else { // normal
                        densityClass = "py-2 px-3";
                      }

                      return (
                        <TableCell
                          key={cell.id}
                          style={cellStyle}
                          className={densityClass}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );

                if (contextMenuContentForThisRow) {
                  return (
                    <ContextMenu key={row.id + "-cm"}>
                      <ContextMenuTrigger asChild>
                        {rowElement}
                      </ContextMenuTrigger>
                      <ContextMenuContent className="w-64">
                        {contextMenuContentForThisRow}
                      </ContextMenuContent>
                    </ContextMenu>
                  );
                }
                return rowElement; // Devuelve la fila sin ContextMenu si no hay contenido definido
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getVisibleLeafColumns().length} 
                  className="h-24 text-center"
                >
                  No hay resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
