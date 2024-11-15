
import express from 'express';


export default class Server {

    public app : express.Application;
    public port: number;

    constructor() {
        this.port = Number(process.env.PORT) || 3000;
        this.app = express();
    }

    start( callback: Function ) {
        this.app.listen(  this.port, callback );
    }

}