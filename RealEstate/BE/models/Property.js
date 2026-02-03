const {DataTypes}=require('sequelize')
const sequelize=require('../config/db')

const Property=sequelize.define('Property',
    {
id:{
    type:DataTypes.INTEGER,
    autoIncrement:true,
    primaryKey:true,
},
agent_id:{
    type:DataTypes.INTEGER,
    references:{
         model:'users',
         key:'id',
    },
    onDelete:'CASCADE',
},
price:{
type:DataTypes.FLOAT,
allowNull:false,
},
location:{
type:DataTypes.STRING,
allowNull:false,
},
bedrooms:{
type:DataTypes.INTEGER,
allowNull:false,
},
area:{
    type:DataTypes.FLOAT,
    allowNull:false,
},
description:{
type:DataTypes.TEXT,
allowNull:false,
}
    },
    {
        timestamps:true,
        tableName:'properties',
    }
)
module.exports=Property;