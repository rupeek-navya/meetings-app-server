const express=require('express')
const {getAllUsers,findIdByEmail}=require('../../controllers/users')
const router=express.Router()

router.get('/',getAllUsers)
router.get('/:email',findIdByEmail)

module.exports=router