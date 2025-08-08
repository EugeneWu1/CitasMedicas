import pool from '../Config/db.js';

//Funcion para listar todas las citas
export const getAllAppointmentsFromUser = async (userId) => {

    const query = `SELECT a.appointment_id,
            a.user_id,
            a.service_id,
            a.appointment_date,
            a.start_time,
            a.end_time,
            a.status,
            a.notes,
            a.created_at,
            a.updated_at
        FROM appointment as a
        WHERE user_id = ?`

    //Mandar el query a la base de datos
    const [results] = await pool.query(query);
    
    //Retornar los datos encontrados por el query
    return results;
}

//Funcion para insertar una cita
export const createAppointment = async (citaData) => {
    
    const conn = await pool.getConnection();

    try {
        conn.beginTransaction();

        const { appointment_id, user_id, service_id, appointment_date, start_time, end_time, status, notes } = citaData;

        const query = `INSERT INTO appointment (appointment_id, user_id, service_id, appointment_date, start_time, end_time, status, notes)
                       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    
        await conn.execute(query, [
            appointment_id,
            user_id,
            service_id,
            appointment_date,
            start_time,
            end_time,
            status,
            notes,
            new Date(),
            new Date()
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
            a.user_id,
            a.service_id,
            a.appointment_date,
            a.start_time,
            a.end_time,
            a.status,
            a.notes,
            a.created_at,
            a.updated_at
        FROM appointment as a
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

        const { user_id, service_id, appointment_date, start_time, end_time, status, notes } = citaData;

        const query = `UPDATE appointment
                       SET user_id = ?,
                           service_id = ?,
                           appointment_date = ?,
                           start_time = ?,
                           end_time = ?,
                           status = ?,
                           notes = ?,
                           updated_at = ?
                       WHERE appointment_id = ?`;

        const [result] = await conn.execute(query, [
            user_id,
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