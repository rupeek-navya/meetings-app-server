const mongoose = require( 'mongoose' );

const teamSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    shortName:{
        type:String
    },
    description:{
        type:String,
        required:true
    },
    members:[
        {
            userId:{
                type:mongoose.Schema.ObjectId,
                required:true
            },
            email:{
                type:String,
                required:true
            }
        }
    ] 
})
mongoose.model( 'team', teamSchema );


