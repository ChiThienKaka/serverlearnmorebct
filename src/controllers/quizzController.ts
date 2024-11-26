import { Request, Response} from "express"
import {Quizzes} from '../models/indextModel'
//Tạo bài kiểm tra
const CreateQuizz = async (req: Request, res: Response) => {
    const {courseid, title, description, total_marks, passing_marks} = req.body;
    try {
        await Quizzes.create( {
            courseid,
            title,
            description,
            total_marks,
            passing_marks,
        });
        res.status(201).json({message: "Tạo bài kiểm tra thành công"});
    }catch (err) {console.log(err); res.status(500).json(err)}
}

const getQuizzbyCourseID = async (req: Request, res: Response) => {
    const {courseid} = req.params;
    const quizz = await Quizzes.findAll({where: {courseid: courseid}});
    if(quizz) {
        return res.status(200).json(quizz);
    }
    res.status(400).json('Không tìm thấy')
}

//lấy quizz theo id
const getidquizz = async (req: Request, res: Response) => {
    const {idquizz} = req.body;
    try{
        const quizz = await Quizzes.findOne({where: {id: idquizz}});
        if(quizz){
            return res.status(200).json(quizz);
        }
        res.status(404).json({message: "Not found"});
    }catch(err){
        res.status(500).json({err: err});
    }
}
const updatequizzbyid = async (req: Request, res: Response) => {
    const {idquizz,title, description, total_marks, passing_marks, order} = req.body;
    try{
        const quizz = await Quizzes.findOne({where: {id:idquizz}});
        if(quizz){
            await quizz.update({
                title,
                description,
                total_marks,
                passing_marks,
                order
            });
            return res.status(200).json(quizz);
        }
        return res.status(404).json('404 not found quizz');
    }catch(err){
        res.status(500).json({err: err});
    }
}
export {CreateQuizz, getQuizzbyCourseID, getidquizz, updatequizzbyid}