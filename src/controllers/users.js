const mongoose = require( 'mongoose' );
const User = mongoose.model( 'user' );

async function getAllUsers(req,res,next){
    try{
        const users=await User.find({})
        res.status(200).json(users)
    }
    catch(error){
        next(error)
    }
}
async function findIdByEmail(req,res,next){
    try{
        const mail=await User.find({email:req.params.email})
        res.status(200).json(mail)
    }
    catch(error){
        next(error)
    }
}

module.exports={
    getAllUsers,
    findIdByEmail
}