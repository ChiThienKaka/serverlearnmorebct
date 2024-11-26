import { Request, Response } from "express";
import {PaymentGiangVien, Payment} from "../models/indextModel"
import { Op } from "sequelize";
const create = async (req:Request, res: Response)=>{
    const {idgv, courseid, hocvienmoi, amount, magiaodich, method, kieuthanhtoan, year, month} = req.body;
    //Xác định ngày đầu và cuối của tháng
    const startDate = new Date(year, month - 1, 1); // Ngày đầu tháng
    const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Ngày cuối tháng
    //so sánh tối ưu để lọc theo tháng và chỉ lấy những khóa học có học viên chưa giải ngân của giảng viên truyền vào
    try{
        const payments = await Payment.update(
            {
                thanhtoangiangvien:true,
            },{
                where: {
                    paymentdate: { [Op.between]: [startDate, endDate] }, 
                    thanhtoangiangvien:false,
                    courseid: courseid,
                    idgv:idgv,
                },
            }
       )
       if(payments){
            const newpaymentgiangvien = await PaymentGiangVien.create({
                idgv,
                courseid,
                hocvienmoi,
                amount,
                magiaodich,
                method,
                kieuthanhtoan,
                status: true
            })
            return res.status(201).json(newpaymentgiangvien);
       }
       return res.status(404).json({err: 'Không tìm thấy khóa học nào để giải ngân.'});
    }catch(err){return res.status(500).json({err: err})}
}
const getByidGV = async (req: Request, res: Response) => {
    const {month, year, idgv} = req.body;
    //Xác định ngày đầu và cuối của tháng
    const startDate = new Date(year, month - 1, 1); // Ngày đầu tháng
    const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Ngày cuối tháng
    //so sánh tối ưu để lọc theo tháng và chỉ lấy những khóa học có học viên chưa giải ngân của giảng viên truyền vào
    try{
        const paymentgvall = (await PaymentGiangVien.findAll({
            where: {
                createdAt: { [Op.between]: [startDate, endDate] },
                idgv: idgv
            }
        })).map(item=>item.toJSON());
        if(paymentgvall){
            const paymentkey = paymentgvall.map((item)=>{
                return {...item, key: item.id};
            })
            return res.status(200).json(paymentkey);
        }
        return res.status(404).json({err: 'Không tìm thấy giao dịch nào trong tháng.'});
    }catch(err){
        return res.status(500).json({err: err});
    }
}
const getalladmin = async (req:Request, res:Response)=>{
    const {month, year} = req.body;
    //Xác định ngày đầu và cuối của tháng
    const startDate = new Date(year, month - 1, 1); // Ngày đầu tháng
    const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Ngày cuối tháng
    //so sánh tối ưu để lọc theo tháng và chỉ lấy những khóa học có học viên chưa giải ngân của giảng viên truyền vào
    try{
        const paymentgvall = (await PaymentGiangVien.findAll({
            where: {
                createdAt: { [Op.between]: [startDate, endDate] },
            }
        })).map(item=>item.toJSON());
        if(paymentgvall){
            const paymentkey = paymentgvall.map((item)=>{
                return {...item, key: item.id};
            })
            return res.status(200).json(paymentkey);
        }
        return res.status(403).json({err: 'Không tìm thấy giao dịch nào trong tháng.'});
    }catch(err){
        return res.status(500).json({err: err});
    }
}
export  {getByidGV, create,getalladmin};