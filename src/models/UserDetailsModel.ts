import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class UserDetails extends Model {
  public userid!: number;
  public ccvb?: string;
  public status?: boolean;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
UserDetails.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  ccvb: {
    type: DataTypes.STRING,
    allowNull: true,//cho phép giá trị có thể null
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true
  }
}, {
    sequelize:sequelize,
    modelName:'UserDetails',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'UserDetails',//Tên được đặt trên database
    timestamps:true, //Thời gian tạo
});

export default UserDetails;