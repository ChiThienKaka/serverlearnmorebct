import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class CategoriesChild extends Model {
  public id!: number;
  public name?: string;
  public parentid?: number;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
CategoriesChild.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  parentid: {
    type: DataTypes.INTEGER,
    allowNull: true,//cho phép giá trị có thể null
  }
}, {
    sequelize:sequelize,
    modelName:'CategoriesChild',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'CategoriesChild',//Tên được đặt trên database
    createdAt: false,
    timestamps: false,
});

export default CategoriesChild;