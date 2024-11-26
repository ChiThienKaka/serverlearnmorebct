import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class Reviews extends Model {
  public id!: number;
  public idenrollment?: number;
  public courseid?: number;
  public userid?: number;
  public rating?: number;
  public comment?: string;
  public hinhanh?: string;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
Reviews.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  idenrollment: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  courseid: {
    type: DataTypes.INTEGER,
    allowNull: true,//cho phép giá trị có thể null
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: true,//cho phép giá trị có thể null
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  hinhanh: {
    type: DataTypes.STRING,
    allowNull: true, //cho phép giá trị có thể null
  }
}, {
    sequelize:sequelize,
    modelName:'Reviews',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'Reviews',//Tên được đặt trên database
    timestamps: true
});

export default Reviews;