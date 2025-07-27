import {z} from 'zod';


//schema de registro de usuario
const authSchema = z.object({
    
 name: z.string({message: 'Formato de nombre invalido'}).min(1, { message: 'Nombre es obligatorio' }),
 email: z.string().email({ message: 'Formato de email invalido' }),
 phone: z.string().min(8, { message: 'Use un numero de telefono valido' }),
role: z.enum(['admin', 'client'], { message: 'Rol debe ser admin o client' }),
}).strict();


export const authSchemaData  = (dataLogin) => {

    return authSchema.safeParse(dataLogin);
}

