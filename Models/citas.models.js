import pool from '../Config/db.js';

//Funcion para listar todas las citas
export const getAllCitasFromUsers = async () => {
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
        FROM appointment as a;
        where user_id = ?`
    
    //Mandar el query a la base de datos
    const [results] = await pool.query(query);
    
    //Retornar los datos encontrados por el query
    return results;
}