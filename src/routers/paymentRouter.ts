import { Router } from "express";
import {create, updatepaymentThanhtoan, checkpaymentThanhtoan, getPaymentTheoThang, getPaymentTheoThangGiangvien} from "../controllers/paymentController"
const router = Router();
// Tạo bảng payment mới 
router.post('/create', create);
//Kiểm tra user và khóa học này đã được thanh toán chưa, nếu rồi mới cho tạo enrollment update lại bảng thanh toán
router.post('/checkpaymentupdate', updatepaymentThanhtoan);
//kiểm tra người này đã thanh toán chưa
router.post('/checkpayment', checkpaymentThanhtoan)

//lấy các mã thanh toán theo tháng
router.post('/paymenttheothang', getPaymentTheoThang)

//lấy các mã giảng viên theo tháng
router.post('/paymentgv', getPaymentTheoThangGiangvien)

export default router;