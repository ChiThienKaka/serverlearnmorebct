
import { NextFunction, Request, Response } from "express";
import bcrypt from 'bcrypt'
import {User, UserDetails} from '../models/indextModel'
import { getAccessToken } from "../utils/getAccesstoken";
import path from "path";
import { Op, Sequelize } from "sequelize";
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
            name: user.name,//31/10/2024 2:08
            avatar: user.avatar,//31/10/2024 2:08
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

const updateuserNguoidung = async (req: Request, res: Response) => {
    const {userid,name, filename} = req.body;
    console.log(filename);
    try{
        //lấy ra id người dùng cần update
        const user = await User.update(
            {
                name: name,
                avatar: filename
            },
            {where: {id: userid}}
        )
        res.status(200).json(user);
    }catch(err){res.status(400).json({err: err});}
}
const getAvatarnguoidung = async(req: Request, res: Response) => {
    res.set('cross-origin-resource-policy', 'cross-origin');//cho phép từ các nguồn khác
    const {userid, filename} = req.params;
    const filepath = path.join(__dirname, `../../storage/nguoidung/${userid}/${filename}`);
    res.sendFile(filepath,(err)=>{
        if(err){
            console.error('Error sending file:', err);
            return res.status(404).send('File not found');
        }
    })
}
//Cập nhật thông tin giảng viên
const updateuseruserdetailsGV = async(req: Request, res: Response)=>{
    const {userid, name, capbac, nganhang, diachi, sdt, cccd, linhvuc, truonghoc, kinhnghiem, chamngonsong, sotaikhoan} = req.body;
    const user = await User.findOne({where: {id: userid}});
    if(user!==null){
        // nếu tồn tại thì mới cập nhật
        await User.update(
            {
                name: name
            },
            {where: {id: userid}}
        )
        await UserDetails.update(
            {
                capbac: capbac,
                nganhang: nganhang,
                diachi: diachi,
                sdt: sdt,
                cccd: cccd,
                linhvuc: linhvuc,
                truonghoc: truonghoc,
                kinhnghiem: kinhnghiem,
                chamngonsong: chamngonsong,
                sotaikhoan: sotaikhoan
            },
            {where: {userid: userid}}
        )
        return res.status(200).json({message: 'Cập nhật thành công'})
    }
    return res.status(404).json({message: 'User not found'})
}

//Lấy thông tin của giảng viên
const getInfoGV = async(req:Request, res:Response) => {
    const {userid} = req.body;
    try{
        const user = await User.findOne({where: {id: userid}});
        if(user!==null){
            const userinfo = user.toJSON();
            const userDetails = (await UserDetails.findOne({where: {userid: userid}}))?.toJSON();
            return res.status(200).json({...userinfo, ...userDetails})
        }
        return res.status(404).json({message: 'User not found'})
    }catch(err){return res.status(500).json({err:err})}
}
//hằng gộp dữ liệu
interface UserData {
    createdDate: string;
    totalUsers: string; // Chuỗi vì dữ liệu từ API có thể ở dạng này
  }
  
  interface MergedData {
    date: string;
    sinhvien: number;
    giangvien: number;
  }
  
  const mergeData = (dataHocvien: UserData[], datagiangvien: UserData[]): MergedData[] => {
    // Tạo một map để lưu trữ dữ liệu gộp
    const mergedData: Record<string, MergedData> = {};
  
    // Duyệt qua danh sách sinh viên (dataHocvien)
    dataHocvien.forEach(({ createdDate, totalUsers }) => {
      if (!mergedData[createdDate]) {
        mergedData[createdDate] = { date: createdDate, sinhvien: 0, giangvien: 0 };
      }
      mergedData[createdDate].sinhvien += parseInt(totalUsers, 10); // Cộng số lượng sinh viên
    });
  
    // Duyệt qua danh sách giảng viên (datagiangvien)
    datagiangvien.forEach(({ createdDate, totalUsers }) => {
      if (!mergedData[createdDate]) {
        mergedData[createdDate] = { date: createdDate, sinhvien: 0, giangvien: 0 };
      }
      mergedData[createdDate].giangvien += parseInt(totalUsers, 10); // Cộng số lượng giảng viên
    });
  
    // Chuyển map thành array để sử dụng
    return Object.values(mergedData);
  };
  
//lấy thống kê học viên và giáo viên
const thongkehocvien = async (req: Request, res: Response) => {
    const {month, year} = req.body;
    const startDate = new Date(year, month - 1, 1); // Ngày đầu tháng
    const endDate = new Date(year, month, 0, 23, 59, 59, 999); // Ngày cuối tháng
    try{
        // Group theo ngày tạo
const dataHocvien = await User.findAll({
    attributes: [
      [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'createdDate'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalUsers'], // Đếm số lượng user mỗi ngày
    ],
    where: {
      createdAt: { [Op.between]: [startDate, endDate] },
      role: 'nguoidung',
    },
    group: ['createdDate'], // Group theo ngày
    raw: true, // Kết quả ở dạng JSON thuần
  });
  const datagiangvien = await User.findAll({
    attributes: [
      [Sequelize.fn('DATE', Sequelize.col('createdAt')), 'createdDate'],
      [Sequelize.fn('COUNT', Sequelize.col('id')), 'totalUsers'], // Đếm số lượng user mỗi ngày
    ],
    where: {
      createdAt: { [Op.between]: [startDate, endDate] },
      role: 'giangvien',
    },
    group: ['createdDate'], // Group theo ngày
    raw: true, // Kết quả ở dạng JSON thuần
  });
  //ép kiểu
  const datagiangvienAsUserData: UserData[] = datagiangvien.map((user:any)=> ({
    createdDate: user.createdDate,
    totalUsers: user.totalUsers,
  }));
  //ép kiểu
  const datanguoidungAsUserData: UserData[] = dataHocvien.map((user:any)=> ({
    createdDate: user.createdDate,
    totalUsers: user.totalUsers,
  }));
  const mergedData = mergeData(datagiangvienAsUserData, datanguoidungAsUserData);
        return res.status(200).json(mergedData);
    }catch(err){return res.status(500).json({err:err})}
}
export  {dangkyGiangvien, dangkyNguoiDung,dangnhap, checkUserStatusGV, updateStatusGV, updateuserNguoidung, getAvatarnguoidung, updateuseruserdetailsGV, getInfoGV,
    thongkehocvien
}