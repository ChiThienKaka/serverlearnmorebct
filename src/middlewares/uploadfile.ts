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
 async function clearDirectory(directoryPath:any) {
    try {
        // Kiểm tra xem thư mục có tồn tại hay không
        const files = await fs.readdirSync(directoryPath);

        // Nếu có file, tiến hành xóa từng file
        if (files.length > 0) {
            for (const file of files) {
                const filePath = path.join(directoryPath, file);
                await fs.unlinkSync(filePath); // Xóa file
            }
            console.log('Đã xóa toàn bộ file trong thư mục.');
        } else {
            console.log('Thư mục không chứa file nào.');
        }
    } catch (error) {
        console.error('Lỗi khi xóa file:', error);
    }
}
 //Cấu hình uploadfile cho hình ảnh đoạn chat
 const uploadfilehinhChatCourseUser = multer({
    storage: multer.diskStorage({
                destination: async (req, file, cb) =>{
                    const upLoadPathFile = path.join(__dirname, '../../storage/chatcourseuser/Image');

                    //Xóa các file cũ và tạo một file mới tránh lưu liên tục đầy bộ nhớ

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
//Cấu hình upload cho hình đại diện của người dùng
const uploadfilehinhdaidiennguoidung = multer({
    storage: multer.diskStorage({
                destination: async (req, file, cb) =>{
                    const {userid} = req.body;
                    console.log(userid);
                    const upLoadPathFile = path.join(__dirname, `../../storage/nguoidung/${userid}`);
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
 });
 //Cấu hình uploadfile đánh giá 
 const uploadfilehinhanhdanhgia = multer({
    storage: multer.diskStorage({
                destination: async (req, file, cb) =>{
                    const {idenrollment} = req.body;
                    console.log(idenrollment);
                    const upLoadPathFile = path.join(__dirname, `../../storage/reviews/${idenrollment}`);
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
 });
const uploadfileInfoGV = multer();
export {uploadFile, uplaodFileThumbailCourses, uploadfilehinhChatCourseUser, uploadfilehinhdaidiennguoidung, uploadfileInfoGV, 
    uploadfilehinhanhdanhgia
};
