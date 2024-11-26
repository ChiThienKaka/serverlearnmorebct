import { Router } from "express";
import {createCourses, getAllCourse, getthumbailCourse, updateCoursebyIdCouses, getAllCourseByStatus, getALLCourseByIdgetLessonandGV,
    getALLLessonandQuizzbyIdcousechild, getAllCourseByStatusNoibat, getAllCourseByStatusNewhot, getAllCourseByStatusIfquery
} from "../controllers/coursesController"
import {uplaodFileThumbailCourses, uploadFile} from "../middlewares/index"
const router = Router();

// đưa dữ liệu lên 
router.post('/create',uplaodFileThumbailCourses.single('thumbail'), createCourses);

// lấy nội dung toàn bộ khóa học dựa vào id giảng viên
router.get('/getcourses/:idgv',getAllCourse);

// lấy thumbail khóa học dựa vào id và tên file ảnh
router.get('/thumbail/:idgv/:thumbail', getthumbailCourse)//course

//Cập nhật status của khóa học thông qua id khóa học
router.put('/updatecourse/:id', updateCoursebyIdCouses);

//Lấy thông tin toàn bộ khóa học được duyệt thành công status true
router.get('/getcoursestatus', getAllCourseByStatus);

//Lấy thông tin khóa học và tất cả bài giảng và giảng viên cho người dùng xem
router.get('/getinfolessongvforcourse/:idcourse/:idGV', getALLCourseByIdgetLessonandGV);

//lấy danh sách toàn bộ bài giảng câu hỏi cho người dùng
router.get('/getcoursealllessonquizzhocvien/:idcourse', getALLLessonandQuizzbyIdcousechild);

//lấy danh sách khóa học nổi bật tổi đa là 6 cái
router.get('/getcoursenoibat', getAllCourseByStatusNoibat)

//lấy danh sách khóa học mới nhất
router.get('/getcoursenewhot', getAllCourseByStatusNewhot)

//lọc dữ liệu điệu kiện lĩnh vực và giá
router.post('/coursedanhmucprice', getAllCourseByStatusIfquery)

export default router;