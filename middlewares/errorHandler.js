export default function errorHandler(err, req, res, next) {
  let statusCode = err.status || 500;
  let message = err.message || 'Error interno del servidor';

  // Errores de validación
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = err.details
      ? err.details.map(d => d.message).join(', ')
      : err.message || 'Error de validación';
  }

  // Error para no autorizados
  if (statusCode === 401) {
    message = message || 'No estás autorizado para realizar esta acción.';
  }

  // Error de token inválido o expirado 
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Token inválido. Autenticación fallida.';
  }
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expirado. Por favor, inicia sesión nuevamente.';
  }

  // Error de acceso no autorizado
  if (statusCode === 403) {
    message = 'No tienes permiso para acceder a este recurso.';
  }

  // Error de recurso no encontrado
  if (statusCode === 404) {
    message = message || 'Recurso no encontrado.';
  }

  // En modo desarrollo muestra el stack trace
  const response = {
    success: false,
    message,
  };

  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}
