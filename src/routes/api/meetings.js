const express=require('express')
const path=require('path')
const {getMeetings, searchMeetings, modifyUser}=require('../../controllers/meetings')
const router=express.Router()

router.get('/',getMeetings)
router.get('/search',searchMeetings)
router.patch('/:meetingId/:action',modifyUser)
module.exports=router