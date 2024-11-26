import { Router } from "express";
import {createUserCourseCurrent, updateUserCourseCurrent, getusercoursecurrent} from "../controllers/usercoursecurrentController";
const router = Router();

//lấy bài học và sinh viên hiện tại
router.post('/create', createUserCourseCurrent);

//cập nhật lại bài học của sinh viên hiện tại
router.put('/update', updateUserCourseCurrent)

//lấy ra bài học hiện tại theo mã courseid và userid
router.get('/get/:idenrollment',getusercoursecurrent)


export default router;