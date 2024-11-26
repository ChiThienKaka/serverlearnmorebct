import { Router } from "express";
import {create, getUserProcessQuizzbyIdEnrollment} from "../controllers/userprocessquizzController"
const router = Router();
//chấm bài cho người dùng
router.post('/create', create);
//lấy lịch sử làm bài
router.get('/getlichsulambai/:idenrollment/:idquizz', getUserProcessQuizzbyIdEnrollment)
export default router;