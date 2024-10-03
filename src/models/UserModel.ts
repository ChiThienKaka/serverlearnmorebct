import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class User extends Model {
  public id!: number;
  public name?: string;
  public email?: string;
  public avatar?: string;
  public password?: string;
  public uid?: string;
  public role?: string;
}
User.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,//cho phép giá trị có thể null
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  role: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  uid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
    sequelize:sequelize,
    modelName:'User',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName: 'User',//Tên được đặt trên database
    timestamps:true, //Thời gian tạo
});

export default User;
