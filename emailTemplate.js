// emailTemplate.js
export const createAccountEmailHTML = (tempPassword) => {
    return `<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a EMEWES CLINIC</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f7fa;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #2c5aa0 0%, #1e3d72 100%);
            padding: 40px 30px;
            text-align: center;
            color: white;
        }
        
        .logo {
            font-size: 32px;
            font-weight: bold;
            margin-bottom: 8px;
            letter-spacing: 2px;
        }
        
        .tagline {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .welcome-title {
            font-size: 28px;
            color: #2c5aa0;
            margin-bottom: 20px;
            text-align: center;
            font-weight: 600;
        }
        
        .welcome-text {
            font-size: 16px;
            margin-bottom: 30px;
            color: #555;
            text-align: center;
            line-height: 1.8;
        }
        
        .credentials-box {
            background: linear-gradient(135deg, #f8f9ff 0%, #e8f2ff 100%);
            border: 2px solid #e1ebf7;
            border-radius: 12px;
            padding: 30px;
            margin: 30px 0;
            text-align: center;
            position: relative;
        }
        
        .credentials-box::before {
            content: '🔐';
            font-size: 24px;
            position: absolute;
            top: -12px;
            left: 50%;
            transform: translateX(-50%);
            background: white;
            padding: 0 10px;
        }
        
        .credentials-title {
            font-size: 18px;
            color: #2c5aa0;
            margin-bottom: 15px;
            font-weight: 600;
        }
        
        .temp-password {
            font-size: 32px;
            font-weight: bold;
            color: #1e3d72;
            background: white;
            border: 2px dashed #2c5aa0;
            border-radius: 8px;
            padding: 15px 25px;
            margin: 15px 0;
            letter-spacing: 3px;
            font-family: 'Courier New', monospace;
        }
        
        .security-note {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
            text-align: left;
        }
        
        .security-note h4 {
            color: #856404;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        .security-note p {
            color: #856404;
            font-size: 14px;
            margin-bottom: 8px;
        }
        
        .next-steps {
            background: #f8f9fa;
            border-left: 4px solid #2c5aa0;
            padding: 20px;
            margin: 25px 0;
        }
        
        .next-steps h4 {
            color: #2c5aa0;
            margin-bottom: 15px;
            font-size: 16px;
        }
        
        .step {
            display: flex;
            align-items: flex-start;
            margin-bottom: 12px;
            font-size: 14px;
        }
        
        .step-number {
            background: #2c5aa0;
            color: white;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            margin-right: 12px;
            flex-shrink: 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #2c5aa0 0%, #1e3d72 100%);
            color: white;
            padding: 15px 35px;
            text-decoration: none;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            margin: 25px auto;
            display: block;
            text-align: center;
            max-width: 250px;
            transition: transform 0.3s ease;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
        }
        
        .support-section {
            background: #f8f9fa;
            padding: 25px;
            margin-top: 30px;
            border-radius: 8px;
            text-align: center;
        }
        
        .support-section h4 {
            color: #2c5aa0;
            margin-bottom: 15px;
        }
        
        .contact-info {
            font-size: 14px;
            color: #666;
            margin-bottom: 8px;
        }
        
        .footer {
            background: #2c3e50;
            color: #bdc3c7;
            padding: 30px;
            text-align: center;
            font-size: 14px;
        }
        
        .footer-logo {
            font-size: 24px;
            font-weight: bold;
            color: white;
            margin-bottom: 15px;
        }
        
        .footer p {
            margin-bottom: 8px;
            line-height: 1.6;
        }
        
        .social-links {
            margin-top: 20px;
        }
        
        .social-links a {
            color: #3498db;
            text-decoration: none;
            margin: 0 10px;
        }
        
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                box-shadow: none;
            }
            
            .header, .content, .footer {
                padding: 25px 20px;
            }
            
            .welcome-title {
                font-size: 24px;
            }
            
            .temp-password {
                font-size: 24px;
                padding: 12px 15px;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">EMEWES CLINIC</div>
            <div class="tagline">Tu salud en las mejores manos</div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <h1 class="welcome-title">¡Bienvenido a EMEWES CLINIC!</h1>
            
            <p class="welcome-text">
                Nos complace informarte que tu cuenta ha sido creada exitosamente. 
                Ahora puedes acceder a nuestro sistema de gestión de citas médicas 
                y disfrutar de una atención médica más eficiente y personalizada.
            </p>
            
            <!-- Credentials Box -->
            <div class="credentials-box">
                <h3 class="credentials-title">Tu clave temporal de acceso</h3>
                <div class="temp-password">${tempPassword}</div>
                <p style="color: #666; font-size: 14px; margin-top: 10px;">
                    Utiliza esta clave para tu primer inicio de sesión
                </p>
            </div>
            
            <!-- Security Note -->
            <div class="security-note">
                <h4>⚠️ Importante - Seguridad de tu cuenta</h4>
                <p>• Esta es una clave temporal que debes cambiar en tu primer inicio de sesión</p>
                <p>• No compartas esta información con terceros</p>
                <p>• Si no solicitaste esta cuenta, contacta inmediatamente a soporte</p>
            </div>
            
            <!-- Next Steps -->
            <div class="next-steps">
                <h4>Próximos pasos:</h4>
                <div class="step">
                    <div class="step-number">1</div>
                    <div>Inicia sesión en nuestra plataforma con tu email y la clave temporal</div>
                </div>
                <div class="step">
                    <div class="step-number">2</div>
                    <div>Cambia tu contraseña por una segura y personalizada</div>
                </div>
                <div class="step">
                    <div class="step-number">3</div>
                    <div>Completa tu perfil médico para una mejor atención</div>
                </div>
                <div class="step">
                    <div class="step-number">4</div>
                    <div>¡Comienza a agendar tus citas médicas!</div>
                </div>
            </div>
            
            <!-- CTA Button -->
            <a href="#" class="cta-button">Iniciar Sesión Ahora</a>
            
            <!-- Support Section -->
            <div class="support-section">
                <h4>¿Necesitas ayuda?</h4>
                <div class="contact-info">📧 soporte@emewesclinic.com</div>
                <div class="contact-info">📞 +504 2234-5678</div>
                <div class="contact-info">🕒 Lun-Vie: 8:00 AM - 6:00 PM</div>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-logo">EMEWES CLINIC</div>
            <p>Empresa Especializada en Servicios de Salud</p>
            <p>Comprometidos con tu bienestar y salud</p>
            <p style="margin-top: 15px; font-size: 12px; opacity: 0.8;">
                Este correo fue enviado automáticamente. Por favor, no respondas a este email.
            </p>
            <div class="social-links">
                <a href="#">Facebook</a> |
                <a href="#">Instagram</a> |
                <a href="#">LinkedIn</a>
            </div>
        </div>
    </div>
</body>
</html>`;
};