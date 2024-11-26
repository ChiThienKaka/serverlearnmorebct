import { Request, Response } from "express";
import {Enrollments, Quizzes, UserProcessLesson, UserProcessQuizz} from "../models/indextModel"
//const update process lesson
const updatebyidenrollment = async (req: Request, res: Response)=>{
    const {idenrollment, idlessonchild} = req.body;
    try{
        const tientrinhbaigiang = await UserProcessLesson.findOne({where: {idenrollment, idlessonchild}});
        if(tientrinhbaigiang){
            tientrinhbaigiang.update({
                status: true
            })
            res.status(200).json(tientrinhbaigiang);
            return;
        }
        res.status(404).json({message: "Not found"})
    }catch(err){
        res.status(400).json({error: err})
    }
}
//Đánh dấu bài giảng nào đã được học rồi
const getDanhDauBaigiangDahoc = async(req: Request, res: Response) => {
    const {idenrollment} = req.params;
    try{
        const enrollment = await Enrollments.findOne({where: {id: idenrollment}});
        if(enrollment){
            //lấy những bài giảng trong của người dùng này
            const userprocesslesson = (await UserProcessLesson.findAll({where: {idenrollment, status: true}})).map(item=>{
                return {id: item.idlessonchild, type: 'lessonchild'}
            });
            //lấy toàn bộ bài kiểm tra của khóa học này
            const quizz = (await Quizzes.findAll({where: {courseid: enrollment.courseid}})).map(item=>item.toJSON());
            //chỉ lấy những bài kiểm tra đậu
            const userprocessquizz = await Promise.all(
                quizz.map(async(item)=>{
                    return await UserProcessQuizz.findOne({where: {idenrollment, idquizz: item.id, ispass: true}})
                })
            )
            const userprocessquizzNull = userprocessquizz.map((item)=>{
                if(item!==null){
                    return {id: item.idquizz, type: 'quizz'}
                }
                return null;
            }).filter(item=>item!==null)
            //gộp lại lấy kết quả
            const result = [...userprocesslesson, ...userprocessquizzNull];
            res.status(200).json(result);
            return;

        }
        res.status(404).json({message: "Not found"});
    }catch(err){res.status(500).json({error: err})}
}


export {updatebyidenrollment, getDanhDauBaigiangDahoc};