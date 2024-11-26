import { Request, Response } from "express";
import {UserProcessQuizz, Question, Quizzes} from '../models/indextModel'


const create = async (req: Request, res: Response) => {
    const {idquizz, idenrollment,answers} = req.body;
    const quizz = await Quizzes.findOne({where: {id: idquizz}});
    const question = (await Question.findAll({where:{idquizz: idquizz}})).map(item=>item.toJSON());//lấy toàn bộ câu hỏi dựa trên idquizz
    // chấm bài
    try {
        let tongdiem: number = 0; //tổng điểm
        let macaudung: string[] = [];
        let ispass : boolean = false;
        //Lấy ra mã câu hỏi
        if(typeof answers === 'object' && answers!==null){
            Object.entries(answers).forEach(([key, value])=>{
                const cauhoi = question.find(item=> item.id === Number(key));
                const dapan:string = String(value);
                if(cauhoi) {
                    if(cauhoi.correct.toLowerCase() === dapan.toLowerCase()){
                        macaudung.push(key);
                        tongdiem += cauhoi.mark;
                    }
                }
            })
        }
        //kiểm tra xem đậu không
       if(quizz?.passing_marks){
          ispass = tongdiem >= quizz.passing_marks
       }
        //tạo lưu lịch sử làm bài
        const newuserprocessquizz = await UserProcessQuizz.create({
            idquizz,
            idenrollment,
            score: tongdiem,
            ispass,
            questioncorrect: macaudung.join(',')
        })
        res.status(200).json(newuserprocessquizz)
    }catch(err) {
        res.status(500).json({err: err});
    }
}

const getUserProcessQuizzbyIdEnrollment = async(req:Request, res:Response) => {
    //lấy ra tất cả lịch sử làm bài của 1 học viên dựa trên idenrollment và mà id quizz Bài kiểm tra
    const {idenrollment, idquizz} = req.params;
    try{
        const userProcessQuizz = (await UserProcessQuizz.findAll({where: {idenrollment, idquizz}, limit:5, order:[['id','DESC']]})).map(item=>item.toJSON());
        if(userProcessQuizz.length!==0){
            //đảm bảo cần key cho data của table trong antdesign
            //Lấy idquizz từ bảng userProcessQuizz hiện tại
            const idquizz = userProcessQuizz[0].idquizz;
            //Từ id này tìm ra điểm tổng của kết của bài kiểm tra này
            const scorequizz = await Quizzes.findOne({where: {id: idquizz}});
            const tabledata = userProcessQuizz.map(item=>{return {...item, key: item.id, scorequizz: scorequizz?.total_marks}})
            res.status(200).json(tabledata);
            return;
        }
        //khi không có lịch sử làm bài 
        res.status(200).json([])
    }catch(err){
        res.status(500).json({error: err});
    }
}

export  {create, getUserProcessQuizzbyIdEnrollment}