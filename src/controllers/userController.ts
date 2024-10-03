
import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt'
import {User, UserDetails} from '../models/indextModel'
import { getAccessToken } from "../utils/getAccesstoken";
import path from "path";
const dangkyGiangvien = async (req:Request, res:Response)=>{
    const {name, email, password, uploadPath} = req.body;
    try{
        //kiểm tra email đã tồn tại chưa
        if(email){
            const checkUser = await User.findOne({where: {email}});
            if(checkUser){
                return res.status(400).json({message:"Email này đã tồn tại!"});
            }else{
                //Mã hóa mật khẩu trước khi lưu vào database
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                //Tạo người dùng mới
                const newUser = await User.create({
                    name,
                    email,
                    password: hashedPassword,
                    role: "giangvien",
                    avatar: path.join(uploadPath,'Images')
                })
                
                const userid = newUser.id;
                //Lưu dữ liệu và đường dẫn vào bàng UserDetails
                await UserDetails.create({
                    userid: userid,
                    ccvb: path.join(uploadPath,'Documents'),
                    status: false
                })
            
                //Trả về thông tin người dùng
                res.status(200).json({message: 'Đăng ký thành công',})
            }
        }
    }catch(err){console.log(err);res.status(400).json({message:err})}

}
const dangkyNguoiDung = async (req:Request, res:Response)=>{
    const {email, password} = req.body;
    try{
        //kiểm tra email đã tồn tại chưa
        if(email){
            const checkUser = await User.findOne({where: {email}});
            if(checkUser){
                return res.status(400).json({message:"Email này đã tồn tại!"});
            }else{
                //Mã hóa mật khẩu trước khi lưu vào database
                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                //Tạo người dùng mới
                const newUser = await User.create({
                    email,
                    password: hashedPassword,
                    role: "nguoidung"
                })
                
                //Trả về thông tin người dùng
                res.status(200).json({message: 'Đăng ký thành công'})
            }
        }
    }catch(e){res.status(400).json({message:e})}
}

const dangnhap = async (req:Request, res:Response)=>{
    const {email, password} = req.body;
    const user = await User.findOne({where: {email}});
    if(!user || !bcrypt.compareSync(password, user.password||'')){
        return res.status(401).json({ message: "Tài khoản mật khẩu không chính xác" });
    }
    res.status(201).json({
        token: getAccessToken({
            id: user.id,
            email: user.email,
            role: user.role,
        })
    })
}

// Check status của bàng Giang vien
const checkUserStatusGV = async (req:Request, res:Response) => {
    const {id} = req.body;
    try{
        const userDTGV = await UserDetails.findOne({where: {userid: id}});
        if(userDTGV){
            res.status(200).json({statusGV: userDTGV.status})
        }
    }catch(err) {res.status(400).json({error: err})}
}
//Cập nhật status của giảng viên
const updateStatusGV = async (req:Request, res:Response) => {
    const {id} = req.params;  // id của giảng viên
    const {status} = req.body;
    try{
        await UserDetails.update({status: status}, {where: {userid: id}});
        res.status(200).json({message: "Cập nhật thành công"})
    }catch(err) {res.status(400).json({error: err})}
}



export  {dangkyGiangvien, dangkyNguoiDung,dangnhap, checkUserStatusGV, updateStatusGV}