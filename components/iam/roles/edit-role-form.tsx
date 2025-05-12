"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, XCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

// Datos de ejemplo para los permisos disponibles
const mockPermissions = [
  {
    id: "1",
    name: "users:read",
    description: "Permite ver usuarios",
    resource: "users",
    action: "read",
  },
  {
    id: "2",
    name: "users:create",
    description: "Permite crear usuarios",
    resource: "users",
    action: "create",
  },
  {
    id: "3",
    name: "roles:read",
    description: "Permite ver roles",
    resource: "roles",
    action: "read",
  },
  {
    id: "4",
    name: "roles:update",
    description: "Permite actualizar roles",
    resource: "roles",
    action: "update",
  },
]

interface EditRoleFormProps {
  roleId?: string
}

export function EditRoleForm({ roleId }: EditRoleFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const isEditing = !!roleId

  // Estado para el formulario
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    permissions: [] as string[],
  })
  const [loading, setLoading] = useState(false)

  // Efecto para cargar los datos del rol si estamos editando
  useState(() => {
    if (isEditing) {
      // Aquí iría la lógica para cargar los datos del rol
      // Por ahora, usamos datos de ejemplo
      setFormData({
        name: "Editor",
        description: "Puede editar contenido pero no administrar usuarios",
        permissions: ["1", "3"],
      })
    }
  })

  // Manejador para cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Manejador para cambios en los checkboxes de permisos
  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: checked ? [...prev.permissions, permissionId] : prev.permissions.filter((id) => id !== permissionId),
    }))
  }

  // Manejador para enviar el formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Aquí iría la lógica para guardar los cambios
      console.log("Guardando rol:", formData)

      // Simulamos una operación asíncrona
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: isEditing ? "Rol actualizado" : "Rol creado",
        description: `El rol ${formData.name} ha sido ${isEditing ? "actualizado" : "creado"} exitosamente.`,
      })

      // Redirigir a la lista de roles
      router.push("/dashboard/iam/roles")
    } catch (error) {
      console.error("Error al guardar el rol:", error)
      toast({
        title: "Error",
        description: "Ocurrió un error al guardar el rol. Por favor, inténtalo de nuevo.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  // Agrupar permisos por recurso para mejor visualización
  const permissionsByResource = mockPermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.resource]) {
        acc[permission.resource] = []
      }
      acc[permission.resource].push(permission)
      return acc
    },
    {} as Record<string, typeof mockPermissions>,
  )

  return (
    <form onSubmit={handleSubmit}>
      <Card>
        <CardHeader>
          <CardTitle>{isEditing ? "Editar rol" : "Nuevo rol"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre del rol</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>
            <div>
              <Label htmlFor="description">Descripción</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Permisos</h3>
            <div className="space-y-6">
              {Object.entries(permissionsByResource).map(([resource, permissions]) => (
                <div key={resource} className="space-y-2">
                  <h4 className="font-medium capitalize">{resource}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`permission-${permission.id}`}
                          checked={formData.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked === true)}
                        />
                        <Label htmlFor={`permission-${permission.id}`} className="text-sm cursor-pointer">
                          {permission.name}
                          <span className="block text-xs text-gray-500">{permission.description}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/iam/roles")}
            disabled={loading}
          >
            <XCircle className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {loading ? "Guardando..." : isEditing ? "Actualizar rol" : "Crear rol"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
