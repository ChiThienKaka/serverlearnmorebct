import { Request, Response } from "express";
import {Reviews, User, Courses}  from "../models/indextModel"
import path from "path";

const create = async (req: Request, res: Response) => {
    const {idenrollment, courseid, userid, rating, comment, filename} = req.body;
    try{
        const newdanhgia = await Reviews.create({
            idenrollment,
            courseid,
            userid,
            rating,
            comment,
            hinhanh: filename,
        })
        //update sao trung bình
        const danhgia = (await Reviews.findAll({where: {courseid: courseid}})).map(item=> item.toJSON());
        const sumRating = danhgia.reduce((acc, curr) => acc + curr.rating, 0);
        const countRating = (sumRating / danhgia.length).toFixed(1);
        await Courses.update({rate: countRating}, {where: {id: courseid}})
        return res.status(201).json(newdanhgia);
    }catch(err){
        return res.status(404).json({err: err})
    }
}

const getbycourseid = async (req: Request, res: Response) => {
    const {courseid} = req.body;
    try{
        const course = (await Courses.findOne({where: {id: courseid}}))?.toJSON();
        const danhgia = (await Reviews.findAll({where: {courseid: courseid}})).map(item=>item.toJSON());
        const infodanhgia = await Promise.all(
            danhgia.map(async(item)=> {
                const user = (await User.findOne({where: {id: item.userid}}))?.toJSON();
                return {...item, user: user};
            })
        )
        const ratelength = infodanhgia.length;
        const rate5 = (infodanhgia.filter(item=>item.rating===5).length / ratelength * 100).toFixed(0);
        const rate4 = (infodanhgia.filter(item=>item.rating===4).length / ratelength * 100).toFixed(0);
        const rate3 = (infodanhgia.filter(item=>item.rating===3).length / ratelength * 100).toFixed(0);
        const rate2 = (infodanhgia.filter(item=>item.rating===2).length / ratelength * 100).toFixed(0);
        const rate1 = (infodanhgia.filter(item=>item.rating===1).length / ratelength * 100).toFixed(0);
        return res.status(200).json({infodanhgia: infodanhgia, course: course, luotdanhgia: infodanhgia.length, rate5, rate4, rate3, rate2, rate1});
    }catch(err){
        return res.status(404).json({err: err})
    }
}
//lấy hình ảnh đánh giá
const gethinhanhreviews = async(req: Request, res: Response) => {
    res.set('cross-origin-resource-policy', 'cross-origin');//cho phép từ các nguồn khác
    const {idenrollment, filename} = req.params;
    const filepath = path.join(__dirname, `../../storage/reviews/${idenrollment}/${filename}`);
    res.sendFile(filepath,(err)=>{
        if(err){
            console.error('Error sending file:', err);
            return res.status(404).send('File not found');
        }
    })
}
export {create, getbycourseid, gethinhanhreviews}