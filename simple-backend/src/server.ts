import express from 'express';
import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';
import pool from "./config/db.config";
import recordRoutes from './record/record.routes';
import userRoutes from './user/user.routes'


class Server {
    private app;

    constructor(){
        this.app = express();
        this.configMiddleware();
        this.configRouter();
        this.testDBConnect()
    }

    private configMiddleware(){
        this.app.use(helmet());
        this.app.use(cors());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(bodyParser.json({ limit: '1mb' })); // 100kb default
    }

    private configRouter(){
        this.app.use('/api', userRoutes);
        this.app.use('/api', recordRoutes);
    }

    private testDBConnect(){
        pool.connect((err, client, done) => {
            if (err) {
                throw new Error(`${err}`)
            }
            console.log('Database is connected successfully!');
        });
    }

    public start = (port: number) => {
        return new Promise((resolve, reject) => {
            this.app.listen(port, () => {
                resolve(port);
            }).on('error', (err: object) => reject(err));
        });
    }
}

export default Server;