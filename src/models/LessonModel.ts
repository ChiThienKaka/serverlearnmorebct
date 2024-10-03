import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class Lesson extends Model {
  public id!: number;
  public lessonid?: string;
  public courseid?: number;
  public title?: string;
  public content?: string;
  public videourl?: string;
  public tailieu?: string;
  public order?: number;
  public filevideo?: string;
  public image?: string;

}
//nếu không đặt khóa chính nó sẽ tự sinh id
Lesson.init({
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
    allowNull: true,//cho phép giá trị có thể null
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: true,//cho phép giá trị có thể null
  },
  videourl: {
    type: DataTypes.STRING,
    allowNull: true,//cho phép giá trị có thể null
  },
  order: {
    type: DataTypes.STRING,
    allowNull: true,//cho phép giá trị có thể null
  },
  tailieu: {
    type: DataTypes.STRING,
    allowNull: true,//cho phép giá trị có thể null
  },
  filevideo: {
    type: DataTypes.STRING,
    allowNull: true,//cho phép giá trị có thể null
  },
  lessonid:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  image:{
    type: DataTypes.STRING,
    allowNull: true,  //cho phép giá trị có thể null
  }
}, {
    sequelize:sequelize,
    modelName:'Lesson',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'Lesson',//Tên được đặt trên database
    createdAt: false,
    timestamps:false,
});

export default Lesson;