import { Router } from "express";
import {payment, callback, kiemtragiaodich} from "../controllers/momoController";
const router = Router();
router.post('/payment', payment);
router.post('/callback', callback);
router.post('/kiemtragiaodich', kiemtragiaodich);

export default router;