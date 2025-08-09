import pool from '../Config/db.js';

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
    
    const params = [user_id, appointment_date, start_time];
    
    if (excludeId) {
        query += ` AND appointment_id != ?`;
        params.push(excludeId);
    }
    
    const [results] = await pool.query(query, params);
    return results.length > 0;
};

//Funcion para verificar conflictos de horario
export const checkTimeConflict = async (appointment_date, start_time, end_time, excludeId = null) => {
    let query = `
        SELECT appointment_id 
        FROM appointment 
        WHERE appointment_date = ? 
        AND status = 'scheduled'
        AND (
            (start_time <= ? AND end_time > ?) OR
            (start_time < ? AND end_time >= ?) OR
            (start_time >= ? AND end_time <= ?)
        )
    `;
    
    const params = [
        appointment_date,
        start_time, start_time,
        end_time, end_time,
        start_time, end_time
    ];
    
    if (excludeId) {
        query += ` AND appointment_id != ?`;
        params.push(excludeId);
    }
    
    const [results] = await pool.query(query, params);
    return results.length > 0;
};

//Funcion para obtener información del servicio
export const getServiceInfo = async (service_id) => {
    const query = `SELECT duration, available, name FROM service WHERE service_id = ?`;
    const [results] = await pool.query(query, [service_id]);
    return results[0] || null;
};

//Funcion para calcular end_time basado en duration
export const calculateEndTime = (start_time, duration) => {
    const [hours, minutes, seconds] = start_time.split(':').map(Number);
    const startTimeInMinutes = hours * 60 + minutes;
    const endTimeInMinutes = startTimeInMinutes + duration;
    
    const endHours = Math.floor(endTimeInMinutes / 60);
    const endMinutes = endTimeInMinutes % 60;
    
    return `${String(endHours).padStart(2, '0')}:${String(endMinutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
};

//Funcion para listar todas las citas
export const getAllAppointmentsFromUser = async (id) => {

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
    WHERE a.user_id = UUID_TO_BIN(?)`

    //Mandar el query a la base de datos
    const [results] = await pool.query(query, [id]);
    
    //Retornar los datos encontrados por el query
    return results;
}

//Funcion para insertar una cita
export const createAppointment = async (citaData) => {
    
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const { appointment_id, user_id, service_id, appointment_date, start_time, end_time, status, notes } = citaData;

        const query = `INSERT INTO appointment (appointment_id, user_id, service_id, appointment_date, start_time, end_time, status, notes)
                       VALUES (?, UUID_TO_BIN(?), ?, ?, ?, ?, ?, ?)`;
    
        const [result] = await conn.execute(query, [
            appointment_id,
            user_id,
            service_id,
            appointment_date,
            start_time,
            end_time,
            status,
            notes
        ]);

        await conn.commit();
        return result;

    } catch (error) {

        await conn.rollback();
        throw error;

    } finally {

        conn.release();
    }
}

//Funcion para eliminar una cita
export const deleteAppointment = async (id) => {
    
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const query = `DELETE FROM appointment WHERE appointment_id = ?`;

        const [result] = await conn.execute(query, [id]);

        await conn.commit();
        return {
            success: result.affectedRows > 0,
            message: result.affectedRows > 0 ? 'Cita eliminada correctamente' : 'No se encontró la cita'
        }

    } catch (error) {

        await conn.rollback();
        throw error;

    } finally {

        conn.release();
    }
}

//Funcion para obtener todas las citas programadas
export const getAllScheduledAppointments = async () => {
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
    WHERE a.status = 'scheduled'`;

    //Mandar el query a la base de datos
    const [results] = await pool.query(query);

    //Retornar los datos encontrados por el query
    return results;
}


//Funcion para actualizar una cita
export const updateAppointment = async (id, citaData) => {
    
    const conn = await pool.getConnection();

    try {
        await conn.beginTransaction();

        const { service_id, appointment_date, start_time, end_time, status, notes } = citaData;

        const query = `UPDATE appointment
                       SET service_id = ?,
                           appointment_date = ?,
                           start_time = ?,
                           end_time = ?,
                           status = ?,
                           notes = ?,
                           updated_at = ?
                       WHERE appointment_id = ?`;

        const [result] = await conn.execute(query, [
            service_id,
            appointment_date,
            start_time,
            end_time,
            status,
            notes,
            new Date(),
            id
        ]);

        await conn.commit();

        return { 
            success: true, 
            message: 'Cita actualizada correctamente',
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