const jwt = require('jsonwebtoken');
const id =  require('short-id');
const companySecret = 'admin@3embed';

let generate = (data)=>{
    return new Promise((resolve,reject)=>{
        try{
            let payload = {
                jwtId : id.generate(),
                data:data
            }
          let  token =jwt.sign(payload,companySecret);
          resolve(token);
        }catch(err){
            console.log('jwt error',err);
            reject(err);
        }
        
    })
}

//verify
let verify = (token)=>{
    return new Promise((resolve,reject)=>{
        jwt.verify(token,companySecret,(err,data)=>{
            if(err){
                console.log('verify error',err.JsonWebTokenError);
            reject(err);
            }else{
                // console.log(data);
                resolve(data);
            }
        })
      
    })
}
//test
/* generate({firstName:'karthik',lastName:'rao',email:'new@gmail'})
.then((data)=>console.log(data)); */

// verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RJZCI6Ijc5N2I2OCIsImRhdGEiOnsiZmlyc3ROYW1lIjoia2FydGhpayIsImxhc3ROYW1lIjoicmFvIiwiZW1haWwiOiJuZXdAZ21haWwifSwiaWF0IjoxNTQ5MzQ4ODg4fQ.dOYGrHvDE3oDGBDj3p3wIF1GiUh5RE_J8zsvBQvWFG4')
module.exports = {
    verify,
    generate
}