import { Router } from "express";
import {CreateQuizz, getQuizzbyCourseID, getidquizz, updatequizzbyid} from "../controllers/quizzController";
const router = Router();

//Tạo một bài kiểm tra mới
router.post('/createquizz', CreateQuizz);

//Lấy danh sách bài kiểm tra theo id course
router.get('/getquizz/:courseid', getQuizzbyCourseID)

//lấy quizz theo id
router.post('/getquizzbyid', getidquizz);

//cập nhật bài kiểm tra theo id
router.post('/updatequizz', updatequizzbyid)
export default router;