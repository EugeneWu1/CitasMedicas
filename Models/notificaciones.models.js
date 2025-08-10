import pool from '../Config/db.js';


// Obtener notificaciones de un usuario (sin paginación)
export const getUserNotifications = async (userId, isRead = null) => {
    // Query principal
    let query = `
        SELECT 
            id,
            BIN_TO_UUID(user_id) as user_id,
            appointment_id,
            type,
            title,
            message,
            is_read,
            created_at
        FROM notification 
        WHERE user_id = UUID_TO_BIN(?)
    `;
    let queryParams = [userId];
    
    // Filtrar por estado de lectura si se especifica
    if (isRead !== null) {
        query += ` AND is_read = ?`;
        queryParams.push(isRead);
    }
    
    query += ` ORDER BY created_at DESC`;
    
    const [results] = await pool.query(query, queryParams);
    
    return {
        data: results,
        total: results.length
    };
};

// Crear una nueva notificación
export const createNotification = async (notificationData) => {
    const {
        notificationId,
        userId,
        appointmentId = null,
        type,
        title,
        message
    } = notificationData;


    const query = `
        INSERT INTO notification (
            id,
            user_id, 
            appointment_id, 
            type, 
            title, 
            message
        ) VALUES (?, UUID_TO_BIN(?), ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
        notificationId,
        userId, 
        appointmentId, 
        type, 
        title, 
        message
    ]);
    
    return notificationId;
}

// Marcar notificación como leída
export const markAsRead = async (notificationId, userId) => {
    const query = `
        UPDATE notification 
        SET is_read = 1 
        WHERE id = ? AND user_id = UUID_TO_BIN(?)
    `;
    
    const [result] = await pool.query(query, [notificationId, userId]);
    return result.affectedRows > 0;
}

// Eliminar notificación
export const deleteNotification = async (notificationId, userId) => {
    const query = `
        DELETE FROM notification 
        WHERE id = ? AND user_id = UUID_TO_BIN(?)
    `;
    
    const [result] = await pool.query(query, [notificationId, userId]);
    return result.affectedRows > 0;
}

// Verificar si el usuario existe
export const checkUserExists = async (userId) => {
    const query = `SELECT user_id FROM users WHERE user_id = UUID_TO_BIN(?)`;
    const [result] = await pool.query(query, [userId]);
    return result.length > 0;
}
