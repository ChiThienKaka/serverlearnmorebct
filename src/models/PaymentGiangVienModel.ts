import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class PaymentGiangVien extends Model {
  public id!: number;
  public idgv?: number;
  public courseid?: number;
  public hocvienmoi?:number;
  public amount?: number;
  public magiaodich?: string;
  public method?: string;
  public kieuthanhtoan?: string;
  public status?: string;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
PaymentGiangVien.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  idgv: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  courseid: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  hocvienmoi: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: true,//cho phép giá trị có thể null
  },
  magiaodich: {
    type: DataTypes.STRING,
    allowNull: true
  },
  method: {
    type: DataTypes.STRING,
    allowNull: true 
  },
  kieuthanhtoan: {
    type: DataTypes.STRING,
    allowNull: true 
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true
  }
}, {
    sequelize:sequelize,
    modelName:'PaymentGiangVien',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'PaymentGiangVien',//Tên được đặt trên database
    timestamps: true
});

export default PaymentGiangVien;