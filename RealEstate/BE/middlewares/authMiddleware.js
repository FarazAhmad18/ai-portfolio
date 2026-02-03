const User=require('../models/user')
const jwt=require('jsonwebtoken')

async function  auth (req,res,next){
    try{
const header=req.headers.authorization
if(!header||!header.startsWith('Bearer ')) 
    {return res.status(401).json({msg:'Token Missing'})
    }
    const token=header.split(' ')[1]
    const payload=jwt.verify(token,process.env.JWT_SECRET_KEY)
    if(!payload)
    {
        return res.status(401).json({msg:'Invalid Token'})
    }
    const user=await User.findByPk(payload.id,{
        attributes:['id','name','email','role'],}  
    )
    req.user=user;
    next()
}
catch(err)
{
    res.status(400).json({msg:'Invalid/Expired Token'})
    console.log(err)
}
}
module.exports={auth}