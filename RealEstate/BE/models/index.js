const User=require('./user')
const Property= require('./Property')
const AiAnalysis=require('./AiAnalysis')

User.hasMany(Property,{foreignKey:'agent_id'});
Property.belongsTo(User,{foreignKey:'agent_id'})

Property.hasOne(AiAnalysis,{foreignKey:'property_id'})
AiAnalysis.belongsTo(Property,{foreignKey:'property_id'})

module.exports={User,Property,AiAnalysis};


