import { Router } from "express";
import uploadFileLesson from "../middlewares/uploadfileLesson"
import {createLesson, getALLlessonsIDCourses, getTailieuByLessonID, getVideoByLessonID,getImageByLessonID} from "../controllers/lessonController"
//lesson
const router = Router();
// Tạo khóa học
router.post('/create', uploadFileLesson.fields([
    { name:'filevideo', maxCount: 1},
    { name: 'image', maxCount: 1},
    { name: 'tailieu', maxCount: 10},
]), createLesson)

//Lấy danh sách bài giảng từ id khóa học
router.get('/getlesson/:courseid', getALLlessonsIDCourses);

//Lấy tài liệu bài giảng từ của lessonid
router.get('/gettailieu/:lessonid/:filename', getTailieuByLessonID);

//Lấy video bài giảng từ lessonid
router.get('/getvideo/:lessonid/:filename', getVideoByLessonID);

//lấy hình ảnh của bài giảng
router.get('/getimage/:lessonid/:filename', getImageByLessonID)

export default router;