import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class UserCourseCurrent extends Model {
  public id!: number;
  public lessonid?: string;
  public lessonchildid?: number;
  public idenrollment?: number;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
UserCourseCurrent.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  lessonid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lessonchildid: {
    type: DataTypes.INTEGER,
    allowNull: true,//cho phép giá trị có thể null
  },
  idenrollment: {
    type: DataTypes.INTEGER,
    allowNull: true,//cho phép giá trị có thể null
  }
}, {
    sequelize:sequelize,
    modelName:'UserCourseCurrent',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'UserCourseCurrent',//Tên được đặt trên database
    createdAt: false,
    timestamps: false,
});

export default UserCourseCurrent;