export const isAdmin = (req, res, next) => {

    const { role, id } = req.params

    //validar en DDBB que el rol sea el mismo del token

    if (role !== 'admin') {
        const error = new Error('Acceso denegado. Se requiere rol de administrador.');
        error.status = 401;
        return next(error); // Delega al errorHandler
    }

    next()
}