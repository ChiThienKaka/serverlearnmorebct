import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class Quizzes extends Model {
  public id!: number;
  public courseid?: number;
  public title?: string;
  public description?: number;
  public total_marks?:number;
  public passing_marks?:number;
  public order?: number;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
Quizzes.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  courseid: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,//cho phép giá trị có thể null
  }
  ,total_marks: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  passing_marks: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: true,  //cho phép giá trị có thể null
  }
}, {
    sequelize:sequelize,
    modelName:'Quizzes',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'Quizzes',//Tên được đặt trên database
    createdAt: false,
    timestamps: false
});

export default Quizzes;