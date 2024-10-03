import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class Courses extends Model {
  public id!: number;
  public title?: string;
  public idGV?: number;
  public idDanhmuc?: number;
  public price?: number;
  public thumbnail?: string;
  public status?: boolean;
  public description?: string;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
Courses.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  idGV: {
    type: DataTypes.INTEGER,
    allowNull: true,//cho phép giá trị có thể null
  },
  idDanhmuc: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  thumbnail: {
    type: DataTypes.STRING,
    allowNull: true,  //cho phép giá trị có thể null
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,  //cho phép giá trị có thể null
  },
  description:{
    type: DataTypes.TEXT,
    allowNull: true,  //cho phép giá trị có thể null
  }
}, {
    sequelize:sequelize,
    modelName:'Courses',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'Courses',//Tên được đặt trên database
    timestamps:true, //Thời gian tạo
});

export default Courses;