import { z } from 'zod'

// Schema general
const serviceSchema = z.object({
  name: z.string().min(5).max(50),
  description: z.string().min(10).max(200),
  duration: z.number().int('La duración debe ser un número entero').min(11, 'La duración debe ser mayor a 10 minutos'),
  price: z.number().min(0, 'El precio debe ser un número positivo'),
  available: z.boolean()
}).strict()

// Schema para validar cambios de estado
const availabilitySchema = z.object({
  available: z.boolean()
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

export const validateServiceId = (id) => {
  return z.string().regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    'El service_id debe ser un UUID válido'
  ).safeParse(id)
}