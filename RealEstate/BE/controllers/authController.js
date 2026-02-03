const User=require('../models/user')
const bcrypt=require('bcrypt')
const {signToken}=require('../utils/jwt')

 exports.register=async(req,res)=>{
    try{
    const {name,email,password,role}=req.body
    if(!name||!email||!password) return res.status(401).json({msg:'name, email, password required'})
    // const exists=await User.findOne({Where:{email}})
const exists = await User.findOne({
  where: { email }
});

    if(exists) return res.status(401).json({msg:'user alreadyyy exists'})
    const hash=await bcrypt.hash(password,10)
    const user=await User.create({name,email,password:hash,role:role||'Buyer'})
    const token=signToken(user)
    return res.status(200).json({token,user:{id:user.id,name:user.name,email:user.email,role:user.email}})
    }
    catch(err)
    {
        res.status(404).json({msg:'Server Error',error:err})
        console.log("Regiter error: ", err)
    }
}
exports.login=async(req,res)=>{
    try{
        const{email,password}=req.body
        if(!email||!password) return res.status(401).json({msg:'email password required'})
        const user=await User.findOne({where:{email}})
        if(!user) return res.status(401).json({msg:'invalid credential'})    
        const ok=await bcrypt.compare(password,user.password)
       if(!ok)  return res.status(401).json({msg:'invalid password'})   
       const token=signToken(user)
    res.status(200).json({token,user:{email:user.email,role:user.role}})
    }
    catch(e)
    {
        res.status(404).json({msg:'Server Error'})
         console.log("Login error: ", e)
    }
}
exports.profile=async(req,res)=>{
res.json({user:req.user})
}