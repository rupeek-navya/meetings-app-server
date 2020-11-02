require('dotenv').config()
require('./db/init')

const express=require('express')
const indexRouter=require('./routes')
const apiMeetingsRouter =require('./routes/api/meetings')
const apiUsersRouter =require('./routes/api/users')
const apiTeamRouter=require('./routes/api/teams')
const authRouter=require('./routes/api/auth')
const {genericErrorHandler}=require('./middleware/error')
const cors=require('cors')
const app=express()
const port=process.env.PORT || 3000

app.use(cors())

app.use( express.json() );
app.use( express.urlencoded() );

app.use(indexRouter)
app.use( '/api/meetings', apiMeetingsRouter );
app.use( '/api/users', apiUsersRouter );
app.use('/api/teams',apiTeamRouter);
app.use( '/api/auth',authRouter)

app.use(genericErrorHandler)

app.listen(port,(err)=>{
    if(err){
        console.log(err.message)
        return
    }
    console.log(`listening on ${port}`)
})