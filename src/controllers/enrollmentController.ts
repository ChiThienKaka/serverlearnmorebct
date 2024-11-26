import { Request, Response } from "express";
import {Courses, Enrollments, Lesson, LessonChild, Quizzes, User, UserProcessLesson, UserProcessQuizz} from "../models/indextModel"

const createEnrollment = async (req:Request, res:Response) => {
    const {userid, courseid, totalquizzes} = req.body;
    try{
        // Kiểm tra đã người dùng này đã đăng ký khóa học này chưa
        const checkEnrollment = await Enrollments.findOne({where: {userid, courseid}});
        if(checkEnrollment){
            res.status(200).json(checkEnrollment);
            return;
        }
        // Tạo đăng ký mới
        const newEnrollment = await Enrollments.create({userid, courseid,totalquizzes});
        //Tạo ra sẵn lessonprocessuser để lưu lại khóa học mặc định
       const lesson = (await Lesson.findAll({where:{courseid: courseid}})).map(item=>item.toJSON());
       //Lấy số lượng bài giảng con
        const lessonchild = await Promise.all(
            lesson.map(async(item)=>{
                return (await LessonChild.findAll({where: {lessonid: item.lessonid}})).map(item=>item.toJSON());
            })
        )
        const lessonchildflat = lessonchild.flat();
        await Promise.all(
            lessonchildflat.map( async(item)=>{
                await UserProcessLesson.create({
                    idenrollment: newEnrollment.id,
                    idlessonchild: item.id
                })
            })
        )
        res.status(201).json(newEnrollment);
    }catch(err){
        res.status(500).json({error: err});
    }
}

//Kiểm tra người dùng này đã đăng ký khóa học này chưa
const checkEnrollment = async (req: Request, res: Response) => {
    const {userid, courseid} = req.body;
   try{
    const check = await Enrollments.findOne({where: {userid, courseid}});
    res.status(200).json(check);
   }catch(err){res.status(500).json({error: err});}
}
//quản lý khóa học cho giảng viên lấy toàn bộ enrollment khi có id course
const getEnrollmentbyidCourse = async (req: Request, res: Response) => {
    const {courseid} = req.params;
    try{
        const enrollment = (await Enrollments.findAll({where: {courseid: courseid}})).map(item=>item.toJSON());
        const enrollmentanduser = await Promise.all(
            enrollment.map(async(item)=>{
                const dataUser = await User.findOne({where: {id: item.userid}});
                //tính điểm trung bình của khóa học
                const mark = await UserProcessQuizz.findAll({where:{idenrollment: item.id, ispass:true}});
                const totalmark:any = mark.length!==0 ? (mark.reduce((tongdiem, arrcurrent:any)=>{
                    return tongdiem + arrcurrent.score;
                },0) / mark.length ).toFixed(2) : 'chưa có';
                return {...item, user: dataUser, key: item.id, diemtb: totalmark};
            })
        )
        res.status(200).json(enrollmentanduser);
    }catch(err){res.status(500).json({error: err})}
}

//lấy tiến trình của enrollment theo user 
const getProcessEnrollmentById = async (req: Request, res: Response) => {
    const {idenrollment} = req.params;
    try{
        // lấy bảng ghi danh 
        const enrollment = await Enrollments.findOne({where: {id: idenrollment}});
        if(enrollment){
            //Lấy tiến trình của từng bài học dựa vào id enrollment của từng học viên
            const tientrinhlesson = await UserProcessLesson.findAll({where: {idenrollment: enrollment.id,status: true}});
            //Lấy bài kiểm tra trong khóa học
            const quizz = (await Quizzes.findAll({where: {courseid: enrollment.courseid}})).map(item=>item.toJSON());
            //Lấy tiến trình bài kiểm tra hiện tại
            const tientrinhquizz = await Promise.all(
                quizz.map(async(item)=>{
                    return UserProcessQuizz.findOne({where: {idquizz: item.id, idenrollment: enrollment.id, ispass: true}});
                })
            );
            const tientrinhquizzlength = tientrinhquizz.filter(item=>item!==null);
            //Tính tổng bài hoàn thành
            const tongbaihoanthanh = tientrinhlesson.length + tientrinhquizzlength.length;
            //update lại tiến trình của học sinh này 
            await enrollment.update(
                {process: tongbaihoanthanh}
            )
            const processgiaodien = (Number(tongbaihoanthanh) / Number(enrollment.totalquizzes)) * 100;
            res.status(200).json({process: Math.floor(processgiaodien), tongbaihoanthanh})
            return;
        }
        //nếu sai thì trả về là 0%
        res.status(200).json(0);

    }catch(err){res.status(500).json({err: err})}
}
export {createEnrollment, checkEnrollment, getEnrollmentbyidCourse, getProcessEnrollmentById};