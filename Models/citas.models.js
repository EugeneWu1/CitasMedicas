import pool from '../Config/db.js';

//Funcion para listar todas las citas con paginacion
export const getAllAppointmentsFromUser = async (id, page = 1, limit = 10) => {
    // Calcular el offset
    const offset = (page - 1) * limit;

    // Query para obtener el total de registros
    const countQuery = `SELECT COUNT(*) as total 
        FROM appointment as a
        WHERE a.user_id = UUID_TO_BIN(?)`;

    // Query principal con paginacion
    const query = `SELECT a.appointment_id,
        BIN_TO_UUID(a.user_id) as user_id,
        u.name as user_name,
        u.email as user_email,
        a.service_id,
        s.name as service_name,
        s.duration as service_duration,
        s.price as service_price,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status,
        a.notes,
        a.created_at,
        a.updated_at
    FROM appointment as a
    LEFT JOIN users as u ON a.user_id = u.user_id
    LEFT JOIN service as s ON a.service_id = s.service_id
    WHERE a.user_id = UUID_TO_BIN(?)
    ORDER BY a.appointment_date DESC, a.start_time DESC
    LIMIT ? OFFSET ?`;

    // Ejecutar ambas consultas
    const [countResult] = await pool.query(countQuery, [id]);
    const [results] = await pool.query(query, [id, limit, offset]);
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Retornar los datos con metadatos de paginacion
    return {
        data: results,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        }
    };
}

//Funcion para insertar una cita
export const createAppointment = async (citaData) => {
    
    const conn = await pool.getConnection()

    try {
        await conn.beginTransaction()

        const { appointment_id, user_id, service_id, appointment_date, start_time, end_time, status, notes } = citaData

        const query = `INSERT INTO appointment (appointment_id, user_id, service_id, appointment_date, start_time, end_time, status, notes)
                       VALUES (?, UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)`
    
        const [result] = await conn.execute(query, [
            appointment_id,
            user_id,
            service_id,
            appointment_date,
            start_time,
            end_time,
            status,
            notes
        ])

        await conn.commit()
        return citaData

    } catch (error) {

        await conn.rollback()
        throw error

    } finally {

        conn.release()
    }
}

//Funcion para eliminar una cita
export const deleteAppointment = async (id) => {
    
    const conn = await pool.getConnection()

    try {
        await conn.beginTransaction()

        const query = `DELETE FROM appointment WHERE appointment_id = ?`

        const [result] = await conn.execute(query, [id])

        await conn.commit()
        return {
            success: result.affectedRows > 0,
            affectedRows: result.affectedRows
        }

    } catch (error) {

        await conn.rollback()
        throw error

    } finally {

        conn.release()
    }
}

//Funcion para obtener todas las citas programadas con paginacion
export const getAllScheduledAppointments = async (page = 1, limit = 10) => {
    // Calcular el offset
    const offset = (page - 1) * limit;

    // Query para obtener el total de registros
    const countQuery = `SELECT COUNT(*) as total 
        FROM appointment as a
        WHERE a.status = 'scheduled'`;

    // Query principal con paginacion
    const query = `SELECT a.appointment_id,
        BIN_TO_UUID(a.user_id) as user_id,
        u.name as user_name,
        u.email as user_email,
        a.service_id,
        s.name as service_name,
        s.duration as service_duration,
        s.price as service_price,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status,
        a.notes,
        a.created_at,
        a.updated_at
    FROM appointment as a
    LEFT JOIN users as u ON a.user_id = u.user_id
    LEFT JOIN service as s ON a.service_id = s.service_id
    WHERE a.status = 'scheduled'
    ORDER BY a.appointment_date ASC, a.start_time ASC
    LIMIT ? OFFSET ?`;

    // Ejecutar ambas consultas
    const [countResult] = await pool.query(countQuery);
    const [results] = await pool.query(query, [limit, offset]);
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Retornar los datos con metadatos de paginacion
    return {
        data: results,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        }
    };
}


//Funcion para actualizar una cita
export const updateAppointment = async (id, citaData) => {
    
    const conn = await pool.getConnection()

    try {
        await conn.beginTransaction()

        const { user_id, service_id, appointment_date, start_time, end_time, status, notes } = citaData;

        let setParts = [];
        let params = [];

        if (user_id !== undefined) {
            setParts.push('user_id = UUID_TO_BIN(?)');
            params.push(user_id);
        }
        if (service_id !== undefined) {
            setParts.push('service_id = ?');
            params.push(service_id);
        }
        if (appointment_date !== undefined) {
            setParts.push('appointment_date = ?');
            params.push(appointment_date);
        }
        if (start_time !== undefined) {
            setParts.push('start_time = ?');
            params.push(start_time);
        }
        if (end_time !== undefined) {
            setParts.push('end_time = ?');
            params.push(end_time);
        }
        if (status !== undefined) {
            setParts.push('status = ?');
            params.push(status);
        }
        if (notes !== undefined) {
            setParts.push('notes = ?');
            params.push(notes);
        }

        // Siempre actualizar updated_at
        setParts.push('updated_at = CURRENT_TIMESTAMP');

        // Verificar que hay campos para actualizar
        if (setParts.length === 1) { // Solo updated_at
            return {
                success: false,
                message: 'No hay campos para actualizar',
                affectedRows: 0
            };
        }

        const query = `UPDATE appointment SET ${setParts.join(', ')} WHERE appointment_id = ?`;
        params.push(id);

        const [result] = await conn.execute(query, params);

        await conn.commit();

        return { 
            data: citaData,
            affectedRows: result.affectedRows
        }

    } catch (error) {

        await conn.rollback();
        throw error;

    } finally {

        conn.release();
    }
}

