import { Request, Response} from "express"
import {Categories, CategoriesChild} from "../models/indextModel"

const categorieschild = async (id: number) => {
    const res = await CategoriesChild.findAll({where: {parentid: id}});
    return await res;
}
const danhsachcategori = async (req:Request, res: Response) => {
    const categori = (await Categories.findAll()).map(item=>item.toJSON());
    if(categori){
        const alldata = await Promise.all(
            categori.map(async(item)=>{
                const child = await CategoriesChild.findAll({where: {parentid: item.id}});
                return {...item, childs: child}
            })
        )
        return res.status(200).json({data: alldata});
    }
    res.status(500).json({data: "Error"});
}
const danhsachalldanhmuc = async (req:Request, res: Response) =>{
    const categori = (await Categories.findAll()).map(item=>item.toJSON());
    const categroichild = (await CategoriesChild.findAll()).map(item=>item.toJSON());
    if(categori && categroichild){
       return res.status(200).json({danhmuc: categori, danhmuccon: categroichild});
    }
    res.status(500).json({data: "Error"});
}
export {danhsachcategori, danhsachalldanhmuc};