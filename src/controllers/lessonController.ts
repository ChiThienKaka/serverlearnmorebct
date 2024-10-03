import { Request, Response } from "express";
import {Lesson} from "../models/indextModel"
import path from "path";

// Tạo danh sách khóa học
const createLesson = async (req: Request, res:Response) => {
    const {courseid, title, content, videourl,lessonid} = req.body;
    try{
        if(req.body.files){
            // const file = req.files as { [fieldname: string]:  }; // Ép kiểu cho req.files
            const file = req.body.files;
            const filevideos = file['filevideo'] ? file['filevideo'].join(',') : '';//check xem có tồn tại không tránh lỗi
            const images = file['image'].join(', ');
            const tailieu = file['tailieu'].join(', ');
            // Đẩy lên database 
            const newLesson = await Lesson.create({
                courseid, title, lessonid,
                content, videourl,
                filevideo: filevideos,
                tailieu: tailieu,
                image: images
            });

            return res.status(200).json(newLesson);
        }
        res.status(200).json({courseid, title, content, videourl})
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

// lấy tài liệu khóa học từ lesson
const getTailieuByLessonID = async (req:Request, res:Response)=>{
    res.set('cross-origin-resource-policy', 'cross-origin');//cho phép từ các nguồn khác
    const {filename, lessonid} = req.params;
    const filepath = path.join(__dirname, '../../storage/lesson',lessonid,'tailieu',filename);
    res.sendFile(filepath,(err)=>{
        if(err){
            console.error('Error sending file:', err);
            return res.status(404).send('File not found');
        }
    })
}

//lấy video từ bài giảng về
const getVideoByLessonID = async (req: Request, res: Response) => {
    res.set('cross-origin-resource-policy', 'cross-origin');//cho phép từ các nguồn khác
    const {filename, lessonid} = req.params;
    const filepath = path.join(__dirname, '../../storage/lesson',lessonid,'video',filename);
    res.sendFile(filepath,(err)=>{
        // if(err){
        //     console.error('Error sending file:', err);
        //     return res.status(404).send('File not found');
        // }
        // Log lỗi, nhưng không cố gắng gửi thêm phản hồi
        if (err) {
            console.error('Error sending file:', err);
        }
    })
}
//Lấy image của bài giảng
const getImageByLessonID = async (req: Request, res: Response) => {
    res.set('cross-origin-resource-policy', 'cross-origin');//cho phép từ các nguồn khác
    const {filename, lessonid} = req.params;
    const filepath = path.join(__dirname, '../../storage/lesson',lessonid,'image',filename);
    res.sendFile(filepath,(err)=>{
        if(err){
            console.error('Error sending file:', err);
            return res.status(404).send('File not found');
        }
    })
}

export {createLesson, getALLlessonsIDCourses, getTailieuByLessonID, getVideoByLessonID, getImageByLessonID};