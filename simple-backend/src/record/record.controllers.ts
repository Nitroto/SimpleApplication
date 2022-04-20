import { Request, Response } from 'express';
import { Record, RecordStore } from "./record.models";
import { HandlerError } from "../utils/handleError";

const store = new RecordStore()

class RecordController {
    public async list(req: Request, res: Response): Promise<void>{
        const idInToken = parseInt(res.locals.token.id, 10);
        try {
            const records = await store.list(idInToken);
            res.json(records);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };

    public async show(req: Request, res: Response): Promise<void>{
        const recordId = req.params.id;
        try {
            const record = await store.get(recordId);
            if (!record) {
                throw new HandlerError(404, `Record can not be found`);
            }

            const idInToken = parseInt(res.locals.token.id, 10);
            if (idInToken !== record.userId) {
                throw new HandlerError(404, `You have no right on this record.`);

            }

            res.json(record);
        } catch (err) {
            if (err instanceof HandlerError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                res.status(500).json({ message: err.message });
            }
        }
    };

    public async create(req: Request, res: Response): Promise<void>{
        const record: Record = {
            userId: res.locals.token.id,
            name: req.body.name,
            content: req.body.content,
        };
        try {
            if (!record.name || !record.content) {
                throw new HandlerError(400, `Record name and content are required`);
            }
            const createdRecord = await store.create(record);

            res.json(createdRecord);
        } catch (err) {
            if (err instanceof HandlerError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                res.status(500).json({ message: err.message });
            }
        }
    };

    public async update(req: Request, res: Response): Promise<void>{
        try {
            const record = await store.get(req.params.id);
            if (!record) {
                throw new HandlerError(404, `Record can not be found`);
            }

            const idInToken = parseInt(res.locals.token.id, 10);
            if (idInToken !== record.userId) {
                throw new HandlerError(404, `You have no right on this record.`);
            }
            const updateRecordData: Record = {
                id: parseInt(req.params.id, 10),
                name: req.body.name,
                content: req.body.content,
            };
            const updatedRecord = await store.update(updateRecordData);

            res.json(updatedRecord);
        } catch (err) {
            if (err instanceof HandlerError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                res.status(500).json({ message: err.message });
            }
        }
    };

    public async delete(req: Request, res: Response): Promise<void>{
        const recordId = req.params.id;
        try {
            const record = await store.get(recordId);
            if (!record) {
                throw new HandlerError(404, `Record can not be found`);
            }

            const idInToken = parseInt(res.locals.token.id, 10);
            if (idInToken !== record.userId) {
                throw new HandlerError(404, `You have no right on this record.`);
            }

            await store.delete(record);

            res.json({ message: "Record deleted." });
        } catch (err) {
            if (err instanceof HandlerError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                res.status(500).json({ message: err.message });
            }
        }
    };

    public async longRunningJob(req: Request, res: Response): Promise<void>{
        setTimeout(() => {
            // tslint:disable-next-line:no-console
            console.log("Long Running Operation Done!");
            res.send("Long Running Operation Done!");
        }, 600000)
    }
}

export default RecordController;