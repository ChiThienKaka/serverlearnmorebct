import { Router } from "express";

import {checkUserStatusGV, dangkyGiangvien, dangkyNguoiDung, dangnhap, updateStatusGV} from "../controllers/userController";
import { uploadFile, authenticateToken, } from "../middlewares/index";

const router = Router();
//post đăng ký nhận vào FormData
router.post('/register',uploadFile.array('files',10),dangkyGiangvien);

//post đăng ký người dùng nhận vào Json
router.post('/registernd',dangkyNguoiDung);

//đăng nhập
router.post('/login',dangnhap);

//Check user GV Status
router.post('/status', checkUserStatusGV)

//update status của bảng giảng viên
router.put('/status/:id', updateStatusGV)

export default router;