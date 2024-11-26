import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/sequelize'
class Payment extends Model {
  public id!: number;
  public transactionid?: string;
  public userid?: number;
  public courseid?: number;
  public amount?: number;
  public paymentdate?: Date;
  public paymentmethod?: string;
  public status?: boolean;
  public thanhtoangiangvien?: boolean;
  public idgv?: number;
}
//nếu không đặt khóa chính nó sẽ tự sinh id
Payment.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,//Tự động tăng
    primaryKey: true,
  },
  transactionid: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  userid: {
    type: DataTypes.INTEGER,
    allowNull: true,//cho phép giá trị có thể null
  },
  courseid: {
    type: DataTypes.INTEGER,
    allowNull: true,//cho phép giá trị có thể null
  },
  amount: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  paymentdate:{
    type: DataTypes.DATE,
    allowNull: true,
  },
  paymentmethod:{
    type: DataTypes.STRING,
    allowNull: true,
  },
  status:{
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,
  },
  thanhtoangiangvien: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: true,  //cho phép giá trị có thể null
  },
  idgv: {
    type: DataTypes.INTEGER,
    allowNull: true,  //cho phép giá trị có thể null
  }
}, {
    sequelize:sequelize,
    modelName:'Payment',//Tên model này sẽ ánh xạ đến bảng dữ liệu trên database
    tableName:'Payment',//Tên được đặt trên database
    createdAt: false,
    timestamps: false
});

export default Payment;