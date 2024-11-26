import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class UserDetails extends Model {
  public userid!: number;
  public ccvb?: string;
  public status?: boolean;
  public capbac?: string;
  public nganhang?: string;
  public diachi?: string;
  public sdt?: string;
  public cccd?: string;
  public linhvuc?: string;
  public truonghoc?: string;
  public kinhnghiem?: string;
  public chamngonsong?: string;
  public sotaikhoan?: string;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
UserDetails.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ccvb: {
    type: DataTypes.STRING,
    allowNull: true,//cho phép giá trị có thể null
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true
  },
  capbac: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  nganhang: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  diachi: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  sdt: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  cccd:{
    type: DataTypes.STRING,
    allowNull: true, //cho phép giá trị có thể null
  },
  linhvuc:{
    type: DataTypes.STRING,
    allowNull: true, //cho phép giá trị có thể null
  },
  truonghoc: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  kinhnghiem:{
    type: DataTypes.STRING,
    allowNull: true, //cho phép giá trị có thể null
  },
  chamngonsong:{
    type: DataTypes.STRING,
    allowNull: true, //cho phép giá trị có thể null
  },
  sotaikhoan:{
    type: DataTypes.STRING,
    allowNull: true, //cho phép giá trị có thể null
  }
}, {
    sequelize:sequelize,
    modelName:'UserDetails',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'UserDetails',//Tên được đặt trên database
    timestamps:true, //Thời gian tạo
});

export default UserDetails;