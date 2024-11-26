import { Request, Response } from "express";
import Courses from '../models/CoursesModel'
import path from "path";
import User from "../models/UserModel";
import Lesson from "../models/LessonModel";
import {LessonChild, Quizzes, Question, UserDetails, Enrollments} from "../models/indextModel"
import { Sequelize, Op } from "sequelize";

// tạo khóa học 
const createCourses = async (req: Request, res: Response) => {
    const {title, idgv, iddanhmuc, price, filename, description} = req.body;
    try {
        const newCourse = await Courses.create({
            title,
            idGV: idgv,
            description,
            idDanhmuc:iddanhmuc,
            price,
            thumbnail:filename,
        });
        res.status(201).json(newCourse);
    }catch(err){
        console.log(err);
        res.status(400).json({message: err});
    }
}
// lấy toàn bộ khóa học dựa vào id giảng viên
const getAllCourse = async (req: Request, res:Response) => {
    const {idgv} = req.params;
    const dataCourses = (await Courses.findAll({where:{idGV:idgv}})).map(item=> item.toJSON());
    if(dataCourses) {
        return res.status(200).json(dataCourses);
    }
    res.status(404).json({message: 'Course not found'});
}


//lấy thumnbail khóa học
const getthumbailCourse = (req: Request, res:Response) => {
    res.set('cross-origin-resource-policy', 'cross-origin');//cho phép từ các nguồn khác
    const {idgv, thumbail} = req.params;
    const filepath = path.join(__dirname, '../../storage/courses/thumbail',idgv,thumbail);
    res.sendFile(filepath,(err)=>{
        if(err){
            console.error('Error sending file:', err);
            return res.status(404).send('File not found');
        }
    })
}

// cập nhật status của Khóa học thông qua admin
const updateCoursebyIdCouses = async (req: Request, res:Response)=>{
    const {id} = req.params;
    const {status} = req.body;
    try{
        await Courses.update({status: status}, {where: {id: id}});
        res.status(200).json({message: "Cập nhật thành công"})
    }catch(err) {res.status(400).json({error: err})}
}

