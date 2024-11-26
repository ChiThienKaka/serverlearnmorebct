import { Router } from "express";
import {create,getbycourseid, gethinhanhreviews} from "../controllers/reviewsController"
import {uploadfilehinhanhdanhgia} from "../middlewares/uploadfile"

const router = Router();
//tạo một đánh giá mới

router.post('/create',uploadfilehinhanhdanhgia.single('hinhanh'),create);

//lấy tất cả đánh giá của khóa học
router.post('/getbycourseid', getbycourseid);

//lấy hình ảnh đánh giá
router.get('/getimage/:idenrollment/:filename', gethinhanhreviews)

export default router;