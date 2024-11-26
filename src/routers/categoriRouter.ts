import { Router } from "express";
import {danhsachalldanhmuc, danhsachcategori, danhsachcay} from "../controllers/categoriController";

const router = Router();
//lấy theo thứ tự cây
router.get('/danhmuc', danhsachcategori)
//lấy theo thứ tự cả cụm
router.get('/danhmuc1', danhsachalldanhmuc)
//lấy danh sách cây
router.get('/danhsachcay', danhsachcay)
export default router;