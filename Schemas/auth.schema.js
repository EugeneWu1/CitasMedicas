import {z} from 'zod';

//npm install zxcvbn evalua la cotnraseña y la
//schema de registro de usuario
const authSchema = z.object({
    
 name: z.string({message: 'Formato de nombre invalido'}).min(1, { message: 'Nombre es obligatorio' }),
 email: z.string().email({ message: 'Formato de email invalido' }),
 phone: z.string().min(8, { message: 'Use un numero de telefono valido' }),
role: z.enum(['admin', 'client'], { message: 'Rol debe ser admin o client' }),
}).strict();


const authSchemaUpdate = z.object({
    old_password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: "Debe tener al menos 8 caracteres, incluir letras y números.",
    }),
    new_password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: "Debe tener al menos 8 caracteres, incluir letras y números.",
    }),
    confirm_password: z.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
      message: "Debe tener al menos 8 caracteres, incluir letras y números.",
    }),
  })


export const authSchemaUpdateData = (dataUpdate) => {
    return authSchemaUpdate.safeParse(dataUpdate);
};


export const authSchemaData  = (dataLogin) => {

    return authSchema.safeParse(dataLogin);
}




