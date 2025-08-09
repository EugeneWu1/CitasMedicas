// Función para crear errores personalizados con status
export const createError = (message, statusCode = 500) => {
    const error = new Error(message);
    error.status = statusCode;
    return error;
};

// Middleware para manejar rutas no encontradas
export const notFoundHandler = (req, res, next) => {
    const error = createError(`Ruta ${req.originalUrl} no encontrada`, 404);
    next(error);
};
