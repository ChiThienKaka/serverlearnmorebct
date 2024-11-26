import { Request, Response } from "express";
import {LessonChild, Lesson} from "../models/indextModel"
import path from "path";
const createLessonChild = async (req: Request, res: Response)=>{
    const {lessonid, title ,videourl, type} = req.body;
    try{
        if(req.body.files){
            // const file = req.files as { [fieldname: string]:  }; // Ép kiểu cho req.files
            const file = req.body.files;
            const filevideos = file['filevideo'] ? file['filevideo'].join(',') : '';//check xem có tồn tại không tránh lỗi
            const images =file['image'] ? file['image'].join(', ') : '';
            const tailieu =file['tailieu'] ? file['tailieu'].join(', ') : '';
            // Đẩy lên database 
            const newLessonchild = await LessonChild.create({
                title, lessonid,
                videourl,
                filevideo: filevideos,
                tailieu: tailieu,
                thumbnail: images,
                type
            });

            return res.status(200).json(newLessonchild);
        }
    }catch(err){res.status(500).json({err: err});}
}

//Lấy toàn bộ nội dung của các bài giảng con lessonchild theo id khóa học
const getLessonChildbyidcourse = async (req: Request, res: Response) => {
    const {idcourse} = req.params;
   try{
    const lesson = (await Lesson.findAll({where: {courseid: idcourse}})).map(item=>item.toJSON());
    const lessonchild = await Promise.all(
        lesson.map(async(item)=>{
            const dataLessonsChild = await LessonChild.findAll({where:{lessonid: item.lessonid}});
            return dataLessonsChild;
        })
    )
    const array = lessonchild.flat(); // làm phẳng mảng
    res.status(200).json(array);
   }catch(err){res.status(500).json(err);}
}

//lấy thumbail của nội dung video lesonchild
const getImageByLessonChildID = async (req: Request, res: Response) => {
    res.set('cross-origin-resource-policy', 'cross-origin');//cho phép từ các nguồn khác
    const {filename, lessonid} = req.params;
    const filepath = path.join(__dirname, '../../storage/lessonchild',lessonid,'image',filename);
    res.sendFile(filepath,(err)=>{
        if(err){
            console.error('Error sending file:', err);
            return res.status(404).send('File not found');
        }
    })
}
//lấy video từ bài giảng con về
const getVideoByLessonChildID = async (req: Request, res: Response) => {
    res.set('cross-origin-resource-policy', 'cross-origin');//cho phép từ các nguồn khác
    const {filename, lessonid} = req.params;
    const filepath = path.join(__dirname, '../../storage/lessonchild',lessonid,'video',filename);
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
// lấy tài liệu khóa học từ lessonchild
const getTailieuByLessonchild = async (req:Request, res:Response)=>{
    res.set('cross-origin-resource-policy', 'cross-origin');//cho phép từ các nguồn khác
    const {filename, lessonid} = req.params;
    const filepath = path.join(__dirname, '../../storage/lessonchild',lessonid,'tailieu',filename);
    res.sendFile(filepath,(err)=>{
        if(err){
            console.error('Error sending file:', err);
            return res.status(404).send('File not found');
        }
    })
}
export {createLessonChild, getLessonChildbyidcourse, getImageByLessonChildID, getVideoByLessonChildID, getTailieuByLessonchild};