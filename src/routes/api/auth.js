const express=require('express')
const {sendToken,createUser}=require('../../controllers/auth')
const router=express.Router()

router.post('/login',sendToken)

router.post('/register',createUser)

module.exports=router
