import { Router } from "express";
import {duyetgiangvien, getavatar, getChungchivanbang,getChungchicuthe, getALLCourseAndGiangVien} from "../controllers/adminController";

const router = Router();
//admin
router.get('/duyetGV', duyetgiangvien )
// router.get('/images',getavatar) lấy avatar của giảng viên
router.get('/images/:email',getavatar)
//lấy chứng chỉ văn bằng
router.get('/documents/:email', getChungchivanbang)
//lấy cụ thể chứng chỉ văn bằng
router.get('/documents/:email/:namefile', getChungchicuthe)
//Lấy danh sách các khóa học và giảng viên cho admin duyệt
router.get('/duyetCouseGV', getALLCourseAndGiangVien)

export default router;