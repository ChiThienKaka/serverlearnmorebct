import multer from "multer"
import path from "path";
import fs from "fs";

// cấu hình multer để lưu file
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        const {lessonid} = req.body;
        // Định nghĩa đường dẫn để lưu file tùy theo loại
        let uploadpath;
        if(file.fieldname === 'filevideo') {
            uploadpath = path.join(__dirname, '../../storage/lessonchild',lessonid,'video');
            // tạo thư mục nếu không tồn tại 
            if(!fs.existsSync(uploadpath)){
                fs.mkdirSync(uploadpath, {recursive: true});
            }
            cb(null, uploadpath);
        }
        if(file.fieldname === 'tailieu'){
            uploadpath = path.join(__dirname, '../../storage/lessonchild',lessonid,'tailieu');
            // tạo thư mục nếu không tồn tại 
            if(!fs.existsSync(uploadpath)){
                fs.mkdirSync(uploadpath, {recursive: true});
            }
            cb(null, uploadpath);
        }
        //lưu thumbai của bài giảng
        if(file.fieldname === 'image'){
            uploadpath = path.join(__dirname, '../../storage/lessonchild',lessonid,'image');
            // tạo thư mục nếu không tồn tại 
            if(!fs.existsSync(uploadpath)){
                fs.mkdirSync(uploadpath, {recursive: true});
            }
            cb(null, uploadpath);
        }
    },

    filename: (req, file, cb) => {
        // cấu hình nhận vào mảng tên file đã tạo 
        const filename = Date.now() + path.extname(file.originalname);

        // Gán tên file vào req.body hoặc req.files để có thể sử dụng sau này
        if (!req.body.files) {
            req.body.files = {};
        }
        
         // Kiểm tra nếu đã có mảng file cho fieldname này, nếu chưa thì khởi tạo mảng
        if (!req.body.files[file.fieldname]) {
            req.body.files[file.fieldname] = [];
        }

        // Push tên file vào mảng cho fieldname này
        req.body.files[file.fieldname].push(filename);

        cb(null, filename); // Đặt tên file theo timestamp
    }
})

const uploadFileLessonChild = multer({storage: storage});

export default uploadFileLessonChild;
