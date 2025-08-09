import { z } from 'zod'

// Schema general
const appointmentSchema = z.object({
  user_id: z.string().uuid('El user_id debe ser un UUID válido'),
  service_id: z.string().uuid('El service_id debe ser un UUID válido'),
  appointment_date: z.string().datetime('La fecha de la cita debe ser un formato datetime válido'),
  start_time: z.string().datetime('La hora de inicio debe ser un formato datetime válido').optional(),
  end_time: z.string().datetime('La hora de fin debe ser un formato datetime válido').optional(),
  status: z.enum(['scheduled', 'cancelled', 'completed'], {
    errorMap: () => ({ message: 'El estado debe ser: scheduled, cancelled o completed' })
  }).default('scheduled'),
  notes: z.string().max(1000, 'Las notas no pueden exceder 1000 caracteres').optional()
}).strict()



// Para el update hay que habilitar campos opcionales
const appointmentUpdateSchema = appointmentSchema.partial().strict()

//Exportamos el schema para crear citas
export const validateAppointments = (appointments) => {
  return appointmentSchema.safeParse(appointments)
}

//Exportamos el schema para actualizar citas
export const validateAppointmentUpdate = (data) => {
  return appointmentUpdateSchema.safeParse(data)
}