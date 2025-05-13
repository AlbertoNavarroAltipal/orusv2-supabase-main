"use client";

import React, { useState } from "react";
import { useForm, Controller, useFieldArray, Control, FieldErrors, UseFormGetValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { PlusCircle, Trash2, Video, FileText, DollarSign } from "lucide-react";

// Esquemas de validación
const resourceSchema = z.object({
  name: z.string().min(3, "Nombre del recurso: mínimo 3 caracteres."),
  url: z.string().url("Debe ser una URL válida.").optional().or(z.literal("")),
});

const lessonSchema = z.object({
  title: z.string().min(3, "Título de lección: mínimo 3 caracteres."),
  videoUrl: z
    .string()
    .url("Debe ser una URL de video válida.")
    .optional()
    .or(z.literal("")),
  description: z.string().optional(),
  resources: z.array(resourceSchema).optional(),
});

const moduleSchema = z.object({
  name: z.string().min(3, "Nombre de módulo: mínimo 3 caracteres."),
  lessons: z
    .array(lessonSchema)
    .min(1, "Cada módulo debe tener al menos una lección."),
});

const faqSchema = z.object({
  question: z.string().min(5, "Pregunta: mínimo 5 caracteres."),
  answer: z.string().min(10, "Respuesta: mínimo 10 caracteres."),
});

const courseFormSchema = z
  .object({
    title: z
      .string()
      .min(5, "Título: mínimo 5 caracteres.")
      .max(100, "Título: máximo 100 caracteres."),
    description: z
      .string()
      .min(20, "Descripción: mínimo 20 caracteres.")
      .max(500, "Descripción: máximo 500 caracteres."),
    category: z.string({ required_error: "Selecciona una categoría." }).min(1, "Selecciona una categoría."),
    level: z.string({ required_error: "Selecciona un nivel." }).min(1, "Selecciona un nivel."),
    estimatedDuration: z
      .string()
      .min(3, "Duración: mínimo 3 caracteres.")
      .max(30, "Duración: máximo 30 caracteres."),
    coverImage: z.any().optional(),
    modules: z
      .array(moduleSchema)
      .min(1, "El curso debe tener al menos un módulo.")
      .optional(),
    allowComments: z.boolean().default(true).optional(),
    faq: z.array(faqSchema).optional(),
    accessType: z
      .enum(["gratis", "pago_unico", "suscripcion"], {
        required_error: "Selecciona un tipo de acceso.",
      }),
    price: z
      .number({ coerce: true })
      .min(0, "El precio no puede ser negativo.")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.accessType === "pago_unico") {
        return data.price !== undefined && data.price > 0;
      }
      return true;
    },
    {
      message: "Se requiere un precio mayor a 0 para 'Pago Único'.",
      path: ["price"],
    }
  );

type CourseFormValues = z.infer<typeof courseFormSchema>;

const defaultValues: CourseFormValues = {
  title: "",
  description: "",
  category: "",
  level: "",
  estimatedDuration: "",
  coverImage: undefined,
  modules: [
    {
      name: "",
      lessons: [{ title: "", videoUrl: "", description: "", resources: [] }],
    },
  ],
  allowComments: true,
  faq: [{ question: "", answer: "" }],
  accessType: "gratis",
  price: undefined,
};

const categories = [
  { id: "desarrollo_software", label: "Desarrollo de Software" },
  { id: "diseno_grafico", label: "Diseño Gráfico y Multimedia" },
  { id: "marketing_digital", label: "Marketing Digital" },
  { id: "negocios_emprendimiento", label: "Negocios y Emprendimiento" },
  { id: "idiomas_cultura", label: "Idiomas y Cultura" },
  { id: "desarrollo_personal", label: "Desarrollo Personal" },
  { id: "salud_bienestar", label: "Salud y Bienestar" },
];

const levels = [
  { id: "principiante", label: "Principiante" },
  { id: "intermedio", label: "Intermedio" },
  { id: "avanzado", label: "Avanzado" },
  { id: "todos_niveles", label: "Todos los niveles" },
];

