const express=require('express')
const router=express.Router()
const{getallproperties,getproperty,createProperty,updateProperty,deleteProperty,search}=require('../controllers/propertyController')
const {auth}=require('../middlewares/authMiddleware')
const{requireRole}=require('../middlewares/roleMiddleware')
//public routes
router.get('/properties',getallproperties)
router.get('/properties/:id',getproperty)
router.get('/search',search)
//private
router.post('/properties',auth,requireRole('Agent'),createProperty)
router.put('/properties/:id',auth,requireRole('Agent'),updateProperty)
router.delete('/properties/:id',auth,requireRole('Agent'),deleteProperty)

module.exports=router