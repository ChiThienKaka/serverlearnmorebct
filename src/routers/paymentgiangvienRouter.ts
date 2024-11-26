import { Router } from "express";
import {create, getByidGV, getalladmin} from "../controllers/paymentgiangvienController"

const router = Router();

router.post('/create', create);
//lấy lịch sử theo giảng viên
router.post('/paymentgvbyidgv', getByidGV);
//Lấy lịch sử theo admin
router.post('/paymentgvadmin', getalladmin);

export default router;