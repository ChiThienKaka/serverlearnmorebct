import { Request, Response, NextFunction } from "express"
import {User, UserDetails, Courses} from "../models/indextModel"
import path from "path";
import fs from 'fs'
import { where } from "sequelize";

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


export {duyetgiangvien, getavatar, getChungchivanbang, getChungchicuthe, getALLCourseAndGiangVien};