import 'dotenv/config'
import express, { NextFunction, Request, Response} from 'express'
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { Server } from 'socket.io';//12:36 28/10/2024
import http from 'http';//12:36 28/10/2024
import { userRouter, adminRouter, categoriRouter, courseRouter, lessonRouter, quizzRouter, questionRouter, lessonchildRouter, enrollmentRouter, usercoursecurrentRouter,
    userprocessquizzRouter, userprocesslessonRouter, chatcourseuserRouter, momoRouter, paymentRouter, paymentgiangvienRouter,
    reviewsRouter
 } from './routers/indexRouter';
import {User, UserDetails, Courses, Lesson, Categories, CategoriesChild, Question, Quizzes, LessonChild, Enrollments, UserCourseCurrent, UserProcessQuizz,
    UserProcessLesson, ChatCourseUser, Payment, PaymentGiangVien, Reviews
} from './models/indextModel';
const app = express();

app.use(express.json());//cấu hình dịch request json từ client hoặc body-parser

// Cấu hình các middeware bảo mật cơ bản 
app.use(hpp()); //bảo vệ khỏi các cuộc tấn công http
app.use(helmet()); //Bảo mật HTTP Headers
app.use(morgan("combined")); //Log các request HTTP gửi đến server
// app.use(cors()) //yêu cầu từ các nguồn khác nhau
// Sử dụng middleware CORS
app.use(cors({
    origin: '*', // Tạm thời cho phép tất cả origin để kiểm tra
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    // credentials: true
}));

app.use(express.urlencoded({extended: true}));

//Đồng bộ Model lên CSDL
User.sync();
UserDetails.sync();
Categories.sync();
Lesson.sync();
Courses.sync();
CategoriesChild.sync();
Quizzes.sync();
Question.sync();
LessonChild.sync();
Enrollments.sync();
UserCourseCurrent.sync();
UserProcessQuizz.sync();
UserProcessLesson.sync();
ChatCourseUser.sync();
Payment.sync();
PaymentGiangVien.sync();
Reviews.sync();

//cấu hình các router cần thiết
app.use('/auth', userRouter)

//cấu hình router admin
app.use('/admin', adminRouter)

//cấu hình router categories
app.use('/categori', categoriRouter)

//cấu hình router course

app.use('/course', courseRouter)

//cấu hình router Lesson
app.use('/lesson', lessonRouter)

//Cấu hình router bài kiểm tra
app.use('/quizz', quizzRouter)


//cấu hình router question
app.use('/question', questionRouter)

//cấu hình tạo router lesson child
app.use('/lessonchild', lessonchildRouter)

//cấu hình tạo router enrollment
app.use('/enrollment', enrollmentRouter)

//cấu hình tạo router người dùng và bài học hiện tại
app.use('/usercoursecurrent', usercoursecurrentRouter)

//cấu hình tạo lưu câu hỏi
app.use('/userprocessquizz', userprocessquizzRouter)

//cấu hình tạo lưu bài học
app.use('/userprocesslesson', userprocesslessonRouter)

//cấu hình lưu đoạn chat cho từng bài giảng
app.use('/chatcourseuser', chatcourseuserRouter)

//Thanh toán momo
app.use('/momo', momoRouter)

//Tạo bảng thanh toán
app.use('/payment', paymentRouter)

//Tạo bảng thanh toán cho giảng viên
app.use('/paymentgiangvien', paymentgiangvienRouter)

//Tạo bảng cho đánh giá
app.use('/reviews', reviewsRouter)

app.get('/api', (req:Request, res:Response, next:NextFunction) => {
    return res.send(path.join(__dirname, '../upload','/hihi'))})

export default app;