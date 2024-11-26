import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class ChatCourseUser extends Model {
  public id!: number;
  public idenrollment?: number;
  public vanban?: string;
  public hinhanh?: string;
  public gvchat?: boolean;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
ChatCourseUser.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  idenrollment: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  vanban: {
    type: DataTypes.TEXT,
    allowNull: true,//cho phép giá trị có thể null
  },
  hinhanh: {
    type: DataTypes.STRING,
    allowNull: true,//cho phép giá trị có thể null
  },
  gvchat:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,  //cho phép giá trị có thể null
  }
}, {
    sequelize:sequelize,
    modelName:'ChatCourseUser',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'ChatCourseUser',//Tên được đặt trên database
    timestamps: true,
});

export default ChatCourseUser;