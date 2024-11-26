import { Router } from "express";

import {checkUserStatusGV, dangkyGiangvien, dangkyNguoiDung, dangnhap, updateStatusGV, updateuserNguoidung, 
    getAvatarnguoidung, updateuseruserdetailsGV, getInfoGV, thongkehocvien
} from "../controllers/userController";
import { uploadFile, authenticateToken, uploadfilehinhdaidiennguoidung, uploadfileInfoGV} from "../middlewares/index";

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

//update user người dùng
router.post('/updateusernd',uploadfilehinhdaidiennguoidung.single('image'), updateuserNguoidung)

//lấy avatar người dùng
router.get('/getavatarnd/:userid/:filename', getAvatarnguoidung)

//cập nhật thông tin cá nhân của giảng viên
router.post('/updateinfogv',uploadfileInfoGV.array('image', 1), updateuseruserdetailsGV);

//Lấy toàn bộ thông tin của giảng viên
router.post('/getinfoGV', getInfoGV)

//thống kê học viên tham gia vào trang web
router.post('/thongkehocvien', thongkehocvien)

export default router;