import zod from 'zod'

//Schema general
const serviceSchema = zod.Object({
  "nombre": zod.string().min(5).max(50),
  "descripcion": zod.string().min(10).max(200),
  "duracion": zod.number(),
  "precio": zod.number(),
  "disponible": zod.boolean()
}).strict()

//Schema para validar cambios de estado
const availabilitySchema = zod.Object({
  "disponible":zod.boolean()
}).strict()


//Para el update hay que habilitar campos a opcionales
const serviceUpdateSchema = serviceSchema.partial().strict()

export const validateServices = (services) => {
    return serviceSchema.safeParse(services)
}

export const validateServiceUpdate = (data) => {
  return serviceUpdateSchema.safeParse(data)
}

export const validateAvailability = (data) => {
  return availabilitySchema.safeParse(data)
}