const accessTypes = [
  { id: "gratis", label: "Gratis" },
  { id: "pago_unico", label: "Pago Único" },
  { id: "suscripcion", label: "Por Suscripción (requiere integración)" },
];

const totalSteps = 5;

export function CreateCourseForm() {
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors },
    watch,
    getValues,
    setError,
  } = form;
  const watchedAccessType = watch("accessType");

  const {
    fields: moduleFields,
    append: appendModule,
    remove: removeModule,
  } = useFieldArray({ control, name: "modules" });
  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({ control, name: "faq" });

  const nextStep = async () => {
    let fieldsToValidate: (keyof CourseFormValues)[] | string[] = [];
    if (currentStep === 1)
      fieldsToValidate = ["title", "description", "category", "level"];
    else if (currentStep === 2) fieldsToValidate = ["estimatedDuration", "coverImage"];
    else if (currentStep === 3) {
      const modules = getValues("modules");
      if (!modules || modules.length === 0) {
        setError("modules" as any, {
          type: "manual",
          message: "Debe agregar al menos un módulo.",
        });
        toast({
          title: "Estructura Incompleta",
          description: "Añade al menos un módulo.",
          variant: "destructive",
        });
        return;
      }
      fieldsToValidate.push("modules");
    } else if (currentStep === 4) {
      fieldsToValidate = ["allowComments", "faq"];
    } else if (currentStep === 5) {
      fieldsToValidate = ["accessType"];
      if (getValues("accessType") === "pago_unico") {
        fieldsToValidate.push("price");
      }
    }

    const isValid = await trigger(fieldsToValidate as any);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    } else {
      console.log("Errores de validación en el paso:", errors);
      toast({
        title: "Campos incompletos o incorrectos",
        description: "Revisa los campos marcados.",
        variant: "destructive",
      });
    }
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  function onSubmit(data: CourseFormValues) {
    console.log("Datos finales del curso:", data);
    toast({
      title: "Curso Propuesto para Creación",
      description: (
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4 overflow-x-auto">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
      duration: 8000,
    });
  }

  const progressValue = (currentStep / totalSteps) * 100;

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Crear Nuevo Curso
        </CardTitle>
        <div className="mt-4">
          <Progress value={progressValue} className="w-full" />
          <p className="text-sm text-muted-foreground text-center mt-2">
            Paso {currentStep} de {totalSteps}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {currentStep === 1 && (
              <section className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-3">
                  1. Información Básica
                </h3>
                <FormField
                  control={control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ej: Desarrollo Web Avanzado"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Objetivos, público..."
                          className="resize-y min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Categoría</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona categoría" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="level"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nivel</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona nivel" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {levels.map((lvl) => (
                            <SelectItem key={lvl.id} value={lvl.id}>
                              {lvl.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
            )}

            {currentStep === 2 && (
              <section className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-3">
                  2. Detalles Adicionales
                </h3>
                <FormField
                  control={control}
                  name="estimatedDuration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duración Estimada</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: 20 horas" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="coverImage"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Imagen de Portada</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            onChange(e.target.files?.[0] || null)
                          }
                          {...rest}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </section>
            )}

            {currentStep === 3 && (
              <section className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-3">
                  3. Estructura del Curso
                </h3>
                {moduleFields.map((moduleItem, moduleIndex) => (
                  <Card key={moduleItem.id} className="p-4 bg-slate-50">
                    <div className="flex justify-between items-center mb-4">
                      <FormField
                        control={control}
                        name={`modules.${moduleIndex}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-grow mr-2">
                            <FormLabel className="sr-only">
                              Módulo {moduleIndex + 1}
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder={`Nombre Módulo ${moduleIndex + 1}`}
                                {...field}
                                className="text-lg font-medium"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeModule(moduleIndex)}
                        disabled={moduleFields.length <= 1 && (!getValues(`modules.${moduleIndex}.name`) && getValues(`modules.${moduleIndex}.lessons`)?.length <=1 && !getValues(`modules.${moduleIndex}.lessons.0.title`))}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                    </div>
                    <LessonsArray
                      moduleIndex={moduleIndex}
                      control={control}
                      errors={errors}
                      getValues={getValues}
                    />
                  </Card>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    appendModule({
                      name: "",
                      lessons: [
                        {
                          title: "",
                          videoUrl: "",
                          description: "",
                          resources: [],
                        },
                      ],
                    })
                  }
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Añadir Módulo
                </Button>
                {errors.modules && typeof errors.modules.message === "string" && (
                    <p className="text-sm font-medium text-destructive">{errors.modules.message}</p>
                )}
                 {errors.modules && !errors.modules.message && errors.modules.type === 'too_small' && (
                    <p className="text-sm font-medium text-destructive">El curso debe tener al menos un módulo.</p>
                )}
              </section>
            )}

            {currentStep === 4 && (
              <section className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-3">
                  4. Configuración Adicional
                </h3>
                <FormField
                  control={control}
                  name="allowComments"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Permitir Comentarios
                        </FormLabel>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <div>
                  <h4 className="text-lg font-medium mb-2">
                    Preguntas Frecuentes (Q&A)
                  </h4>
                  {faqFields.map((faqItem, index) => (
                    <Card key={faqItem.id} className="p-4 mb-4 bg-slate-50">
                      <div className="flex justify-end">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeFaq(index)}
                          disabled={faqFields.length <= 1 && !getValues(`faq.${index}.question`) && !getValues(`faq.${index}.answer`)}
                        >
                          <Trash2 className="h-5 w-5 text-red-500" />
                        </Button>
                      </div>
                      <FormField
                        control={control}
                        name={`faq.${index}.question`}
                        render={({ field }) => (
                          <FormItem className="mb-2">
                            <FormLabel>Pregunta</FormLabel>
                            <FormControl>
                              <Input placeholder="Pregunta..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={control}
                        name={`faq.${index}.answer`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Respuesta</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Respuesta..."
                                {...field}
                                rows={3}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </Card>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => appendFaq({ question: "", answer: "" })}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Añadir Q&A
                  </Button>
                </div>
              </section>
            )}

            {currentStep === 5 && (
              <section className="space-y-6">
                <h3 className="text-xl font-semibold border-b pb-3">
                  5. Precio y Acceso
                </h3>
                <FormField
                  control={control}
                  name="accessType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Acceso al Curso</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un tipo de acceso" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {accessTypes.map((type) => (
                            <SelectItem
                              key={type.id}
                              value={type.id}
                              disabled={type.id === "suscripcion"}
                            >
                              {type.label}{" "}
                              {type.id === "suscripcion" && "(Próximamente)"}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {watchedAccessType === "pago_unico" && (
                  <FormField
                    control={control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio del Curso (COP)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                              type="number"
                              placeholder="Ej: 150000"
                              {...field}
                              className="pl-8"
                              onChange={e => {
                                const value = e.target.value;
                                field.onChange(value === '' ? undefined : parseFloat(value));
                              }}
                              value={field.value === undefined ? '' : String(field.value)}
                            />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Introduce el precio si el acceso es de pago único.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </section>
            )}

            <CardFooter className="flex justify-between p-0 pt-8 mt-8 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Anterior
              </Button>
              <Button
                type="button"
                onClick={
                  currentStep === totalSteps
                    ? handleSubmit(onSubmit)
                    : nextStep
                }
              >
                {currentStep === totalSteps
                  ? "Finalizar y Crear Curso"
                  : "Siguiente"}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

// Componente para gestionar los recursos de una lección individual
interface LessonResourcesManagerProps {
  moduleIndex: number;
  lessonIndex: number;
  control: Control<CourseFormValues>; // Usar Control tipado
}

function LessonResourcesManager({ moduleIndex, lessonIndex, control }: LessonResourcesManagerProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `modules.${moduleIndex}.lessons.${lessonIndex}.resources`,
  });

  return (
    <div className="mt-3">
      <FormLabel className="text-sm mb-2 flex items-center">
        <FileText className="mr-2 h-4 w-4 text-green-600" />
        Recursos de la Lección (Opcional)
      </FormLabel>
      {fields.map((resourceItem, resourceIndex) => (
        <Card key={resourceItem.id} className="p-3 mb-2 bg-slate-50">
          <div className="flex justify-end items-center mb-1">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(resourceIndex)}
              className="h-6 w-6"
            >
              <Trash2 className="h-3 w-3 text-red-400" />
            </Button>
          </div>
          <FormField
            control={control}
            name={`modules.${moduleIndex}.lessons.${lessonIndex}.resources.${resourceIndex}.name`}
            render={({ field }) => (
              <FormItem className="mb-2">
                <FormLabel className="text-xs">Nombre Recurso</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Guía PDF, Código Fuente" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`modules.${moduleIndex}.lessons.${lessonIndex}.resources.${resourceIndex}.url`}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">URL Recurso</FormLabel>
                <FormControl>
                  <Input type="url" placeholder="https://..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </Card>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => append({ name: "", url: "" })}
        className="mt-1 text-xs"
      >
        <PlusCircle className="mr-1 h-3 w-3" />
        Añadir Recurso
      </Button>
    </div>
  );
}


interface LessonsArrayProps {
  moduleIndex: number;
  control: Control<CourseFormValues>; // Usar Control tipado
  errors: FieldErrors<CourseFormValues>;
  getValues: UseFormGetValues<CourseFormValues>;
}

function LessonsArray({ moduleIndex, control, errors, getValues }: LessonsArrayProps) {
  const { fields, append, remove } = useFieldArray({ control, name: `modules.${moduleIndex}.lessons` });

  return (
    <div className="ml-0 md:ml-4 pl-0 md:pl-4 border-l-0 md:border-l">
      <h5 className="text-md font-medium mt-4 mb-2">Lecciones</h5>
      {fields.map((lessonItem, lessonIndex) => {
        return (
          <Card key={lessonItem.id} className="mb-4 p-4 bg-white shadow">
            <div className="flex justify-between items-center mb-3">
              <FormLabel className="font-semibold">
                Lección {lessonIndex + 1}
              </FormLabel>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => remove(lessonIndex)}
                disabled={fields.length <= 1 && !getValues(`modules.${moduleIndex}.lessons.${lessonIndex}.title`)}
              >
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
            <FormField
              control={control}
              name={`modules.${moduleIndex}.lessons.${lessonIndex}.title`}
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="text-sm">Título Lección</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Configuración" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`modules.${moduleIndex}.lessons.${lessonIndex}.videoUrl`}
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="text-sm flex items-center">
                    <Video className="mr-2 h-4 w-4" />
                    URL Video (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="url"
                      placeholder="https://youtube.com/..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name={`modules.${moduleIndex}.lessons.${lessonIndex}.description`}
              render={({ field }) => (
                <FormItem className="mb-3">
                  <FormLabel className="text-sm">
                    Descripción Breve (Opcional)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Resumen lección..."
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Usar el nuevo componente para gestionar recursos */}
            <LessonResourcesManager
              moduleIndex={moduleIndex}
              lessonIndex={lessonIndex}
              control={control}
            />
          </Card>
        );
      })}
      <Button
        type="button"
        variant="link"
        size="sm"
        onClick={() =>
          append({ title: "", videoUrl: "", description: "", resources: [] })
        }
        className="mt-2 text-sm"
      >
        <PlusCircle className="mr-1 h-4 w-4" />
        Añadir Lección
      </Button>
      {errors?.modules?.[moduleIndex]?.lessons?.message && (
        <p className="text-sm font-medium text-destructive mt-2">{typeof errors.modules[moduleIndex].lessons.message === 'string' ? errors.modules[moduleIndex].lessons.message : 'Error en las lecciones'}</p>
      )}
      {errors?.modules?.[moduleIndex]?.lessons?.root?.message && ( 
         <p className="text-sm font-medium text-destructive mt-2">{errors.modules[moduleIndex].lessons.root.message}</p>
      )}
    </div>
  );
}
