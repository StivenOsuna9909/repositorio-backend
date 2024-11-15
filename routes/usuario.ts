import { Router, Request, Response } from 'express';
import { Usuario } from '../models/usuario.model';
import bcrypt from 'bcrypt';
import Token from '../classes/token';
import { verificaToken } from '../middlewares/autenticacion';

const userRoutes = Router();


userRoutes.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;
  
    try {
      // Validar si se envían los campos necesarios
      if (!email || !password) {
        return res.status(400).json({
          ok: false,
          mensaje: 'Email y contraseña son obligatorios',
        });
      }
  
      // Buscar el usuario por email
      const userDB = await Usuario.findOne({ email });
      if (!userDB) {
        return res.status(401).json({
          ok: false,
          mensaje: 'Usuario o contraseña incorrectos',
        });
      }
  
      // Comparar la contraseña
      const passwordMatch = userDB.compararPassword(password);
      if (!passwordMatch) {
        return res.status(401).json({
          ok: false,
          mensaje: 'Usuario o contraseña incorrectos',
        });
      }
  
      // Generar token
      const tokenUser = Token.getJwtToken({
        _id: userDB._id,
        nombre: userDB.nombre,
        email: userDB.email,
      });
  
      // Responder con éxito
      return res.json({
        ok: true,
        token: tokenUser,
      });
    } catch (err) {
      console.error('Error en el login:', err);
  
      // Manejar cualquier error inesperado
      return res.status(500).json({
        ok: false,
        mensaje: 'Error interno del servidor',
      });
    }
  });
  



// Crear un usuario
userRoutes.post('/create', ( req: Request, res: Response ) => {

    const user = {
        nombre   : req.body.nombre,
        email    : req.body.email,
        password : bcrypt.hashSync(req.body.password, 10),
    };

    Usuario.create( user ).then( userDB => {

        const tokenUser = Token.getJwtToken({
            _id: userDB._id,
            nombre: userDB.nombre,
            email: userDB.email,
        });

        res.json({
            ok: true,
            token: tokenUser
        });


    }).catch( err => {
        res.json({
            ok: false,
            err
        });
    });




});


// Actualizar usuario
userRoutes.post('/update', verificaToken, async (req: any, res: any) => {
    const user = {
        nombre: req.body.nombre || req.usuario.nombre,
        email: req.body.email || req.usuario.email,
    };

    try {
        // Usar async/await para manejar la promesa
        const userDB = await Usuario.findByIdAndUpdate(
            req.usuario._id,
            user,
            { new: true } // Opciones para retornar el nuevo documento
        );

        if (!userDB) {
            return res.json({
                ok: false,
                mensaje: 'No existe un usuario con ese ID',
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
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            ok: false,
            mensaje: 'Error al actualizar el usuario',
        });
    }
});


export default userRoutes;