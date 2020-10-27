const mongoose = require( 'mongoose' );
const Meeting = mongoose.model( 'meeting' );



async function getMeetings(req,res,next){
    try{
        const date=req.query.date
        const userId=req.query.userId
        if(date && userId)
        {
           const meetings=await Meeting.find({
               "attendees.userId":userId,
               date:date
           })
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
        const userId=req.query.userId
        const filter={date:{},attendees:{$elemMatch:{}}}
        if(userId){
            filter.attendees.$elemMatch.userId=userId
        }
        const today=new Date()
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
        const userId=req.query.userId

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
            console.log(users)
            const result=await Meeting.findByIdAndUpdate(meetingId,{
                $addToSet:{attendees:{users}}
            })
            res.status(201).json(result)
        }   
    }
    catch(error){
        error.status=400
        next(error)
    } 
}


module.exports={
    getMeetings,
    searchMeetings,
    modifyUser
}

