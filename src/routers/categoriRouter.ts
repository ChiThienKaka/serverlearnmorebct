import { Router } from "express";
import {danhsachalldanhmuc, danhsachcategori} from "../controllers/categoriController";

const router = Router();
//lấy theo thứ tự cây
router.get('/danhmuc', danhsachcategori)
//lấy theo thứ tự cả cụm
router.get('/danhmuc1', danhsachalldanhmuc)

export default router;