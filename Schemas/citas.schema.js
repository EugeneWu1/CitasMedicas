import { z } from 'zod'

// Schema general
const appointmentSchema = z.object({
  user_id: z.string().regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    'El user_id debe ser un UUID válido'
  ).optional(), // Ahora es opcional porque se toma del token

  service_id: z.string().regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    'El service_id debe ser un UUID válido'
  ),

  appointment_date: z.string().regex(
    /^\d{4}-\d{2}-\d{2}$/,
    'La fecha debe tener el formato YYYY-MM-DD'
  ).refine(
    (val) => !isNaN(Date.parse(val)),
    'La fecha debe ser válida'
  ),

  start_time: z.string().regex(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
    'La hora de inicio debe tener el formato HH:MM:SS'
  ).optional(),

  end_time: z.string().regex(
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/,
    'La hora de fin debe tener el formato HH:MM:SS'
  ).optional(),

  status: z.enum(['scheduled', 'cancelled', 'completed'], {
    errorMap: () => ({ message: 'El estado debe ser: scheduled, cancelled o completed' })
  }).default('scheduled'),

  notes: z.string().max(1000, 'Las notas no pueden exceder 1000 caracteres').optional()
}).strict()


// Validaciones adicionales personalizadas
const appointmentWithValidations = appointmentSchema.refine(
  (data) => {
    if (data.start_time && data.end_time) {
      const [startHour, startMin, startSec] = data.start_time.split(':').map(Number);
      const [endHour, endMin, endSec] = data.end_time.split(':').map(Number);
      
      const startTotalSeconds = startHour * 3600 + startMin * 60 + startSec;
      const endTotalSeconds = endHour * 3600 + endMin * 60 + endSec;
      
      return startTotalSeconds < endTotalSeconds;
    }
    return true;
  },
  {
    message: 'La hora de inicio debe ser anterior a la hora de fin',
    path: ['start_time']
  }
).refine(
  (data) => {
    const appointmentDate = new Date(data.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return appointmentDate >= today;
  },
  {
    message: 'La fecha de la cita no puede ser en el pasado',
    path: ['appointment_date']
  }
);



// Para el update - usar el mismo schema con validaciones pero campos opcionales
const appointmentUpdateWithValidations = appointmentWithValidations.partial().strict()

//Exportamos el schema para crear citas
export const validateAppointments = (appointments) => {
  return appointmentWithValidations.safeParse(appointments)
}

//Exportamos el schema para actualizar citas
export const validateAppointmentUpdate = (data) => {
  return appointmentUpdateWithValidations.safeParse(data)
}

// Schema adicional para validar solo el ID de la cita
export const validateAppointmentId = (id) => {
  return z.string().regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    'El appointment_id debe ser un UUID válido'
  ).safeParse(id)
}
