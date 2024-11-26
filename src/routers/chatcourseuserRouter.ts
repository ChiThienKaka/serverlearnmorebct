import { Router } from "express";
import {create, getchatcourseuserbyidenrollment} from "../controllers/chatcourseuserController";
import {uploadfilehinhChatCourseUser} from "../middlewares/uploadfile"
const router = Router();
//tạo ra một chat mới theo idenrollment của khóa học xác định
router.post('/create', uploadfilehinhChatCourseUser.single('hinhanh'), create);
//lấy toàn bộ đoạn chat của người dùng đã đăng ký khóa học này
router.get('/get/:idenrollment', getchatcourseuserbyidenrollment)
export default router;