import { Request, Response } from "express";
import {ChatCourseUser, Enrollments} from "../models/indextModel"
//tạo một tin nhắn mới theo id người dùng
const create = async (req: Request, res:Response) => {
    const {idenrollment, filename, vanban, gvchat} = req.body;
    try{
        const status = gvchat === 'true'
        const enrollment = await Enrollments.findOne({where: {id: idenrollment}});
        if(enrollment){
            const newchatcourseuser = await ChatCourseUser.create({
                idenrollment,
                vanban,
                hinhanh: filename,
                gvchat: status
            });
            // lấy toàn bộ dữ liệu hiện tại 
            const chatcourseuser = await ChatCourseUser.findAll({where: {idenrollment: idenrollment}});
            // Phát sự kiện 'newMessage' đến client khi có tin nhắn mới
            //req.app.get('socketio').emit('newMessage',chatcourseuser);//12:38 28/10/2024
            // Phát sự kiện 'newMessage' đến chỉ phòng `idenrollment` chặn lại khác phòng sẽ không thấy
            req.app.get('socketio').to(idenrollment.toString()).emit('newMessage', chatcourseuser);
            res.status(200).json(newchatcourseuser);
            return;
        }
        res.status(404).json("Không tìm thấy enrollment này");
    }catch(err){res.status(500).json({err:err})}
}
// lấy tinh nhắn từ server lên
const getchatcourseuserbyidenrollment = async (req: Request, res: Response) => {
    const {idenrollment} = req.params;
    try{
        const enrollment = await Enrollments.findOne({where: {id: idenrollment}});
        if(enrollment){
            const chatcourseuser = await ChatCourseUser.findAll({where: {idenrollment: idenrollment}});
            res.status(200).json(chatcourseuser);
            return;
        }
        res.status(404).json("Không tìm thấy enrollment này");
    }catch(err){res.status(500).json({err:err})}
}
export  {create, getchatcourseuserbyidenrollment}
