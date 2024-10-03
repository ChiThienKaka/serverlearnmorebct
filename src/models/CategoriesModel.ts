import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class Categories extends Model {
  public id!: number;
  public name?: string;
  public description?: number;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
Categories.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: true,//cho phép giá trị có thể null
  }
}, {
    sequelize:sequelize,
    modelName:'Categories',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'Categories',//Tên được đặt trên database
    createdAt: false,
    timestamps: false
});

export default Categories;