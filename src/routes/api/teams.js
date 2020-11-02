const express=require('express')
const {getTeams,addTeam,modifyTeam} =require('../../controllers/teams')
const {authenticate}=require('../../utils/auth')
const router=express.Router()

router.get('/',authenticate,getTeams)

router.post('/add',authenticate,addTeam)

router.patch('/:teamId/:action',authenticate,modifyTeam)

module.exports=router