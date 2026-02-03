exports.requireRole=(...roles)=>(req,res,next)=>{
if(!req.user)return res.json({msg:'Not Logged in'})
if(!roles.includes(req.user.role))return res.status(402).json({msg:'Forbidden'})
next()
}
