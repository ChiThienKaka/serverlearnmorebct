import { Router } from "express";
import {createLessonChild, getLessonChildbyidcourse, getImageByLessonChildID, getVideoByLessonChildID, getTailieuByLessonchild} from '../controllers/lessonchildController'
import { uploadFileLessonChild } from "../middlewares/index";
const router = Router();

//Tạo một bài giảng con mới được phân loại
router.post('/create', uploadFileLessonChild.fields([
    { name:'filevideo', maxCount: 1},
    { name: 'image', maxCount: 1},
    { name: 'tailieu', maxCount: 1},
]), createLessonChild)

//Lấy toàn bộ bài giảng con trong  khóa học
router.get('/lessonchildallcourse/:idcourse', getLessonChildbyidcourse);

//lấy hình ảnh của khóa học con video đã đăng
router.get('/getimage/:lessonid/:filename', getImageByLessonChildID)

//Lấy video bài giảng từ lessonchildid
router.get('/getvideo/:lessonid/:filename',getVideoByLessonChildID);

//Lấy tài liệu bài giảng từ của lessonchildid
router.get('/gettailieu/:lessonid/:filename', getTailieuByLessonchild);

export default router;


