import { Router, Request, Response } from 'express';
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verificaToken } from '../middlewares/autenticacion';

const userRoutes = Router();


// Login
userRoutes.post('/login', async (req: Request, res: Response) => {
    const body = req.body;

    try {
        const userDB = await Usuario.findOne({ email: body.email });

        if (!userDB) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario o contraseña no son correctos'
            });
        }

        const validPassword = await userDB.compararPassword(body.password);

        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Usuario o contraseña no son correctos'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
        });

        res.json({
            ok: true,
            token: tokenUser,
            usuario: {
                _id: userDB._id,
                nombre: userDB.nombre,
                email: userDB.email
            }
        });

    } catch (error) {
        console.error('Error en el login:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error en el servidor'
        });
    }
});

// Crear un usuario
userRoutes.post('/create', async (req: Request, res: Response) => {
    const user = {
        nombre: req.body.nombre,
        email: req.body.email,
        password: req.body.password
    };

    try {
        const userDB = await Usuario.create(user);
        
        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
        });

        res.json({
            ok: true,
            token: tokenUser,
            user: userDB
        });

    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al crear usuario'
        });
    }
});

// Actualizar usuario
userRoutes.post('/update', verificaToken, async (req: Request, res: Response) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
    };

    try {
        const userDB = await Usuario.findByIdAndUpdate(
            req.usuario._id,
            user,
            { new: true }
        );

        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID'
            });
        }

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
        });

        res.json({
            ok: true,
            token: tokenUser,
            usuario: userDB
        });

    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar el usuario'
        });
    }
});


export default userRoutes;