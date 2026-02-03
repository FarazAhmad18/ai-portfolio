const { Op } = require('sequelize')
const Property=require('../models/Property')
exports.getallproperties=async(req,res)=>{
    try{
const properties=await Property.findAll()
res.status(200).json(properties)
}
 catch(e){
    res.json({error:e})
    console.log(e)
 }
}
exports.getproperty=async(req,res)=>{
    try{
        const {id}=req.params
        if(!id) return res.status(401).json({error:'Enter Id'})
         const property= await Property.findByPk(id)
        if(!property) return res.status(401).json({error:"Enter Valid Id"})
        return res.status(200).json({property})
    }
    catch(e){
     return res.json({error:e})
    }
}
exports.createProperty=async(req,res)=>{
    try{
        const agent_id=req.user.id
        const {price,location,bedrooms,area,description}=req.body
        // if (price==null||location==null||bedrooms==null||area==null||!description)
        const required=['price','location','bedrooms','area','description']
        for(const key of required)
        {
            if(req.body[key]==null||req.body[key]=='') 
            return res.status(401).json({error:`${key} is required`})
        }
        const property=await Property.create({agent_id,price,location,bedrooms,area,description})
        return res.status(201).json({property})
    }
    catch(e){
return res.status(401).json({error:e})
    }
}
exports.updateProperty=async(req,res)=>{
    try{
        const id=req.params.id
        const { price, location, bedrooms, area, description } = req.body
     if(!id) return res.status(401).json({error:'Enter Id'})
        const property=await Property.findByPk(id)
    if(!property) return res.status(403).json({err:'Property not found'})
    if(property.agent_id!=req.user.id)return res.status(400).json({msg:'Not your property'})
        property.price=price??property.price
        property.location=location??property.location
        property.bedrooms=bedrooms??property.bedrooms
        property.area=area??property.area
        property.description=description??property.description
        await property.save()
    return res.status(200).json(property)
    }
    catch(e){
return res.status(401).json({error:e})
    }
}
exports.deleteProperty=async(req,res)=>{
    try{
const id=req.params.id
const property=await Property.findByPk(id)
if(!property)return res.status(400).json({error:'Property not found'})
if(property.agent_id!=req.user.id)return res.status(403).json({msg:'You do not own this property'})
await property.destroy()
res.status(200).json({msg:'Property Deleted Successfully'})
    }
    catch(e){
      return res.status(401).json({error:e})  
    }
}
exports.search=async(req,res)=>{
    try{
 const { location, minPrice, maxPrice, bedrooms, minArea, maxArea } = req.query
 const where={}
 if(location) where.location= {[Op.like]:`%${location}%`}
 if(minPrice!=null) where.price={...(where.price||{}),[Op.gte]:Number(minPrice)}
if(maxPrice!=null) where.price={...(where.price||{}),[Op.lte]:Number(maxPrice)}
if(bedrooms) where.bedrooms=Number(bedrooms)
if(minArea!=null) where.area={...(where.area||{}),[Op.gte]:Number(minArea)}
if(maxArea!=null) where.area={...(where.area||{}),[Op.lte]:Number(maxArea)}
// console.log("QUERY:", req.query)
const properties=await Property.findAll({
    where,
    order:[['createdAt','DESC']]
})
res.status(200).json({count:properties.length,properties})
    }
    catch(e)
    {
           return res.status(401).json({error:e})  
    }
}