import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import 'dotenv/config'
const authenticateToken = (req:Request, res:Response, next:NextFunction)=>{
    const token = req.header('Authorization')?.split(' ')[1]; //lấy token từ header
    if (!token) return res.status(401).json({ message: "Token không hợp lệ" });
    try {
        const jwtsecret = process.env.JWT_SECRET!;
        const verified = jwt.verify(token, jwtsecret);
        req.body.user= verified; // Gắn user đã xác thực vào req
        next();
    } catch (error) {
        res.status(400).json({ message: "Token không hợp lệ" });
    }

}
export default authenticateToken;