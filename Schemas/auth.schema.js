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

    new_password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
      message: "La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un símbolo.",
    }),
    confirm_password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/, {
      message: "La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un símbolo.",
    }),
  })


export const authSchemaUpdateData = (dataUpdate) => {
    return authSchemaUpdate.safeParse(dataUpdate);
};


export const authSchemaData  = (dataLogin) => {

    return authSchema.safeParse(dataLogin);
}