//Lấy toàn bộ khóa học giảng viên đăng và đã được duyệt
const getAllCourseByStatus = async (req: Request, res: Response)=>{
    try{
        const course = (await Courses.findAll({where: {status: true}})).map(item=>item.toJSON());
        const userGiangvien = (await User.findAll({where: {role: 'giangvien'}})).map(item=>item.toJSON());
        const courseGiangvien = await Promise.all(
            course.map(async(item)=>{
                //lấy tổng bài giảng
                const lesson = (await Lesson.findAll({where: {courseid: item.id}})).map(item=>item.toJSON());
                let lessonchild = 0;
                for (const lessonItem of lesson) {
                    const temp = (await LessonChild.findAll({ where: { lessonid: lessonItem.lessonid } })).length;
                    lessonchild += temp;
                }
                const quizz = (await Quizzes.findAll({where: {courseid: item.id}})).length;
                lessonchild += quizz;
                //lấy số người theo học
                const tongenrollment = (await Enrollments.findAll({where: {courseid: item.id}})).length;
                return {...item, giangVien: userGiangvien.find(itemG=>itemG.id === item.idGV), tongbaigiang: lessonchild, tongnguoidung: tongenrollment};
            })
        )
        // const courseGiangvien = await Promise.all(
        //     course.map(async(item)=>{
        //         const lesson = await Lesson.findAll({where: {courseid: id}})
        //         return {...item, giangVien: userGiangvien.find(itemG=>itemG.id === item.idGV)};
        //     })
        // )
        res.status(200).json(courseGiangvien);
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error'});
    }
    
}
//Lấy khóa học theo điều kiện danh mục và giá miễn phí
const getAllCourseByStatusIfquery = async (req: Request, res: Response)=>{
    try{
        const {idDanhmuc, price} = req.body;
            const course = (await Courses.findAll({where: {status: true, 
                ...(idDanhmuc===1?{}:{idDanhmuc}),
                ...(price===0?{}:price===1?{price:0}:{price: {[Op.gt]:0}})
            }})).map(item=>item.toJSON());
            const userGiangvien = (await User.findAll({where: {role: 'giangvien'}})).map(item=>item.toJSON());
            const courseGiangvien = await Promise.all(
                course.map(async(item)=>{
                    //lấy tổng bài giảng
                    const lesson = (await Lesson.findAll({where: {courseid: item.id}})).map(item=>item.toJSON());
                    let lessonchild = 0;
                    for (const lessonItem of lesson) {
                        const temp = (await LessonChild.findAll({ where: { lessonid: lessonItem.lessonid } })).length;
                        lessonchild += temp;
                    }
                    const quizz = (await Quizzes.findAll({where: {courseid: item.id}})).length;
                    lessonchild += quizz;
                    //lấy số người theo học
                    const tongenrollment = (await Enrollments.findAll({where: {courseid: item.id}})).length;
                    return {...item, giangVien: userGiangvien.find(itemG=>itemG.id === item.idGV), tongbaigiang: lessonchild, tongnguoidung: tongenrollment};
                })
            )
            return res.status(200).json(courseGiangvien);
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error'});
    }
    
}
//Lấy khóa học nổi bật
const getAllCourseByStatusNoibat = async (req: Request, res: Response)=>{
    try{
        const course = (await Courses.findAll({where: {status: true, rate: {[Op.gte]:0}},limit:6,order: [['rate', 'DESC']]})).map(item=>item.toJSON());
        const userGiangvien = (await User.findAll({where: {role: 'giangvien'}})).map(item=>item.toJSON());
        const courseGiangvien = await Promise.all(
            course.map(async(item)=>{
                //lấy tổng bài giảng
                const lesson = (await Lesson.findAll({where: {courseid: item.id}})).map(item=>item.toJSON());
                let lessonchild = 0;
                for (const lessonItem of lesson) {
                    const temp = (await LessonChild.findAll({ where: { lessonid: lessonItem.lessonid } })).length;
                    lessonchild += temp;
                }
                const quizz = (await Quizzes.findAll({where: {courseid: item.id}})).length;
                lessonchild += quizz;
                //lấy số người theo học
                const tongenrollment = (await Enrollments.findAll({where: {courseid: item.id}})).length;
                return {...item, giangVien: userGiangvien.find(itemG=>itemG.id === item.idGV), tongbaigiang: lessonchild, tongnguoidung: tongenrollment};
            })
        )
        res.status(200).json(courseGiangvien);
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error'});
    }
    
}
//lấy khóa học mới nhất
const getAllCourseByStatusNewhot = async (req: Request, res: Response)=>{
    try{
        const course = (await Courses.findAll({where: {status: true},limit:6,order: [['createdAt', 'DESC']]})).map(item=>item.toJSON());
        const userGiangvien = (await User.findAll({where: {role: 'giangvien'}})).map(item=>item.toJSON());
        const courseGiangvien = await Promise.all(
            course.map(async(item)=>{
                //lấy tổng bài giảng
                const lesson = (await Lesson.findAll({where: {courseid: item.id}})).map(item=>item.toJSON());
                let lessonchild = 0;
                for (const lessonItem of lesson) {
                    const temp = (await LessonChild.findAll({ where: { lessonid: lessonItem.lessonid } })).length;
                    lessonchild += temp;
                }
                const quizz = (await Quizzes.findAll({where: {courseid: item.id}})).length;
                lessonchild += quizz;
                //lấy số người theo học
                const tongenrollment = (await Enrollments.findAll({where: {courseid: item.id}})).length;
                return {...item, giangVien: userGiangvien.find(itemG=>itemG.id === item.idGV), tongbaigiang: lessonchild, tongnguoidung: tongenrollment};
            })
        )
        res.status(200).json(courseGiangvien);
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error'});
    }
    
}
//Lấy thông tin của khóa học đã duyệt và giảng viên chi tiết của các khóa học con
const getALLCourseByIdgetLessonandGV = async (req:Request, res:Response) => {
    const {idcourse, idGV} = req.params;
    try{
       const course = await Courses.findOne({where: {id: idcourse}})
       const lesson = (await Lesson.findAll({where:{courseid: idcourse}})).map(item=>item.toJSON());
    //    const lenthlesson = lesson.length;//lấy số lượng bài giảng 18/10/2024
       //Lấy số lượng bài giảng con
        const lessonchild = await Promise.all(
            lesson.map(async(item)=>{
                return await LessonChild.findAll({where: {lessonid: item.lessonid}})
            })
        )
        const lenthlesson = lessonchild.reduce((acc, curr) => acc + curr.length, 0); //lấy số lượng bài giảng con 24/10/2024
       //lấy số lượng bài kiểm tra
       const quizzes = await Quizzes.findAll({where: {courseid: idcourse}});
       const lengthquizzes = quizzes.length;
       const userGiangvien = (await User.findOne({where: {id: idGV}}))?.toJSON();
       //chitietgiangvien
       const userdetailsGV = (await UserDetails.findOne({where: {userid: idGV}}))?.toJSON();
       res.status(200).json({lesson: lesson, giangVien: {...userGiangvien, ...userdetailsGV}, course: course, tongbaigiang: lenthlesson, tongbaikiemtra: lengthquizzes});
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error'});
    }
    
 
}

//Lấy toàn bộ bài giảng con và câu hỏi theo icouse
const getALLLessonandQuizzbyIdcousechild = async (req: Request, res: Response) => {
    const {idcourse} = req.params;
    try{
       const course = await Courses.findOne({where: {id: idcourse}});
       const lesson = (await Lesson.findAll(
        {where: {courseid: idcourse}})).map(item=>item.toJSON()); //sắp xếp tăng dần
       const datalessonandchild = await Promise.all(
            lesson.map(async (item)=>{
                const lessonchid = (await LessonChild.findAll({where: {lessonid: item.lessonid},order: [['order', 'ASC']]})).map(item=>item.toJSON());
                return {...item,type:'baihoc', lessonchild: lessonchid}
            })
       )
       const quizz = (await Quizzes.findAll({where: {courseid: idcourse}})).map(item=>item.toJSON());
       const dataQuizzQuestionChild = await Promise.all(
            quizz.map(async (item)=>{
                const question = (await Question.findAll({where: {idquizz: item.id}, order: [['order', 'ASC']]})).map(item=>item.toJSON());
                return {...item,type:'kiemtra', question: question}
            })
       )
       const baigiang = [...datalessonandchild, ...dataQuizzQuestionChild].sort((a, b)=>{
           // Đảm bảo rằng thuộc tính 'order' tồn tại, nếu không sẽ dùng giá trị mặc định là Infinity
            return (a.order ?? Infinity) - (b.order ?? Infinity);
       })
       res.status(200).json({course: course, baigiang: baigiang});
    }catch(err){
        console.log(err);
        res.status(500).json({message: 'Error'});
    }
 
}


export  {createCourses, getAllCourse, getthumbailCourse, updateCoursebyIdCouses, getAllCourseByStatus, getALLCourseByIdgetLessonandGV,
    getALLLessonandQuizzbyIdcousechild, getAllCourseByStatusNoibat, getAllCourseByStatusNewhot, getAllCourseByStatusIfquery
};