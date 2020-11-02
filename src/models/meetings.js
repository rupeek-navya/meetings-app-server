const mongoose = require( 'mongoose' );

const attendeSchema=new mongoose.Schema({
    userId:{
        type:mongoose.Schema.ObjectId,
        required:true
    },
    email:{
        type:String,
        required:true
    }
},{_id:false})

const meetingSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true,
        minlength:10
    },
    date:{
        type:Date,
        required:true
    },
    startTime:{
        hours:{
            type:Number,
            min:0,
            max:23,
            required:true
        },
        minutes:{
            type:Number,
            min:0,
            max:59,
            required:true
        }
    },
    endTime:{
        hours:{
            type:Number,
            min:0,
            max:23,
            required:true
        },
        minutes:{
            type:Number,
            min:0,
            max:59,
            required:true
        }
    },
    attendees:{
        type:[attendeSchema],
        required:true
    }
})

mongoose.model( 'meeting', meetingSchema );
   