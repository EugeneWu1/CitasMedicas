import pool from '../Config/db.js';

// Obtener notificaciones de un usuario con paginación
export const getUserNotifications = async (userId, page = 1, limit = 10, isRead = null) => {
    const offset = (page - 1) * limit;
    
    // Query para contar total de notificaciones
    let countQuery = `SELECT COUNT(*) as total FROM notification WHERE user_id = UUID_TO_BIN(?)`;
    let countParams = [userId];
    
    // Query principal
    let query = `
        SELECT 
            notification_id,
            BIN_TO_UUID(user_id) as user_id,
            appointment_id,
            type,
            title,
            message,
            is_read,
            priority,
            scheduled_for,
            sent_at,
            created_at,
            updated_at
        FROM notification 
        WHERE user_id = UUID_TO_BIN(?)
    `;
    let queryParams = [userId];
    
    // Filtrar por estado de lectura si se especifica
    if (isRead !== null) {
        countQuery += ` AND is_read = ?`;
        query += ` AND is_read = ?`;
        countParams.push(isRead);
        queryParams.push(isRead);
    }
    
    query += ` ORDER BY created_at DESC LIMIT ? OFFSET ?`;
    queryParams.push(limit, offset);
    
    const [countResult] = await pool.query(countQuery, countParams);
    const [results] = await pool.query(query, queryParams);
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);
    
    return {
        data: results,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    };
};

// Crear una nueva notificación
export const createNotification = async (notificationData) => {
    const {
        userId,
        appointmentId = null,
        type,
        title,
        message,
        priority = 'medium',
        scheduledFor = null
    } = notificationData;

    const query = `
        INSERT INTO notification (
            user_id, 
            appointment_id, 
            type, 
            title, 
            message, 
            priority, 
            scheduled_for
        ) VALUES (UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query(query, [
        userId, 
        appointmentId, 
        type, 
        title, 
        message, 
        priority, 
        scheduledFor
    ]);
    
    return result.insertId;
};

// Marcar notificación como leída
export const markAsRead = async (notificationId, userId) => {
    const query = `
        UPDATE notification 
        SET is_read = 1, updated_at = CURRENT_TIMESTAMP 
        WHERE notification_id = ? AND user_id = UUID_TO_BIN(?)
    `;
    
    const [result] = await pool.query(query, [notificationId, userId]);
    return result.affectedRows > 0;
};


// Eliminar notificación
export const deleteNotification = async (notificationId, userId) => {
    const query = `
        DELETE FROM notification 
        WHERE notification_id = ? AND user_id = UUID_TO_BIN(?)
    `;
    
    const [result] = await pool.query(query, [notificationId, userId]);
    return result.affectedRows > 0;
};


// Verificar si el usuario existe
export const checkUserExists = async (userId) => {
    const query = `SELECT user_id FROM users WHERE user_id = UUID_TO_BIN(?)`;
    const [result] = await pool.query(query, [userId]);
    return result.length > 0;
};
