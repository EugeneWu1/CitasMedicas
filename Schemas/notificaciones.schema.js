import { z } from 'zod';

// Schema para crear notificación (nueva estructura simplificada)
const createNotificationSchema = z.object({
    user_id: z.string().regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        'El user_id debe ser un UUID válido'
    ).optional(), // Ahora es opcional porque se toma del token
    
    appointment_id: z.string().regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        'El appointment_id debe ser un UUID válido'
    ).optional(),
    
    type: z.enum([
        'cita_creada',
        'cita_cancelada', 
        'recordatorio',
        'sistema'
    ], {
        errorMap: () => ({ message: 'Tipo de notificación inválido' })
    }),
    
    title: z.string()
        .min(1, 'El título es requerido')
        .max(150, 'El título no puede exceder 150 caracteres'),
        
    message: z.string()
        .min(1, 'El mensaje es requerido')
        .max(500, 'El mensaje no puede exceder 500 caracteres')
});

// Schema para ID de notificación
const notificationIdSchema = z.string().regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    'El notification_id debe ser un UUID válido'
);

// Funciones de validación
export const validateCreateNotification = (data) => {
    return createNotificationSchema.safeParse(data);
};

export const validateNotificationId = (notificationId) => {
    return notificationIdSchema.safeParse(notificationId);
};
