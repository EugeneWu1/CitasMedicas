import { z } from 'zod';

// Schema para crear notificación
const createNotificationSchema = z.object({
    user_id: z.string().regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        'El user_id debe ser un UUID válido'
    ),
    
    appointment_id: z.string().regex(
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        'El appointment_id debe ser un UUID válido'
    ).optional(),
    
    type: z.enum([
        'appointment_created',
        'appointment_cancelled', 
        'appointment_reminder',
        'appointment_completed',
        'system_notification',
        'service_updated'
    ], {
        errorMap: () => ({ message: 'Tipo de notificación inválido' })
    }),
    
    title: z.string()
        .min(1, 'El título es requerido')
        .max(200, 'El título no puede exceder 200 caracteres'),
        
    message: z.string()
        .min(1, 'El mensaje es requerido')
        .max(1000, 'El mensaje no puede exceder 1000 caracteres'),
        
    priority: z.enum(['low', 'medium', 'high']).optional(),
    
    scheduled_for: z.string()
        .datetime('Formato de fecha/hora inválido')
        .optional()
});

// Schema para validar UUID
const uuidSchema = z.string().regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    'Debe ser un UUID válido'
);

// Schema para ID de notificación
const notificationIdSchema = z.string().regex(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    'El notification_id debe ser un UUID válido'
);

// Funciones de validación
export const validateCreateNotification = (data) => {
    return createNotificationSchema.safeParse(data);
};

export const validateUserId = (userId) => {
    return uuidSchema.safeParse(userId);
};

export const validateNotificationId = (notificationId) => {
    return notificationIdSchema.safeParse(notificationId);
};
