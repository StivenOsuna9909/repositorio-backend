"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Carga las variables del archivo .env
const server_1 = __importDefault(require("./classes/server"));
const usuario_1 = __importDefault(require("./routes/usuario"));
const mongoose_1 = __importDefault(require("mongoose"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors")); // Importa el módulo cors
const carrito_1 = __importDefault(require("./routes/carrito"));
const server = new server_1.default();
// Configura CORS para permitir cualquier origen
server.app.use((0, cors_1.default)({ origin: '*' }));
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
// Rutas de mi app
server.app.use('/user', usuario_1.default);
server.app.use('/carrito', carrito_1.default);
// Obtener la URL de conexión de la base de datos
const mongoUrl = process.env.MONGO_URL;
if (!mongoUrl) {
    throw new Error('MONGO_URL no está definido en las variables de entorno');
}
// Conectar DB
mongoose_1.default.connect(mongoUrl, {})
    .then(() => {
    console.log('Base de datos ONLINE');
})
    .catch((err) => {
    console.error('Error al conectar a la base de datos:', err);
});
// Levantar express
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
