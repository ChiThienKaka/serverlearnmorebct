import { Request, Response, NextFunction } from "express"
import {User, UserDetails, Courses, Payment} from "../models/indextModel"
import path from "path";
import fs from 'fs';
import { Op, Sequelize } from "sequelize";

const duyetgiangvien = async (req:Request, res:Response, next:NextFunction)=>{
    try{
        //lay ds sang vien
        const userGiangvien = await User.findAll({where: {role: 'giangvien'}});
        //id cua tung giang vien
        const userIdgvs = userGiangvien.map(user => user.id);
        //ds chi tiet giang vien 

        const userDt = await Promise.all(
            userIdgvs.map(async (id) => {
                return await UserDetails.findOne({where: {userid: id}})
            })
        )
        //lọc lại dữ liệu
        const data = userGiangvien.map((item)=>{
            const userdetail = userDt.find((value)=>value?.userid === item.id)
            return {id: item.id, name: item.name, email: item.email, avatar: item.avatar, files: userdetail?.ccvb, status: userdetail?.status}
        })
        res.status(200).json({data: data})
    }catch(err) {console.log(err); res.status(500).json({data:'error'})}
}




// lấy avatar theo tham số email
const getavatar = (req:Request, res:Response) => {
    res.set('cross-origin-resource-policy', 'cross-origin');//cho phép từ các nguồn khác
    const {email} = req.params;
    // const filePath = '1726989381400.png';
    // const rootDir= path.join(__dirname, '../../storage/giangvien/thien@gmail.com/Images'); // Điều chỉnh đường dẫn này cho phù hợp
    // res.sendFile(filePath, { root: rootDir }, (err) => {
    //   if (err) {
    //     console.error('Error sending file:', err);
    //     res.status(404).send('File not found');
    //   }
    // });
    // const filepath = path.join(name)
    // res.sendFile(filepath,(err)=>{
    //     if(err){
    //         console.error('Error sending file:', err);
    //         res.status(404).send('File not found');
    //     }
    // })
    const folderPath = path.join('D:/Nam5Hocki1/React/serverLearnmorebct/storage/giangvien',email,'Images');
    fs.readdir(folderPath, (err, files) => {
        if (err) {return res.status(500).json({ error: 'Không thể đọc thư mục', details: err });}
        // Tạo đường dẫn đầy đủ cho từng file
        const filePaths = files.map(file => file);

        const filepath = path.join(folderPath, filePaths[0].toString())
        res.sendFile(filepath,(err)=>{
            if(err){
                console.error('Error sending file:', err);
                return res.status(404).send('File not found');
            }
        })

        // Trả về danh sách file dưới dạng JSON
        // res.status(200).json({ files: filePaths });
    });

  };

  //lấy chứng chỉ văn bằng
  const getChungchivanbang = (req: Request, res:Response) =>{
    const {email} = req.params;
    const folderPath = path.join('D:/Nam5Hocki1/React/serverLearnmorebct/storage/giangvien',email,'Documents');    
    fs.readdir(folderPath, (err, files) => {
        if (err) {return res.status(500).json({ error: 'Không thể đọc thư mục', details: err });}
        // Tạo đường dẫn đầy đủ cho từng file
        const filePaths = files.map(file => file);
        // Trả về danh sách file dưới dạng JSON
        res.status(200).json({ files: filePaths });
    });
  }

  //lấy chứng chỉnh cụ thể
  const getChungchicuthe = (req:Request, res:Response) =>{
        const {email, namefile} = req.params;
        const folderPath = path.join('D:/Nam5Hocki1/React/serverLearnmorebct/storage/giangvien',email,'Documents',namefile);
        res.sendFile(folderPath, (err)=>{
            if(err){
                console.error('Error sending file:', err);
                res.status(404).send('File not found');
            }
        })
  }

//Lấy danh sách toàn bộ khóa học và tên giảng viên đăng kiểm tra và duyệt

