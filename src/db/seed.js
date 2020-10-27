const { execSync } = require( 'child_process' );
const path = require( 'path' );

function seed() {
    try {
        execSync( `mongoimport --db calenderDB --collection meetings --drop --file ${path.join( __dirname, '..', 'data', 'meetings.json' )} --jsonArray` );
    } catch( error ) {
        console.error( `Documents could not be imported be imported` );
    }
}

module.exports = {
    seed
};