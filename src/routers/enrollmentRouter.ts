import { Router } from "express";
import {createEnrollment, checkEnrollment, getEnrollmentbyidCourse, getProcessEnrollmentById} from "../controllers/enrollmentController";

const router = Router();
//Tạo một bảng đăng ký mới 
router.post('/create', createEnrollment)
//kiểm tra sinh viên đã đăng ký khóa học này chưa
router.post('/checkEnrollment', checkEnrollment);
//Quản ký khóa học cho giảng viên xem danh sách sinh viên
router.get('/enrollmentbyidcourse/:courseid', getEnrollmentbyidCourse);
//lấy tiến trình của từng học viên theo id enrollment
router.get('/getenrollmentprocessbyid/:idenrollment', getProcessEnrollmentById)
export default router;;