const getALLCourseAndGiangVien = async (req:Request, res:Response) => {
    try{
        //dữ liệu bảng của client ant desing yêu cầu key
        const course = (await Courses.findAll()).map(item=>item.toJSON());
        const giangvien = (await User.findAll({where: {role: 'giangvien'}})).map(item => item.toJSON());
        const courseGiangvien = course.map((item)=>{
            return {...item,key:item.id, giangVien: giangvien.find(itemgv => itemgv.id === item.idGV)};
        })
        res.status(200).json(courseGiangvien)
    }catch(err){
        console.log(err);
        res.status(500).json({data:'error'});
    }
}
//lấy danh sách toàn bộ giảng viên
const getAllGiangVienInfo = async (req: Request, res: Response)=> {
    try{
        const user = (await User.findAll({where: {role: 'giangvien'}})).map(item=>item.toJSON());
        const userall = await Promise.all(
            user.map(async(item)=>{
                const userdetails =(await UserDetails.findOne({where: {userid: item.id}}))?.toJSON();
                return {...item,key:item.id, userdetails: userdetails}
            })
        )
        return res.status(200).json(userall)
    }catch(err){
        return res.status(500).json({err: err})
    }
}
//lấy danh sách thông tin người dùng 
const getInfoNguoidung = async (req: Request, res: Response)=> {
    try{
        const user = (await User.findAll({where: {role: 'nguoidung'}, raw: true})).map((item)=>{
            return {...item, key: item.id}
        });
        return res.status(200).json(user);
    }catch(err){
        return res.status(500).json({err: err})
    }
}

//thống kê khóa học
const thongkekhoahoc = async (req: Request, res: Response)=> {
    const {month, year} = req.body;
    const startDate = new Date(year, month - 1, 1); // Ngày đầu tháng
    const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Ngày cuối tháng
    try{
       const dataCourse = await Courses.findAll({
        attributes: [
            [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'createdDate'],
            [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalCourse'], // Đếm số lượng user mỗi ngày
          ],
        where: {
            createdAt: { [Op.between]: [startDate, endDate] },
            status: true
        },
        group: ['createdDate'], // Group theo ngày
        // order: [[Sequelize.literal('totalCourse'), 'DESC']],
        raw: true, // Kết quả ở dạng JSON thuần
       })
       const dataCourseall = dataCourse.map((item:any)=>{
            return {createdDate: item.createdDate, totalCourse: Number(item.totalCourse)}
       })
       return res.status(200).json(dataCourseall);
    }catch(err){
        return res.status(500).json({err: err})
    }
}

const thongkedoanhthu = async (req: Request, res: Response) => {
    const {month, year} = req.body;
    const startDate = new Date(year, month - 1, 1); // Ngày đầu tháng
    const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Ngày cuối tháng
    try{
        const payment = await Payment.findAll({
            attributes: [
                [Sequelize.fn('DATE', Sequelize.col('paymentdate')), 'createdDate'],
                [Sequelize.fn('SUM', Sequelize.col('amount')), 'totalCourse'], //  Tổng tiền
              ],
            where: {
                paymentdate: { [Op.between]: [startDate, endDate] },
            },
            group: ['createdDate'], // Group theo ngày
            // order: [[Sequelize.literal('totalCourse'), 'DESC']],
            raw: true, // Kết quả ở dạng JSON thuần
        });
        const paymentall = payment.map((item:any)=>{
            return {createdDate: item.createdDate, totalCourse: Number(item.totalCourse)}
       })
        return res.status(200).json(paymentall)
    }catch(err){
        return res.status(500).json({err: err})
    }
}
export {duyetgiangvien, getavatar, getChungchivanbang, getChungchicuthe, getALLCourseAndGiangVien, getAllGiangVienInfo, getInfoNguoidung,
    thongkekhoahoc, thongkedoanhthu
};