//Funcion para verificar si un usuario existe
export const checkUserExists = async (user_id) => {

    const query = `SELECT user_id FROM users WHERE user_id = UUID_TO_BIN(?)`

    const [results] = await pool.query(query, [user_id])
    return results.length > 0
}

//Funcion para verificar si existe una cita duplicada
export const checkDuplicateAppointment = async (user_id, appointment_date, start_time, excludeId = null) => {
    let query = `
        SELECT appointment_id 
        FROM appointment 
        WHERE user_id = UUID_TO_BIN(?) 
        AND appointment_date = ? 
        AND start_time = ? 
        AND status != 'cancelled'
    `;
    
    const params = [user_id, appointment_date, start_time]
    
    if (excludeId) {
        query += ` AND appointment_id != ?`;
        params.push(excludeId)
    }
    
    const [results] = await pool.query(query, params)
    return results.length > 0
}

//Funcion para verificar conflictos de horario en un servicio específico
export const checkServiceTimeConflict = async (appointment_date, start_time, end_time, excludeId = null) => {
    try {
        // Si no hay end_time, no verificar conflictos complejos
        if (!end_time) {
            return false;
        }

        let query = `
            SELECT a.appointment_id, a.start_time, a.end_time, s.name as service_name
            FROM appointment a
            INNER JOIN service s ON a.service_id = s.service_id
            WHERE a.appointment_date = ? 
            AND a.status = 'scheduled'
            AND a.end_time IS NOT NULL
            AND (
                (a.start_time <= ? AND a.end_time > ?) OR
                (a.start_time < ? AND a.end_time >= ?) OR
                (a.start_time >= ? AND a.start_time < ?)
            )
        `;
        
        const params = [
            appointment_date,
            start_time, start_time,     // Nueva cita empieza cuando otra está activa
            end_time, end_time,         // Nueva cita termina cuando otra está activa
            start_time, end_time        // Nueva cita está completamente dentro de otra
        ];
        
        if (excludeId) {
            query += ` AND a.appointment_id != ?`;
            params.push(excludeId);
        }
        
        
        const [results] = await pool.query(query, params);
        

        return results.length > 0;
    } catch (error) {

        throw error;
    }
}


//Funcion para obtener información del servicio
export const getServiceInfo = async (service_id) => {

    const query = `SELECT duration, available, name FROM service WHERE service_id = ?`

    const [results] = await pool.query(query, [service_id])
    return results[0] || null
}

//Funcion para calcular end_time basado en duration
export const calculateEndTime = (start_time, duration) => {

    const [hours, minutes, seconds] = start_time.split(':').map(Number)
    const startTimeInMinutes = hours * 60 + minutes
    const endTimeInMinutes = startTimeInMinutes + duration
    
    const endHours = Math.floor(endTimeInMinutes / 60)
    const endMinutes = endTimeInMinutes % 60
    
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

//Funcion para obtener información de una cita por ID
export const getAppointmentById = async (appointment_id) => {
    const query = `SELECT a.appointment_id,
        BIN_TO_UUID(a.user_id) as user_id,
        a.service_id,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status,
        a.notes,
        a.created_at,
        a.updated_at
    FROM appointment as a
    WHERE a.appointment_id = ?`

    const [results] = await pool.query(query, [appointment_id])

    return results[0] || null
}

//Funcion para convertir user_id de binary a UUID
export const convertUserIdToUuid = async (binary_user_id) => {
    
    if (typeof binary_user_id === 'string' && binary_user_id.includes('-')) {
        return binary_user_id
    }
    const query = `SELECT BIN_TO_UUID(?) as user_uuid`;
    
    const [results] = await pool.query(query, [binary_user_id]);
    return results[0]?.user_uuid || null;
}


//Funcion para obtener todas las citas en status cancelled con paginacion
export const getAllCancelledAppointments = async(page = 1, limit = 10) => {
    // Calcular el offset
    const offset = (page - 1) * limit;

    // Query para obtener el total de registros
    const countQuery = `SELECT COUNT(*) as total 
        FROM appointment as a
        WHERE a.status = 'cancelled'`;

    // Query principal con paginacion
    const query =`SELECT a.appointment_id,
        BIN_TO_UUID(a.user_id) as user_id,
        u.name as user_name,
        u.email as user_email,
        a.service_id,
        s.name as service_name,
        s.duration as service_duration,
        s.price as service_price,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status,
        a.notes,
        a.created_at,
        a.updated_at
    FROM appointment as a
    LEFT JOIN users as u ON a.user_id = u.user_id
    LEFT JOIN service as s ON a.service_id = s.service_id
    WHERE a.status = 'cancelled'
    ORDER BY a.updated_at DESC
    LIMIT ? OFFSET ?`;

    // Ejecutar ambas consultas
    const [countResult] = await pool.query(countQuery);
    const [results] = await pool.query(query, [limit, offset]);
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Retornar los datos con metadatos de paginacion
    return {
        data: results,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        }
    };
}

