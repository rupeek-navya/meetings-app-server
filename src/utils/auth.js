const jwt = require( 'jsonwebtoken' );

function authenticate(req,res,next){
    const token=req.header('Authorization')
    if(!token){
        const error = new Error( 'Token is not sent' );
        error.status = 401;
        
        next( error );
        
        return;
    }
    jwt.verify(token,process.env.SECRET_KEY,(err,claims)=>{
        if( err ) {
            const error = new Error( 'Go away intruder' );
            error.status = 401;
            
            return next( error );
        }
        res.locals.claims=claims
        next()
    })
}

module.exports={
    authenticate
}