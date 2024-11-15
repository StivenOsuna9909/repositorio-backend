import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUsuario extends Document {
    nombre: string;
    email: string;
    password: string;

    compararPassword(password: string): Promise<boolean>;
}

const usuarioSchema = new Schema<IUsuario>({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesaria'] },
});

usuarioSchema.methods.compararPassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

// Asegura que el tipo de colección sea 'IUsuario'
export const Usuario = model<IUsuario>('Usuario', usuarioSchema);
