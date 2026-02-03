const {Sequelize}=require('sequelize')
require('dotenv').config()

const temp= new Sequelize(
     '',
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host:process.env.DB_HOST,
        dialect:'mysql',
        logging:false,
    } 
)
async () => {
  await temp.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
  await sequelize.authenticate();
};
const sequelize=new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host:process.env.DB_HOST,
        dialect:'mysql',
        logging:false,
    }
);

// sequelize.authenticate()
// .then(()=>console.log("✅ DB Connected Successfully"))
// .catch((err)=>console.error("❌Erro Connecting DB",err))

module.exports=sequelize;