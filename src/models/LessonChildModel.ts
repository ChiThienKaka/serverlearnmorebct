import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class LessonChild extends Model {
  public id!: number;
  public lessonid?: string;
  public title?: string;
  public videourl?: string;
  public tailieu?: string;
  public filevideo?: string;
  public order?: number;
  public type?: string;
  public thumbnail?: string;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
LessonChild.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  lessonid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: true,//cho phép giá trị có thể null
  },
  videourl: {
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
  order:{
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: true,//cho phép giá trị có thể null
  },
  type: {
    type: DataTypes.STRING,
    allowNull: true, //cho phép giá trị có thể null
  },
  thumbnail:{
    type: DataTypes.STRING,
    allowNull: true, //cho phép giá trị có thể null
  }
}, {
    sequelize:sequelize,
    modelName:'LessonChild',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'LessonChild',//Tên được đặt trên database
    createdAt: false,
    timestamps: false
});

export default LessonChild;