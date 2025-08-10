// swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Documentacion API Citas Médicas',
    version: '1.0.0',
    description: `
    📋 Descripción
    API REST completa para la gestión de citas médicas, servicios y notificaciones.
    
    🔐 Autenticación
    Esta API utiliza JWT (Bearer Token) para autenticación. 
    
    Pasos para autenticarse:
    1. Registrarse usando el endpoint \`POST /auth/register\`
    2. Iniciar sesión con \`POST /auth/login\` para obtener el token
    3. Usar el token en el botón "🔒 Authorize" abajo
    4. Formato del token: \`Bearer tu_token_aqui\`
    
    📚 Módulos Disponibles
    - 👤 Auth: Registro, login y gestión de usuarios
    - 🏥 Servicios: CRUD de servicios médicos
    - 📅 Citas: Gestión completa de citas médicas
    - 🔔 Notificaciones: Sistema de notificaciones

    Desarrollado por: Equipo EMEWES 
    `
  },
  servers: [
    {
      url: 'https://emewesdev-clinic.onrender.com/api',
      description: '🌐 Servidor de Producción',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Ingresa tu token JWT obtenido del endpoint de login'
      },
    },
    responses: {
      UnauthorizedError: {
        description: 'Token de acceso faltante o inválido',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Token inválido' }
              }
            }
          }
        }
      },
      ForbiddenError: {
        description: 'Acceso denegado - Permisos insuficientes',
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                success: { type: 'boolean', example: false },
                message: { type: 'string', example: 'Acceso denegado' }
              }
            }
          }
        }
      }
    }
  },
};

const options = {
  swaggerDefinition,
  // Puedes agregar más rutas aquí para documentar
  apis: ['./Routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

// Configuración personalizada para mejorar el aspecto visual
const swaggerUiOptions = {
  customCss: `
    .swagger-ui .topbar { 
      background-color: #2c3e50; 
      border-bottom: 3px solid #3498db;
    }
    .swagger-ui .topbar .download-url-wrapper { 
      display: none; 
    }
    .swagger-ui .info { 
      margin: 50px 0 30px 0; 
    }
    .swagger-ui .info .title { 
      color: #2c3e50; 
      font-size: 2.5em;
      font-weight: bold;
    }
    .swagger-ui .info .description { 
      color: #7f8c8d; 
      font-size: 2em;
    }

    .swagger-ui .renderedMarkdown code {
      font-size: 1.1em;
      color: #534e4fff;
    }
    
    .swagger-ui .scheme-container { 
      background: #f3f2f2ff; 
      border: 1px solid #f3f2f2ff;
      border-radius: 5px;
      margin: 20px 20px; 
    }

    .swagger-ui .servers-title {
      font-size: 1.5em;
      color: #2c3e50;
      margin-bottom: 10px;
    }
    .swagger-ui .opblock.opblock-post { 
      border-color: #27ae60; 
      background: rgba(39, 174, 96, 0.1);
    }
    .swagger-ui .opblock.opblock-get { 
      border-color: #3498db; 
      background: rgba(52, 152, 219, 0.1);
    }
    .swagger-ui .opblock.opblock-put { 
      border-color: #f39c12; 
      background: rgba(243, 156, 18, 0.1);
    }
    .swagger-ui .opblock.opblock-delete { 
      border-color: #e74c3c; 
      background: rgba(231, 76, 60, 0.1);
    }
    .swagger-ui .opblock.opblock-patch { 
      border-color: #0de1e9ff; 
      background: rgba(89, 179, 182, 0.1);
    }
    .swagger-ui .opblock .opblock-summary { 
      padding: 10px 20px;
      font-weight: 600;
    }
    .swagger-ui .btn.authorize { 
      background-color: #27ae60; 
      border-color: #27ae60;
      color: white;
      font-weight: bold;
    }
    .swagger-ui .btn.authorize:hover { 
      background-color: #229954; 
      border-color: #229954;
    }
    .swagger-ui .parameters-col_description p { 
      color: #2c3e50; 
      font-weight: 500;
    }
    .swagger-ui .response-col_status { 
      font-weight: bold; 
    }
    .swagger-ui .responses-inner h4 { 
      color: #2c3e50; 
      font-size: 1.2em;
    }
    .swagger-ui .model-box { 
      background: #f8f9fa; 
      border: 1px solid #dee2e6;
      border-radius: 5px;
    }
    .swagger-ui .highlight-code .microlight { 
      background: #f8f9fa; 
    }
    .swagger-ui select { 
      border: 2px solid #bdc3c7; 
      border-radius: 4px;
    }
    .swagger-ui input[type=text], .swagger-ui input[type=password] { 
      border: 2px solid #bdc3c7; 
      border-radius: 4px;
      padding: 8px 12px;
    }
    .swagger-ui input[type=text]:focus, .swagger-ui input[type=password]:focus { 
      border-color: #3498db; 
      outline: none; 
      box-shadow: 0 0 5px rgba(52, 152, 219, 0.3);
    }
  `,
  customSiteTitle: "Documentación API Citas Médicas",
  customfavIcon: "/favicon.ico",
  swaggerOptions: {
    persistAuthorization: true,
    displayRequestDuration: true,
    docExpansion: 'list',
    showExtensions: true,
    showCommonExtensions: true,
    tryItOutEnabled: true,
    defaultModelRendering: 'model',
    defaultModelsExpandDepth: -1,
    defaultModelExpandDepth: 1,
  }
};

export default (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));
};
