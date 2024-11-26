import { Request, Response} from "express"

import {Question, Quizzes} from '../models/indextModel'
 
// Tạo danh sách các câu hỏi
const createQuestion = async (req: Request, res: Response)=>{
    const {idquizz, question_text, question_type, mark, correct, choice1, choice2, choice3, choice4} = req.body;
    try {
        const newQuestion = await Question.create({
            idquizz,
            question_text,
            question_type,
            mark,
            correct,
            choice1,
            choice2,
            choice3,
            choice4
        });
        res.status(201).json(newQuestion);
    }catch(err){console.log(err);res.status(500).json(err);}
}

//lấy danh sách các question dựa vào mã id quizz
const getQuestionbyIdQuizz = async (req:Request, res:Response) => {
    const {idquizz} = req.params;
    try {
        const dataQuestions = await Question.findAll({where: {idquizz}});
        if(dataQuestions) {
            return res.status(200).json(dataQuestions);
        }
        res.status(404).json({message: 'Question not found'});
    }catch(err){res.status(500).json(err);}
}

//lấy tất cả danh sách câu hỏi có trong khóa học
const getAllQuestionsbyidCourse = async (req: Request, res:Response)=>{
    const {idcourse} = req.params;
    try{
        const quizz = (await Quizzes.findAll({where: {courseid: idcourse}})).map(item=>item.toJSON());
        const  question = await Promise.all( 
            quizz.map(async(item)=>{
                const dataQuestions = await Question.findAll({where: {idquizz: item.id}});
                return dataQuestions;
            })
        )
        const array = question.flat();//làm phẳng mảng 
        res.status(200).json(array);
    }catch(err){console.log(err);res.status(500).json(err)}
}

export {createQuestion, getQuestionbyIdQuizz, getAllQuestionsbyidCourse} ;