require('../db/init')

const mongoose = require( 'mongoose' );
var XLSX = require('xlsx')
const Team = mongoose.model( 'team' );
const User=mongoose.model('user')

function addTeamsWithXL(){
    var file=process.argv[2]
    console.log(file)
    var workbook = XLSX.readFile(file)
    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
    let teams1=[]
    let data={}
    try{
        for(let cell in worksheet){
            const cellString=cell.toString()
            if(cellString[1] !== 'r' && cellString!=='m' && cellString[1]>1){
                if(cellString[0]==='A'){
                    data.name=worksheet[cell].v;
                }  
                if(cellString[0]==='B')
                    data.shortName=worksheet[cell].v;
                if(cellString[0]==='C')
                    data.description=worksheet[cell].v;
                if(cellString[0]==='D'){
                    data.members=worksheet[cell].v.split(',')
                    teams1.push(data)
                    data={}
                }
            }   
        }
        teams1.forEach(team=>{
            let arrayOfEmail=team.members
            const membersFilter={email:{$in:arrayOfEmail}}
            let validMembers;
            User
            .find(membersFilter)
            .exec((error,users)=>{
                if(error){
                    error.status=500;
                    return error
                }
                validMembers=users.map(user=>{
                    return{
                        userId:user._id,
                        email:user.email
                    }
                })
                team.members=validMembers;
                Team.create(team,(error,createdTeam)=>{
                    if(error){
                        error.status=500
                        return error
                    }
                    console.log(createdTeam)
                })
            })
        })
    }
    catch(err){
        console.error(err)
        return err
    }

}
addTeamsWithXL()