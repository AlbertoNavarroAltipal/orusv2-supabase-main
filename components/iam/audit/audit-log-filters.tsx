"use client"

import { useState } from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"

interface AuditLogFiltersProps {
  onFilter: (filters: any) => void
}

export function AuditLogFilters({ onFilter }: AuditLogFiltersProps) {
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const form = useForm({
    defaultValues: {
      action: "",
      resource: "",
      user: "",
    },
  })

  const handleSubmit = form.handleSubmit((data) => {
    onFilter({
      ...data,
      startDate,
      endDate,
    })
  })

  const handleReset = () => {
    form.reset()
    setStartDate(undefined)
    setEndDate(undefined)
    onFilter({})
  }

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white rounded-md shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="action"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Acción</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar acción" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="create">Crear</SelectItem>
                    <SelectItem value="read">Leer</SelectItem>
                    <SelectItem value="update">Actualizar</SelectItem>
                    <SelectItem value="delete">Eliminar</SelectItem>
                    <SelectItem value="login">Inicio de sesión</SelectItem>
                    <SelectItem value="logout">Cierre de sesión</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="resource"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recurso</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar recurso" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="users">Usuarios</SelectItem>
                    <SelectItem value="roles">Roles</SelectItem>
                    <SelectItem value="permissions">Permisos</SelectItem>
                    <SelectItem value="auth">Autenticación</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormItem>
            <FormLabel>Fecha inicio</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={`w-full pl-3 text-left font-normal ${!startDate ? "text-muted-foreground" : ""}`}
                  >
                    {startDate ? format(startDate, "PPP") : "Seleccionar fecha"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus />
              </PopoverContent>
            </Popover>
          </FormItem>

          <FormItem>
            <FormLabel>Fecha fin</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant={"outline"}
                    className={`w-full pl-3 text-left font-normal ${!endDate ? "text-muted-foreground" : ""}`}
                  >
                    {endDate ? format(endDate, "PPP") : "Seleccionar fecha"}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus />
              </PopoverContent>
            </Popover>
          </FormItem>
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={handleReset}>
            Restablecer
          </Button>
          <Button type="submit">Aplicar filtros</Button>
        </div>
      </form>
    </Form>
  )
}
