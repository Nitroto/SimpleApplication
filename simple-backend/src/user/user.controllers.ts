import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserStore, UserWithCredentials } from './user.models';
import { HandlerError } from '../utils/handleError';


const store = new UserStore();

class UserController {
    public async list(req: Request, res: Response): Promise<string | void>{
        try {
            const users = await store.list();
            res.json(users);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    };

    public async show(req: Request, res: Response): Promise<void>{
        const userId = req.params.id;
        try {
            const user = await store.get(userId);
            const idInToken = parseInt(res.locals.token.id, 10);
            const idInRequest = parseInt(userId, 10)
            const isTheOwnUser = idInToken === idInRequest;
            if (!user) {
                throw new HandlerError(404, `We don't have that user`);
            }
            if (!isTheOwnUser) {
                res.json({
                    firstname: user.firstName,
                    lastName: user.lastName
                });
                return;
            }

            delete user.passwordDigest;
            res.json(user);
        } catch (err) {
            if (err instanceof HandlerError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                res.status(500).json({ message: err.message });
            }
        }
    };

    public async create(req: Request, res: Response): Promise<void>{
        const user: UserWithCredentials = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password
        };
        try {
            if (!user.firstName || !user.lastName || !user.email) {
                throw new HandlerError(400, `first name, last name and email are required`);
            }
            if (!user.password) {
                throw new HandlerError(400, `password is required`);
            }
            const createUser = await store.create(user);
            const token = jwt.sign(
                { user: createUser },
                process.env.TOKEN_SECRET || ''
            );
            res.json({ token, id: createUser.id });
        } catch (err) {
            if (err instanceof HandlerError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                res.status(500).json({ message: err.message });
            }
        }
    };

    public async authenticate(req: Request, res: Response): Promise<void>{
        const user: UserWithCredentials = {
            email: req.body.email,
            password: req.body.password
        };
        try {
            const authenticate = await store.authenticate(user);
            if (!authenticate) {
                throw new HandlerError(401, `Wrong id or password`);
            }
            const token = jwt.sign(
                { user: authenticate },
                process.env.TOKEN_SECRET || ''
            );
            res.json({ token, id: authenticate.id });
        } catch (err) {
            if (err instanceof HandlerError) {
                res.status(err.statusCode).json({ message: err.message });
            } else {
                res.status(500).json({ message: err.message });
            }
        }
    };
}

export default UserController;