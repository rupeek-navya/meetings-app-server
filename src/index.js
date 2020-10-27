require('./db/init')

const express=require('express')
const indexRouter=require('./routes')
const apiMeetingsRouter =require('./routes/api/meetings')
const {genericErrorHandler}=require('./middleware/error')

const app=express()

const port=process.env.PORT || 3000

app.use( express.json() );
app.use( express.urlencoded() );
app.use(indexRouter)
app.use( '/api/meetings', apiMeetingsRouter );
app.use(genericErrorHandler)
app.listen(port,(err)=>{
    if(err){
        console.log(err.message)
        return
    }
    console.log(`listening on ${port}`)
})