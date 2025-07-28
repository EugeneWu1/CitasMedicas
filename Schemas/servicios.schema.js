import { z } from 'zod'

// Schema general
const serviceSchema = z.object({
  nombre: z.string().min(5).max(50),
  descripcion: z.string().min(10).max(200),
  duracion: z.number(),
  precio: z.number(),
  disponible: z.boolean()
}).strict()

// Schema para validar cambios de estado
const availabilitySchema = z.object({
  disponible: z.boolean()
}).strict()

// Para el update hay que habilitar campos opcionales
const serviceUpdateSchema = serviceSchema.partial().strict()

//Exportamos el schema para crear servicios
export const validateServices = (services) => {
  return serviceSchema.safeParse(services)
}

//Exportamos el schema para actualizarrr servicios
export const validateServiceUpdate = (data) => {
  return serviceUpdateSchema.safeParse(data)
}

//Exportamos el schema para actualizar disponibilidad
export const validateAvailability = (data) => {
  return availabilitySchema.safeParse(data)
}