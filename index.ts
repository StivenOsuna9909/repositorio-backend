import Server from './classes/server';
import userRoutes from './routes/usuario';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';  // Importa el módulo cors
import cartRoutes from './routes/carrito';

const server = new Server();

// Configura CORS para permitir cualquier origen
server.app.use(cors({ origin: '*' }));

// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

// Rutas de mi app
server.app.use('/user', userRoutes);
server.app.use('/carrito', cartRoutes);

// Conectar DB
mongoose.connect(
  'mongodb://localhost:27017/server',
  { useNewUrlParser: true, useCreateIndex: true },
  (err) => {
    if (err) throw err;
    console.log('Base de datos ONLINE');
  }
);

// Levantar express
server.start(() => {
  console.log(`Servidor corriendo en puerto ${server.port}`);
});
