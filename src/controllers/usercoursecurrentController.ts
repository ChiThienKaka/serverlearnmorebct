import { Request, Response } from "express";
import {UserCourseCurrent} from "../models/indextModel"

const createUserCourseCurrent = async (req:Request, res:Response) => {
    const {lessonid, lessonchildid, idenrollment} = req.body;
    try{
        // kiểm tra nếu tồn tại rồi không tạo tạo nữa 
        const checkUserCourseCurrent = await UserCourseCurrent.findOne({where: {idenrollment: idenrollment}});
        if(checkUserCourseCurrent){
            res.status(201).json(checkUserCourseCurrent);
            return;
        }
        const newUserCourseCurrent = UserCourseCurrent.create({
            lessonid, lessonchildid, idenrollment
        })
        res.status(200).json(newUserCourseCurrent);
    }catch(err){
        res.status(500).json({error: err});
    }

}
const updateUserCourseCurrent = async (req: Request, res: Response)=>{
    const {lessonid, lessonchildid, idenrollment} = req.body;
    try{
        const userCourseCurrent = await UserCourseCurrent.findOne({where: {idenrollment: idenrollment}});
        if(!userCourseCurrent){
            return res.status(404).json({message: "Not found"});
        }
        await userCourseCurrent.update({
            lessonid, lessonchildid
        });
        res.status(200).json(userCourseCurrent);
    }catch(err){
        res.status(500).json({error: err});
    }
}

//lấy dữ liệu usercoursecurrent
const getusercoursecurrent = async (req: Request, res: Response) => {
    const {idenrollment} = req.params;
    try{
        const dataUserCourseCurrent = await UserCourseCurrent.findAll({where: {idenrollment}});
        if(dataUserCourseCurrent) {
            return res.status(200).json(dataUserCourseCurrent);
        }
    }catch(err){res.status(500).json({error: err});}
}
export {createUserCourseCurrent, updateUserCourseCurrent, getusercoursecurrent};