import { Request, Response } from "express";
import {Payment, Courses, User, UserDetails} from "../models/indextModel"
import axios from "axios";
import { Sequelize, Op } from "sequelize";
const create = async (req: Request, res: Response) => {
    try{
        const {transactionid, userid, courseid, amount, paymentdate, paymentmethod} = req.body;
        const newpayment = await Payment.create({
            transactionid,
            userid,
            courseid,
            amount,
            paymentdate,
            paymentmethod,
        })
        return res.status(200).json(newpayment);
    }catch(err){res.status(500).json({err:err})};
}

const updatepaymentThanhtoan = async (req: Request, res: Response) => {
    try{
        const {userid, courseid} = req.body;
        const payment = await Payment.findAll({where: {userid: userid, courseid: courseid}});
        //kiểm tra xem các mã này có mã nào đã thanh toán chưa
        const dathanhtoan = await Promise.all(
            payment.map(async(item:any)=>{
                const respayment = await axios.post('http://localhost:5000/momo/kiemtragiaodich', {orderId: item.transactionid});
                //kiểm tra các mã giao dịch có mã nào đã thanh toán không
                if(respayment.data.resultCode===0){
                    //cập nhật lại mã đó bằng true
                    await Payment.update({status: true}, {where: {transactionid: item.transactionid}});
                }
                return respayment.data;
            })
        )
        return res.status(200).json(dathanhtoan);
    }catch(err){res.status(500).json({err:err})};
}

const checkpaymentThanhtoan = async (req: Request, res: Response) => {
    try{
        const {userid, courseid} = req.body;
        //Kiếm xem user này đã thanh toán chưa
        const payment = await Payment.findOne({where: {userid: userid, courseid: courseid, status:true}});
        
        return res.status(200).json(payment);
    }catch(err){res.status(500).json({err:err})};
}
//lấy thông tin payment theo tháng 
const getPaymentTheoThang = async (req:Request, res:Response) => {
    try{
        const {year, month, thanhtoangiangvien} = req.body;
        // Xác định ngày đầu và cuối của tháng
        const startDate = new Date(year, month - 1, 1); // Ngày đầu tháng
        const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Ngày cuối tháng
        //so sánh tối ưu để lọc theo tháng và chỉ lấy những khóa học có học viên chưa giải ngân
        const payments = await Payment.findAll({
            where: {paymentdate: { [Op.between]: [startDate, endDate] }, thanhtoangiangvien},
            attributes:['courseid'],//lấy cột courseid
            group:"courseid"
        });
        //lấy thông tin của giảng viên và khóa học
        if(payments){
            const info = await Promise.all(
               payments.map(async (item:any)=>{
                    const course = (await Courses.findOne({where: {id: item.courseid}}))?.toJSON();
                    const user = (await User.findOne({where: {id: course?.idGV}}))?.toJSON();
                    const userdetail = (await UserDetails.findOne({where: {userid: user?.id}}))?.toJSON();
                    //lọc ra những thanh viên chưa thanh toán, là thanh viên mới trong tháng
                    const payment = (await Payment.findAll({where: {courseid: item.courseid, thanhtoangiangvien}})).map(item=>item.toJSON());
                    const tongtien = course.price * payment.length * course.tileanchia;
                    const paymentall = await Promise.all(
                        payment.map(async (item:any)=>{
                            const user = (await User.findOne({where: {id: item.userid}}))?.toJSON();
                            return {...item, user: user, key: item.id};
                        })
                    )
                    return {course: course, user: {...user, ...userdetail}, payment: paymentall, tongtien: tongtien, thanhvienmoi: payment.length};
               })
            )
            return res.status(200).json(info);
        }
        return res.status(200).json(payments);
    }catch(err){res.status(500).json({err:err})}
}

//Lấy các mã giảng viên theo tháng
const getPaymentTheoThangGiangvien = async (req:Request, res:Response) => {
    try{
        const {year, month, thanhtoangiangvien, idgv} = req.body;
        // Xác định ngày đầu và cuối của tháng
        const startDate = new Date(year, month - 1, 1); // Ngày đầu tháng
        const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Ngày cuối tháng
        //so sánh tối ưu để lọc theo tháng và chỉ lấy những khóa học có học viên chưa giải ngân của giảng viên truyền vào
        const payments = await Payment.findAll({
            where: {paymentdate: { [Op.between]: [startDate, endDate] }, thanhtoangiangvien, idgv:idgv},
            attributes:['courseid','idgv'],//lấy cột courseid
            group:["courseid",'idgv']
        })
        //lấy thông tin của giảng viên và khóa học
        if(payments){
            const info = await Promise.all(
               payments.map(async (item:any)=>{
                    const course = (await Courses.findOne({where: {id: item.courseid}}))?.toJSON();
                    const user = (await User.findOne({where: {id: course?.idGV}}))?.toJSON();
                    const userdetail = (await UserDetails.findOne({where: {userid: user?.id}}))?.toJSON();
                    //lọc ra những thanh viên chưa thanh toán, là thanh viên mới trong tháng
                    const payment = (await Payment.findAll({where: {courseid: item.courseid, thanhtoangiangvien}})).map(item=>item.toJSON());
                    const tongtien = course.price * payment.length * course.tileanchia;
                    const paymentall = await Promise.all(
                        payment.map(async (item:any)=>{
                            const user = (await User.findOne({where: {id: item.userid}}))?.toJSON();
                            return {...item, user: user, key: item.id};
                        })
                    )
                    return {course: course, user: {...user, ...userdetail}, payment: paymentall, tongtien: tongtien, thanhvienmoi: payment.length};
               })
            )
            return res.status(200).json(info);
        }
        return res.status(200).json(payments);
    }catch(err){res.status(500).json({err:err})}
}

export {updatepaymentThanhtoan, create, checkpaymentThanhtoan, getPaymentTheoThang, getPaymentTheoThangGiangvien};