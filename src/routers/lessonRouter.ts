import { Router } from "express";
import uploadFileLesson from "../middlewares/uploadfileLesson"
import {createLesson, getALLlessonsIDCourses, getLessonById, updateLessonById} from "../controllers/lessonController"
//lesson
const router = Router();
// Tạo khóa học
router.post('/create', createLesson)

//Lấy danh sách bài giảng từ id khóa học
router.get('/getlesson/:courseid', getALLlessonsIDCourses);


//lấy danh sách id bài giảng để cập nhật
router.post('/getlessonbyid', getLessonById)

//lấy danh sách id bài giảng
router.post('/updatelessonbyid', updateLessonById);

export default router;