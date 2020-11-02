const mongoose=require('mongoose')


require('../models/meetings')
require('../models/teams')
require('../models/users')
require('../db/init')

const mongoose=require('mongoose')
var XLSX = require('xlsx')
const Meeting = mongoose.model( 'meeting' );
const User=mongoose.model('user')

function addMeetingWithXL(){
    let attendees=[];
    // const userId=res.locals.claims.userId
    // const email=res.locals.claims.email
    var file=process.argv[2]
    console.log(file)
    var workbook = XLSX.readFile(file)
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let meetings1=[]
    let data={}
    try{
        for(let cell in worksheet){
            const cellString=cell.toString()
            if(cellString[1] !== 'r' && cellString!=='m' && cellString[1]>1){
                if(cellString[0]==='A'){
                    data.date=worksheet[cell].w;
                }  
                if(cellString[0]==='B')
                    data.startTime={'hours':worksheet[cell].v[0],'minutes':worksheet[cell].v[2]};
                if(cellString[0]==='C')
                    data.endTime={'hours':worksheet[cell].v[0],'minutes':worksheet[cell].v[2]};
                if(cellString[0]==='D')
                    data.description=worksheet[cell].v;
                if(cellString[0]==='E')
                    data.name=worksheet[cell].v;
                if(cellString[0]==='F'){
                    data.attendees=worksheet[cell].v.split(',')
                    meetings1.push(data)
                    data={}
                }
            }   
        }
        meetings1.forEach(meeting=>{
            let arrayOfEmail=meeting.attendees
            const attendeeFilter={email:{$in:arrayOfEmail}}
            let validAttendees;
            User
            .find(attendeeFilter)
            .exec((error,users)=>{
                if(error){
                    error.status=500;
                    return error
                }
                validAttendees=users.map(user=>{
                    return{
                        userId:user._id,
                        email:user.email
                    }
                })
                meeting.attendees=validAttendees;
                Meeting.create(meeting,(error,createdMeeting)=>{
                    if(error){
                        error.status=500
                        return error
                    }
                    console.log(createdMeeting)
                })
            })
        })
    }
    catch(err){
        console.error(err)
        next(err)
    }

}