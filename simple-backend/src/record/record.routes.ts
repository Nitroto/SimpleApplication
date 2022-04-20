import { Router } from "express";
import RecordController from "./record.controllers";
import { verifyAuthToken } from "../middleware/authJwt";


const router = Router();
const recordController = new RecordController();

router.get('/records', verifyAuthToken, recordController.list)
router.get('/records/:id', verifyAuthToken, recordController.show)
router.post('/records', verifyAuthToken, recordController.create)
router.put('/records/:id', verifyAuthToken, recordController.update)
router.delete('/records/:id', verifyAuthToken, recordController.delete)
router.get('/long-running-job', verifyAuthToken, recordController.longRunningJob)

export default router