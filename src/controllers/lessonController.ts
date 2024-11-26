import { Request, Response } from "express";
import {Lesson} from "../models/indextModel"
import path from "path";

// Tạo danh sách khóa học
const createLesson = async (req: Request, res:Response) => {
    const {courseid, title, content,lessonid} = req.body;
    try{
       // Đẩy lên database 
       const newLesson = await Lesson.create({
            courseid, title, lessonid,
            content,
        });
        res.status(200).json(newLesson);
    }catch(err){res.status(500).json({err: err});}
}


// lấy danh sách bài giảng từ ID khóa học
const getALLlessonsIDCourses = async (req:Request, res:Response) => {
    const {courseid} = req.params;
    try{
        //truyền thêm key để sử dụng với table ant desgin
        const dataLessons = (await Lesson.findAll({where: {courseid}})).map(item=>item.toJSON());
        const dataLessonsKey = dataLessons.map((item)=>{
            return {...item, key: item.id};
        })
        if(dataLessons) {
            return res.status(200).json(dataLessonsKey);
        }
    }catch(err){res.status(500).json({err: err});}
}
//lấy id bài giảng lesson
const getLessonById = async (req: Request, res: Response) => {
    const {lessonid} = req.body;
    try{
        const lesson = await Lesson.findOne({where: {lessonid: lessonid}});
        if(lesson){
            return res.status(200).json(lesson);
        }
        return res.status(404).json({message: 'Lesson not found'});
    }catch(err){
        res.status(500).json({err: err});
    }
}
const updateLessonById = async (req: Request, res: Response) => {
    const {lessonid, title, content, order, trylearn} = req.body;
    try{
        const lesson = await Lesson.findOne({where: {lessonid: lessonid}});
        if(lesson){
            await lesson.update({
                title, content, order, trylearn
            });
            return res.status(200).json(lesson);
        }
        return res.status(404).json({message: 'Lesson not found'});
    }catch(err){
        res.status(500).json({err: err});
    }
}

export {createLesson, getALLlessonsIDCourses, getLessonById, updateLessonById};