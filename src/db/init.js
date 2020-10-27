const mongoose=require('mongoose')
const {seed} = require('./seed')

require('../models/meetings')
require('../models/teams')
require('../models/users')

const uri='mongodb://localhost:27017/calenderDB'

mongoose.set( 'useFindAndModify', false );
mongoose.set( 'returnOriginal', false );

mongoose.connect(uri,{useNewUrlParser:true})

mongoose.connection.on('open',()=>{
    console.log('connected to db')
    // seed()
})
mongoose.connection.on('error',(err)=>{
    console.log(err.message)
    process.exit()
})