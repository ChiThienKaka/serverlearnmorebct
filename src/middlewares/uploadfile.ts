import multer from "multer"
import path from "path";
import fs from "fs";
import {User} from '../models/indextModel'
//Cấu hình middlwares kiểm tra đầu vào của file
const uploadFile= multer({
    storage:  multer.diskStorage({
                destination: async (req, file, cb) =>{
                    const {email} = req.body;
                    //nếu email đã tồn tại rồi thì chặn upload file lên
                    const checkUser = await User.findOne({where: {email:email}});
                    if(checkUser){
                        return cb(null, 'Email đã tồn tại');
                    }

                     // Xác định thư mục lưu trữ dựa trên loại file (ảnh hoặc tài liệu)
                    let uploadPath;
                    const imageTypes = /jpeg|jpg|png/;
                    const docTypes = /pdf|doc|docx/;

                    if (imageTypes.test(path.extname(file.originalname).toLowerCase())) {
                        // Nếu là ảnh thì lưu vào thư mục ảnh
                        uploadPath = path.join(__dirname, '../../storage/giangvien', email, '/Images');
                    } else if (docTypes.test(path.extname(file.originalname).toLowerCase())) {
                        // Nếu là tài liệu thì lưu vào thư mục tài liệu
                        uploadPath = path.join(__dirname, '../../storage/giangvien', email, '/Documents');
                    } else {
                        return cb(null,'File type not supported');
                    }
                    // ---------------------------------------------------------------

                    //thư mục bạn muốn lưu file vào
                    //const uploadPath = path.join(__dirname, '../../storage/',email,'/ChungChiGV');
                    
                    req.body.uploadPath = path.join(__dirname, '../../storage/giangvien', email); //Lưu lại đường dẫn các file được lưu
                    if(!fs.existsSync(uploadPath)){
                        fs.mkdirSync(uploadPath, {recursive: true}); // Tạo thư mục nếu chưa tồn tại
                    }
                    cb(null, uploadPath);//chỉ định thư mục để lưu file
                },
                filename: (req, file, cb) => {
                    cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file, extname phần mở rộng
                }
            }),
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf|doc|docx/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const allowedMimeTypes = ['application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'image/jpeg', 'image/png', 'application/pdf'];
        const mimetype = allowedMimeTypes.includes(file.mimetype);
        // const mimetype = allowedTypes.test(file.mimetype);
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image, pdf, and document files are allowed!'));
        }
    },
})
//Lấy ra lưu thumbail của khóa học
 const uplaodFileThumbailCourses = multer({
    storage: multer.diskStorage({
                destination: async (req, file, cb) =>{
                    const {idgv} = req.body;
                    const upLoadPathFile = path.join(__dirname, '../../storage/courses/thumbail',idgv);
                    // tạo thư mục nếu chưa tồn tại 
                    if(!fs.existsSync(upLoadPathFile)){
                        fs.mkdirSync(upLoadPathFile, {recursive: true}); // Tạo thư mục nếu chưa tồn tại
                    }
                    cb(null, upLoadPathFile);
                },
                filename: (req, file, cb) => {
                    const tenfile = Date.now() + path.extname(file.originalname);
                    req.body.filename = tenfile; //lấy tên file
                    cb(null, tenfile); // Đặt tên file theo timestamp
                },
            })
 })

export {uploadFile, uplaodFileThumbailCourses};
