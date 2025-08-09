import { createNotification } from '../Models/notificaciones.models.js';

// Helper para crear notificaciones automáticas relacionadas con citas
export const createAppointmentNotification = async (type, appointmentData, customMessage = null) => {
    try {
        const { userId, appointmentId, appointmentDate, startTime, serviceName } = appointmentData;
        
        let title, message;
        
        switch (type) {
            case 'appointment_created':
                title = 'Cita Agendada';
                message = customMessage || `Su cita de ${serviceName} ha sido agendada para el ${appointmentDate} a las ${startTime}.`;
                break;
                
            case 'appointment_cancelled':
                title = 'Cita Cancelada';
                message = customMessage || `Su cita de ${serviceName} programada para el ${appointmentDate} a las ${startTime} ha sido cancelada.`;
                break;
                
            case 'appointment_reminder':
                title = 'Recordatorio de Cita';
                message = customMessage || `Recordatorio: Tiene una cita de ${serviceName} mañana a las ${startTime}. Por favor confirme su asistencia.`;
                break;
                
            case 'appointment_completed':
                title = 'Cita Completada';
                message = customMessage || `Su cita de ${serviceName} ha sido completada exitosamente. Gracias por su visita.`;
                break;
                
            default:
                throw new Error('Tipo de notificación no válido');
        }
        
        await createNotification({
            userId,
            appointmentId,
            type,
            title,
            message,
            priority: type === 'appointment_reminder' ? 'high' : 'medium'
        });
        
        console.log(`Notificación ${type} creada para usuario ${userId}`);
        
    } catch (error) {
        console.error('Error al crear notificación automática:', error);
        // No lanzamos el error para no afectar el flujo principal
    }
};

// Helper para crear notificaciones del sistema
export const createSystemNotification = async (userId, title, message, priority = 'medium') => {
    try {
        await createNotification({
            userId,
            type: 'system_notification',
            title,
            message,
            priority
        });
        
        console.log(`Notificación del sistema creada para usuario ${userId}`);
        
    } catch (error) {
        console.error('Error al crear notificación del sistema:', error);
    }
};
