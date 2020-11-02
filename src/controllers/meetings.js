const mongoose = require( 'mongoose' );
const path=require('path')
var XLSX = require('xlsx')
const Meeting = mongoose.model( 'meeting' );
const User=mongoose.model('user')



async function getMeetings(req,res,next){
    try{
        const date=req.query.date
        // const userId=req.query.userId
        const userId=res.locals.claims.userId
        if(date && userId)
        {
           const meetings=await Meeting.find({
               "attendees.userId":userId,
               date:date
           },{attendees:0})
           res.status(200).json(meetings)
        }
    }
    catch(error){
        error.status=404
        next(error)
        return;
    }
}

async function searchMeetings(req,res,next){
    try{
        const period=req.query.period.toLowerCase()
        const searchTerm=req.query.search
        
        const userId=res.locals.claims.userId
        const filter={date:{},attendees:{$elemMatch:{}}}
        if(userId){
            filter.attendees.$elemMatch.userId=userId
        }
        const today=new Date().toISOString().substr(0,10)
        const tomorrow=new Date()
        
        switch(period){
            case "past":
                filter.date.$lt=today
                break;
            case "present":
                filter.date.$eq=today
                break;
            case "all":
                delete filter.date
                break
            case "future":
                filter.date.$gt=today
                break;
        }
        if(searchTerm){
            filter.description={
                $regex: new RegExp( searchTerm, "i" )
            }
        }
        const results=await Meeting.find( filter )
        res.json( results );
    }
    catch(error){
        error.status = 400;
        next( error );
    }
}
async function modifyUser(req,res,next){
    try{
        const meetingId=req.params.meetingId
        const action=req.params.action
        const userId=res.locals.claims.userId

        if(action==='remove'){
            const result=await Meeting.findByIdAndUpdate(meetingId,{
                $pull:{attendees:{userId:userId}}
            })
            res.json(result)
        }
        if(action==='add'){
            const data=req.body
            let users;

            if( data instanceof Object && Object.keys( data ).length === 0 ) {
                const error = new Error( 'user data is missing' );
                error.status = 400;
                next( error );
            }
        
            if( data instanceof Array ) {
                users = data;
            } else {
                users = [ data ];
            }
            const result=await Meeting.findByIdAndUpdate(meetingId,{
                $addToSet:{attendees:users}
            })
            res.status(201).json(result)
        }   
    }
    catch(error){
        error.status=400
        next(error)
    } 
}

async function addMeeting(req,res,next){
    let attendees=[];
    const userId=res.locals.claims.userId
    const email=res.locals.claims.email
    const meeting=req.body
    let arrayOfEmail=meeting.attendees
    const attendeeFilter={email:{$in:arrayOfEmail}}
    let validAttendees;
    User
    .find(attendeeFilter)
    .exec((error,users)=>{
        if(error){
            error.status=500;
            return next(error)
        }
        validAttendees=users.map(user=>{
            return{
                userId:user._id,
                email:user.email
            }
        })
        if(!validAttendees.find(attendee=>attendee.userId.toString()===userId)){
            validAttendees.push({userId,email})
        }
        meeting.attendees=validAttendees;
        Meeting.create(meeting,(error,createdMeeting)=>{
            if(error){
                error.status=500
                return next(error)
            }
            res.json(createdMeeting)
        })
    })  
}


module.exports={
    getMeetings,
    searchMeetings,
    modifyUser,
    addMeeting
}

