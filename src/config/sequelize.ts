import { Sequelize } from "sequelize";
const sequelize = new Sequelize('learnmorebct', 'postgres', 'chithien', {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
  });
  
  sequelize.authenticate()
    .then(() => {
      console.log('Kết nối đã được thiết lập thành công.')
    })
    .catch(err => console.error('Không thể kết nối với cơ sở dữ liệu:', err));
  
  export default sequelize;