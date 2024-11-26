import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class UserProcessLesson extends Model {
  public id!: number;
  public idenrollment?: number;
  public idlessonchild?: number;
  public status?: boolean;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
UserProcessLesson.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  idenrollment: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  idlessonchild: {
    type: DataTypes.INTEGER,
    allowNull: true,//cho phép giá trị có thể null
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,  //cho phép giá trị có thể null
  }
}, {
    sequelize:sequelize,
    modelName:'UserProcessLesson',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'UserProcessLesson',//Tên được đặt trên database
    createdAt: false,
    timestamps: false
});

export default UserProcessLesson;