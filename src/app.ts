import 'dotenv/config'
import express, { NextFunction, Request, Response} from 'express'
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
import { userRouter, adminRouter, categoriRouter, courseRouter, lessonRouter } from './routers/indexRouter';
import {User, UserDetails, Courses, Lesson, Categories, CategoriesChild} from './models/indextModel';
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



//Đồng bộ Model lên CSDL
User.sync();
UserDetails.sync();
Categories.sync();
Lesson.sync();
Courses.sync();
CategoriesChild.sync();
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

app.get('/api', (req:Request, res:Response, next:NextFunction) => {
    return res.send(path.join(__dirname, '../upload','/hihi'))})

export default app;