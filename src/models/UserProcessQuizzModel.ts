import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class UserProcessQuizz extends Model {
  public id!: number;
  public idquizz?: number;
  public idenrollment?: number;
  public score?: number;
  public ispass?: boolean;
  public questioncorrect?: string;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
UserProcessQuizz.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  idquizz: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  idenrollment: {
    type: DataTypes.INTEGER,
    allowNull: true,//cho phép giá trị có thể null
  },
  score: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ispass: {
    type: DataTypes.BOOLEAN,
    allowNull: true,
    defaultValue: false
  },
  questioncorrect: {
    type: DataTypes.STRING,
    allowNull: true, //cho phép giá trị có thể null
  }
}, {
    sequelize:sequelize,
    modelName:'UserProcessQuizz',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'UserProcessQuizz',//Tên được đặt trên database
    timestamps: true
});

export default UserProcessQuizz;