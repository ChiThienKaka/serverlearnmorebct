import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class Question extends Model {
  public id!: number;
  public idquizz?: number;
  public question_text?: string;
  public question_type?: string;
  public mark?: number;
  public choice1?: string;
  public choice2?: string;
  public choice3?: string;
  public choice4?: string;
  public correct?: string;
  public order?: number;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
Question.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  idquizz: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: true,//cho phép giá trị có thể null
  },
  question_type: {
    type: DataTypes.STRING,
    allowNull: true,//cho phép giá trị có thể null
  },
  choice1: {
    type: DataTypes.TEXT,
    allowNull: true,//cho phép giá trị có thể null
  },
  choice2: {
    type: DataTypes.TEXT,
    allowNull: true,//cho phép giá trị có thể null
  },
  choice3: {
    type: DataTypes.TEXT,
    allowNull: true,//cho phép giá trị có thể null
  },
  choice4: {
    type: DataTypes.TEXT,
    allowNull: true,//cho phép giá trị có thể null
  },
  correct: {
    type: DataTypes.TEXT,
    allowNull: true,//cho phép giá trị có thể null
  },
  mark: {
    type: DataTypes.INTEGER,
    allowNull: true,//cho phép giá trị có thể null
  },
  order:{
    type: DataTypes.INTEGER,
    defaultValue: 1,
    allowNull: true,  //cho phép giá trị có thể null
  }
}, {
    sequelize:sequelize,
    modelName:'Question',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'Question',//Tên được đặt trên database
    createdAt: false,
    timestamps: false
});

export default Question;