//Funcion para obtener todas las citas en status completed con paginacion
export const getAllCompletedAppointments = async(page = 1, limit = 10) => {
    // Calcular el offset
    const offset = (page - 1) * limit;

    // Query para obtener el total de registros
    const countQuery = `SELECT COUNT(*) as total 
        FROM appointment as a
        WHERE a.status = 'completed'`;

    // Query principal con paginacion
    const query =`SELECT a.appointment_id,
        BIN_TO_UUID(a.user_id) as user_id,
        u.name as user_name,
        u.email as user_email,
        a.service_id,
        s.name as service_name,
        s.duration as service_duration,
        s.price as service_price,
        a.appointment_date,
        a.start_time,
        a.end_time,
        a.status,
        a.notes,
        a.created_at,
        a.updated_at
    FROM appointment as a
    LEFT JOIN users as u ON a.user_id = u.user_id
    LEFT JOIN service as s ON a.service_id = s.service_id
    WHERE a.status = 'completed'
    ORDER BY a.appointment_date DESC, a.start_time DESC
    LIMIT ? OFFSET ?`;

    // Ejecutar ambas consultas
    const [countResult] = await pool.query(countQuery);
    const [results] = await pool.query(query, [limit, offset]);
    
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Retornar los datos con metadatos de paginacion
    return {
        data: results,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems: total,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPreviousPage: page > 1
        }
    };
}


//Funcion para obtener horarios ocupados en una fecha específica
export const getOccupiedTimeSlots = async (appointment_date) => {
    try {
        const query = `
            SELECT 
                a.start_time, 
                a.end_time, 
                s.name as service_name,
                BIN_TO_UUID(a.user_id) as user_id
            FROM appointment a
            INNER JOIN service s ON a.service_id = s.service_id
            WHERE a.appointment_date = ? 
            AND a.status = 'scheduled'
            AND a.end_time IS NOT NULL
            ORDER BY a.start_time
        `;
        
        const [results] = await pool.query(query, [appointment_date]);
        
        return results;
    } catch (error) {

        throw error;
    }
}

//Funcion para obtener horarios disponibles para un servicio en una fecha
export const getAvailableTimeSlots = async (appointment_date, service_id) => {
    try {
        // Obtener información del servicio
        const serviceInfo = await getServiceInfo(service_id);
        if (!serviceInfo) {
            throw new Error('Servicio no encontrado');
        }

        // Obtener horarios ocupados
        const occupiedSlots = await getOccupiedTimeSlots(appointment_date);
        
        // Definir horario de trabajo (ejemplo: 5:00 AM - 11:00 PM)
        const workStartTime = '05:00:00';
        const workEndTime = '23:00:00';
        const slotDuration = serviceInfo.duration; // en minutos
        
        const availableSlots = [];
        let currentTime = workStartTime;
        
        while (currentTime < workEndTime) {
            const endTime = calculateEndTime(currentTime, slotDuration);
            
            // Verificar si este slot está libre
            const isOccupied = occupiedSlots.some(slot => {
                return (
                    (currentTime >= slot.start_time && currentTime < slot.end_time) ||
                    (endTime > slot.start_time && endTime <= slot.end_time) ||
                    (currentTime <= slot.start_time && endTime >= slot.end_time)
                );
            });
            
            if (!isOccupied && endTime <= workEndTime) {
                availableSlots.push({
                    start_time: currentTime,
                    end_time: endTime
                });
            }
            
            // Avanzar al siguiente slot (cada 30 minutos)
            currentTime = addMinutesToTime(currentTime, 30);
        }
        
        return availableSlots;
    } catch (error) {
        throw error;
    }
}

//Funcion auxiliar para sumar minutos a una hora
const addMinutesToTime = (time, minutes) => {
    const [hours, mins] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + mins + minutes;
    const newHours = Math.floor(totalMinutes / 60);
    const newMins = totalMinutes % 60;
    
    return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}:00`;
}
