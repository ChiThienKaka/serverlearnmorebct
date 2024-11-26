import { Router } from "express";
import {updatebyidenrollment, getDanhDauBaigiangDahoc} from "../controllers/userprocesslessonController"
const router = Router();
//chỉnh sửa lại bài học trạng thái theo tiến trình 
router.post('/update', updatebyidenrollment);
//lấy trạng thái bài học
router.get('/getbaidahoc/:idenrollment',getDanhDauBaigiangDahoc);
export default router;