import express from 'express';

export default class Server {
    public app: express.Application;
    public port: number;

    constructor() {
        this.port = Number(process.env.PORT) || 3000;
        this.app = express();
    }

    // Start the server and handle errors
    start(callback: () => void): void {
        // Usar el método listen sin pasar un manejador de error directamente
        this.app.listen(this.port, () => {
            //console.log(`Server is running on port ${this.port}`);
            callback();
        }).on('error', (err: NodeJS.ErrnoException) => {  // Tipar el error correctamente
            if (err.code === 'EADDRINUSE') {
                //console.error(`Port ${this.port} is already in use. Trying a different port...`);
                // Opcional: cambiar el puerto y volver a intentar
                this.port = 3001; // Cambia el puerto si el 3000 está en uso
                this.start(callback);  // Vuelve a intentar iniciar el servidor con el nuevo puerto
            } else {
                //console.error('Error starting the server:', err);
                process.exit(1); // Salir si hay un error
            }
        });
    }
}
