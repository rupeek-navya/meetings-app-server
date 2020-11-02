const jwt=require('jsonwebtoken')
const mongoose=require('mongoose')
const User=mongoose.model('user')

async function sendToken(req,res,next){
    try{
    const credentials=req.body
    User
        .findOne( { email: credentials.email } )
        .exec(( error, result ) => {
            if( error || !result || typeof result !== 'object' || Object.keys( result ).length === 0 ) {
                if( error ) {
                    error.status = 403;
                    return next( error );
                } else {
                    console.log(result)
                    const error = new Error( 'unknown db error' );
                    error.status = 500;
                    return next( error );
                }
            }

            // check match of password
            result.checkPassword( credentials.password, ( err, isMatch ) => {
                if( err ) {
                    err.status = 401;
                    return next( err );
                }

                if( !isMatch ) {
                    // again some error 
                    const err=new Error('password mismatch')
                    err.status=400
                    return next(err); 
                    
                }

                const claims = { email: result.email, userId: result._id };
        
                jwt.sign(claims, process.env.SECRET_KEY, {expiresIn: '24h'}, function( error, token ) {
                   
                    if( error ) {
                        return res.status(401).json({ message: error.message });
                    }

                    res.status(200).json({
                        message: 'Signed in sucessfully',
                        token: token,
                        email: result.email,
                        name: result.name
                    });
                });
            })
        });  
}
catch(err){
    console.error(err)
    return err.message
}
}

async function createUser(req, res, next) {
    const credentials = req.body;
    try{
        User
        .create( credentials, ( error, createdUser ) => {
            if( error ) {
                error.status = 500;
                return next(error);
            }

            res.status( 204 ).send();
        })
    }
    catch(err){
        next(err)
    }
    
    }

module.exports={
    sendToken,
    createUser
}