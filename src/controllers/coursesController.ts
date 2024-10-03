import { Request, Response } from "express";
import Courses from '../models/CoursesModel'
import path from "path";
import User from "../models/UserModel";
import Lesson from "../models/LessonModel";
// tạo khóa học 
const createCourses = async (req: Request, res: Response) => {
    const {title, idgv, iddanhmuc, price, filename, description} = req.body;
    try {
        const newCourse = await Courses.create({
            title,
            idGV: idgv,
            description,
            idDanhmuc:iddanhmuc,
            price,
            thumbnail:filename,
        });
        res.status(201).json(newCourse);
    }catch(err){
        console.log(err);
        res.status(400).json({message: err});
    }
}
// lấy toàn bộ khóa học dựa vào id giảng viên
const getAllCourse = async (req: Request, res:Response) => {
    const {idgv} = req.params;
    const dataCourses = (await Courses.findAll({where:{idGV:idgv}})).map(item=> item.toJSON());
    if(dataCourses) {
        return res.status(200).json(dataCourses);
    }
    res.status(404).json({message: 'Course not found'});
}


//lấy thumnbail khóa học
const getthumbailCourse = (req: Request, res:Response) => {
    res.set('cross-origin-resource-policy', 'cross-origin');//cho phép từ các nguồn khác
    const {idgv, thumbail} = req.params;
    const filepath = path.join(__dirname, '../../storage/courses/thumbail',idgv,thumbail);
    res.sendFile(filepath,(err)=>{
        if(err){
            console.error('Error sending file:', err);
            return res.status(404).send('File not found');
        }
    })
}

// cập nhật status của Khóa học thông qua admin
const updateCoursebyIdCouses = async (req: Request, res:Response)=>{
    const {id} = req.params;
    const {status} = req.body;
    try{
        await Courses.update({status: status}, {where: {id: id}});
        res.status(200).json({message: "Cập nhật thành công"})
    }catch(err) {res.status(400).json({error: err})}
}

//Lấy toàn bộ khóa học giảng viên đăng và đã được duyệt
const getAllCourseByStatus = async (req: Request, res: Response)=>{
    try{
        const course = (await Courses.findAll({where: {status: true}})).map(item=>item.toJSON());
        const userGiangvien = (await User.findAll({where: {role: 'giangvien'}})).map(item=>item.toJSON());
        const courseGiangvien = course.map((item)=>{
            return {...item, giangVien: userGiangvien.find(itemG=>itemG.id === item.idGV)};
        })
        res.status(200).json(courseGiangvien);
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error'});
    }
    
}

//Lấy thông tin của khóa học đã duyệt và giảng viên chi tiết của các khóa học con
const getALLCourseByIdgetLessonandGV = async (req:Request, res:Response) => {
    const {idcourse, idGV} = req.params;
    try{
       const course = await Courses.findOne({where: {id: idcourse}})
       const lesson = await Lesson.findAll({where:{courseid: idcourse}});
       const lenthlesson = lesson.length;//lấy số lượng bài giảng
       const userGiangvien = await User.findOne({where: {id: idGV}});
       res.status(200).json({lesson: lesson, giangVien: userGiangvien, course: course, tongbaigiang: lenthlesson});
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error'});
    }
    
 
}

export  {createCourses, getAllCourse, getthumbailCourse, updateCoursebyIdCouses, getAllCourseByStatus, getALLCourseByIdgetLessonandGV};