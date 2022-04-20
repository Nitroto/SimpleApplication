import { Router } from "express";
import { verifyAuthToken } from "../middleware/authJwt";
import UserController from "./user.controllers";

const router = Router();
const userController = new UserController();


router.get('/users', verifyAuthToken, userController.list);
router.get('/users/:id', verifyAuthToken, userController.show);
router.post('/users', userController.create);
router.post('/users/authenticate', userController.authenticate);


export default router;