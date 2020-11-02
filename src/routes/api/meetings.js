const express=require('express')
const {getMeetings, searchMeetings, modifyUser, addMeeting}=require('../../controllers/meetings')
const {authenticate}=require('../../utils/auth')
const router=express.Router()

router.get('/',authenticate,getMeetings)

router.get('/search',authenticate,searchMeetings)

router.patch('/:meetingId/:action',authenticate,modifyUser)

router.post('/add',authenticate,addMeeting)

module.exports=router