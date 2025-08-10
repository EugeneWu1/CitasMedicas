export default function errorHandler(err, req, res, next) {
  let statusCode = err.status || err.statusCode || 500;
  let message = err.message || 'Error interno del servidor';

  // Log del error para debugging
  console.error('Error capturado por errorHandler:', {
    message: err.message,
    status: statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString()
  });

  // Errores de validación (Zod o similares)
  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    statusCode = 400;
    if (err.details) {
      message = err.details.map(d => d.message).join(', ');
    } else if (err.errors) {
      message = err.errors.map(e => e.message).join(', ');
    } else {
      message = err.message || 'Error de validación de datos';
    }
  }

  // Errores de base de datos MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    statusCode = 409;
    message = 'El registro ya existe en la base de datos';
  }
  
  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    statusCode = 400;
    message = 'Referencia a un registro que no existe';
  }

  if (err.code === 'ER_BAD_FIELD_ERROR') {
    statusCode = 500;
    message = 'Error en la estructura de la consulta';
  }

  if (err.code === 'ENOTFOUND') {
    statusCode = 503;
    message = 'No se puede conectar a la base de datos';
  }

  // Errores de autenticación JWT
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido. Autenticación fallida';
  }
  
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado. Por favor, inicia sesión nuevamente';
  }

  if (err.name === 'NotBeforeError') {
    statusCode = 401;
    message = 'Token no válido aún';
  }

  // Errores de autorización personalizados
  if (statusCode === 401) {
    message = message || 'No estás autorizado para realizar esta acción';
  }

  if (statusCode === 403) {
    message = message || 'No tienes permisos para acceder a este recurso';
  }

  // Error de recurso no encontrado
  if (statusCode === 404) {
    message = message || 'Recurso no encontrado';
  }

  // Error de conflicto (duplicados, violaciones de reglas de negocio)
  if (statusCode === 409) {
    message = message || 'Conflicto con el estado actual del recurso';
  }

  // Error de datos mal formados
  if (statusCode === 422) {
    message = message || 'Los datos proporcionados no son válidos';
  }

  // Error de límite excedido (rate limit)
  if (statusCode === 429) {
    message = message || 'Demasiadas solicitudes. Intenta nuevamente más tarde';
  }

  // Construir respuesta de error
  const response = {
    success: false,
    error: {
      message,
      status: statusCode,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    }
  };

  // En modo desarrollo incluir stack trace y detalles adicionales
  if (process.env.NODE_ENV === 'development') {
    response.error.stack = err.stack;
    response.error.details = err.details || null;
  }

  // Enviar respuesta de error
  res.status(statusCode).json(response);
}
