const mongoose = require( 'mongoose' );
const Team=mongoose.model('team')
const User=mongoose.model('user')
async function getTeams(req,res,next){
    try{
        const userId=res.locals.claims.userId
        if(userId)
        {
           const teams=await Team.find({
               "members.userId":userId
           })
           res.status(200).json(teams)
        }
    }
    catch(error){
        error.status=404
        next(error)
        return;
    }
}

async function addTeam(req,res,next){
    const userId=res.locals.claims.userId
    const email=res.locals.claims.email
    const team=req.body
    let arrayOfEmail=team.members
    const memberFilter={email:{$in:arrayOfEmail}}
    let validMembers;
    User
    .find(memberFilter)
    .exec((error,users)=>{
        if(error){
            error.status=500;
            return next(error)
        }
        validMembers=users.map(user=>{
            return{
                userId:user._id,
                email:user.email
            }
        })
        if(!validMembers.find(member=>member.userId.toString()===userId)){
            validMembers.push({userId,email})
        }
        team.members=validMembers;
        Team.create(team,(error,createdMeeting)=>{
            if(error){
                error.status=500
                return next(error)
            }
            res.json(createdMeeting)
        })
    })  
}

async function modifyTeam(req,res,next){
    try{
        const teamId=req.params.teamId
        const action=req.params.action
        const userId=res.locals.claims.userId
        const email=req.query.email

        if(action==='remove'){
            const result=await Team.findByIdAndUpdate(teamId,{
                $pull:{members:{userId:userId}}
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
            const result=await Team.findByIdAndUpdate(teamId,{
                $addToSet:{members:users}
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
    getTeams,
    addTeam,
    modifyTeam
}