"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
class Server {
    constructor() {
        this.port = Number(process.env.PORT) || 3000;
        this.app = (0, express_1.default)();
    }
    // Start the server and handle errors
    start(callback) {
        // Usar el método listen sin pasar un manejador de error directamente
        this.app.listen(this.port, () => {
            //console.log(`Server is running on port ${this.port}`);
            callback();
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                //console.error(`Port ${this.port} is already in use. Trying a different port...`);
                // Opcional: cambiar el puerto y volver a intentar
                this.port = 3001; // Cambia el puerto si el 3000 está en uso
                this.start(callback); // Vuelve a intentar iniciar el servidor con el nuevo puerto
            }
            else {
                //console.error('Error starting the server:', err);
                process.exit(1); // Salir si hay un error
            }
        });
    }
}
exports.default = Server;
