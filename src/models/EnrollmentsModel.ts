import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class Enrollments extends Model {
  public id!: number;
  public userid?: number;
  public courseid?: number;
  public process?:number;
  public status?: boolean;
  public ispass?:boolean;
  public totalquizzes?: number;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
Enrollments.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  courseid: {
    type: DataTypes.INTEGER,
    allowNull: true,//cho phép giá trị có thể null
  },
  process: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: true,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  ispass: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  totalquizzes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: true,
  }
}, {
    sequelize:sequelize,
    modelName:'Enrollments',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'Enrollments',//Tên được đặt trên database
    timestamps: true
});

export default Enrollments;