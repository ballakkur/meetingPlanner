const mongoose = require('mongoose');
const shortId = require('short-id');
const response = require('./../library/response');
const token = require('./../library/jwt');


const user = mongoose.model('user');
const auth = mongoose.model('token');

let signUp = (req,res)=>{
    // console.log(req.body);
    let validate = (req,res)=>{
        // console.log(req.body);
        return new Promise((resolve,reject)=>{
            if(req.body.email && req.body.password && req.body.admin && req.body.firstName){
                resolve(req.body);
            }else{
                let apiResponse = response.generate(true,'parameters are missing',404,null);
                // res.status(404).send(apiResponse);
                reject(apiResponse);
            }
            
        })
    }
   let checkExists = (data)=>{
    //    console.log(data);
    return new Promise((resolve,reject)=>{
        user.find({email:data.email})
        .then((data)=>{
            if(data.length>0){
                console.log(data);
                let apiResponse = response.generate(true,'email already exists',409,null);
                reject(apiResponse);
            }else{
                resolve();
            }
        })
        .catch((err)=>{
         console.log(err);
         let apiResponse =response.generate(true,'data base error',500,err.message);
         res.status(500).send(apiResponse);
     })
    })
   }
   let register = ()=>{
       return new Promise((resolve,reject)=>{
           let userName;
           console.log('req.body.admin:',req.body.admin)
           if(req.body.admin === "true"){
                userName = `admin-${req.body.firstName}`;
           }else{
               userName = req.body.firstName;
           }
        let data = new user({
            userId :shortId.generate(),
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            mobile:req.body.mobile,
            email:req.body.email,
            password:req.body.password,
            admin:req.body.admin,
            userName: userName
        });
        data.save()
        .then((result)=>{
            console.log(result);
            result = result.toObject();
            delete result.__v
            delete result._id
            console.log(result);
            let apiResponse = response.generate(false,'user saved',200,result);
            res.status(200).send(apiResponse);
        })
        .catch((err)=>{
            console.log(err);
            let apiResponse =response.generate(true,'data base error',500,err.message);
            // res.status(500).send(apiResponse);
            reject(apiResponse);
        })
       })
   
}
    validate(req,res)
    .then((data)=>checkExists(data))
    .then(()=>register())
    .catch((apiResponse)=>res.status(apiResponse.status).send(apiResponse))
    
}

//login
let login = (req,res)=>{

    let validate = (req,res)=>{
        // console.log(req.body);
        return new Promise((resolve,reject)=>{
            if(req.body.email && req.body.password){
                resolve(req.body);
            }else{
                let apiResponse = response.generate(true,'parameters are missing',404,null);
                reject(apiResponse);
            }
            
        })
    }
    let checkExists = (data)=>{
        //    console.log(data);
        return new Promise((resolve,reject)=>{
            user.find({email:data.email})
            .then((data)=>{
                if(data.length>0){
                    console.log('here',data);
                    resolve();
                }else{
                    let apiResponse = response.generate(true,'user not found',404,null);
                    reject(apiResponse);
                }
            })
            .catch((err)=>{
             console.log(err);
             let apiResponse =response.generate(true,'data base error',500,err.message);
             res.status(500).send(apiResponse);
         })
        })
       }

       //verify password
       let verifyPassword = ()=>{
           return new Promise((resolve,reject)=>{
            user.findOne({$and:[{email:req.body.email},{password:req.body.password}]})
            .then((data)=>{
                console.log('verify',data);
                if(data){
                    resolve(data);
                }else{
                 let apiResponse = response.generate(true,'wrong password',401,null);
                 reject(apiResponse);
                }
             })
            .catch((err)=>{
                console.log(err);
                let apiResponse = response.generate(true,'db error',500,err.message);
                reject(apiResponse);
             });
           })
         
       }
       let tokenize = (data)=>{
           return new Promise((resolve,reject)=>{
               console.log('data here',data);
            token.generate(data)
            .then((tok)=>{
                console.log(tok);
                let userData={
                    data:data,
                    token:tok
                }
                // let apiResponse = response.generate(false,'logged in',200,userData);
                // res.status(200).send(apiResponse);
                resolve(userData);
            })
            .catch((err)=>{
                console.log('na?')
                let apiResponse = response.generate(true,'db error',500,err.message);
                reject(apiResponse);
            })
           })
           
       }
    let saveInDb = (userData)=>{
        return new Promise((resolve,reject)=>{
            console.log('reached here',userData);
            auth.findOne({email:userData.data.email})
            .then((result)=>{
                console.log('found',result);
                if(result){
                    console.log('here?')
                    auth.updateOne({email:userData.data.email},{jwt:userData.token})
                    .then((data)=>{
                            let apiResponse = response.generate(false,'logged in',200,null);
                            res.status(200).send(apiResponse);
                    })
                    .catch((err)=>reject(err))
                }else{
                    console.log('no',userData.token);
                    let newToken = new auth({
                        jwt:userData.token,
                        email:userData.data.email
                    })
                    newToken.save()
                    .then((data)=>{
                        let apiResponse = response.generate(false,'logged in',200,data);
                        res.status(200).send(apiResponse);
                    })
                    .catch((err)=>{
                        let apiResponse = response.generate(true,'db error',500,err.message);
                reject(apiResponse);
                    });
                }
            })
            .catch((err)=>{
                let apiResponse = response.generate(true,'db error',500,err.message);
                reject(apiResponse);
            })
        })
       
    }
    validate(req,res)
    .then((data)=>checkExists(data))
    .then((data)=>verifyPassword(data))
    .then((data)=>tokenize(data))
    .then((data)=>saveInDb(data))
    .catch((apiResponse)=>{
        console.log('error occured here:',apiResponse);;
        res.status(apiResponse.status).send(apiResponse)});
}
//logout
let logout = (req,res)=>{
    console.log('here');
    auth.findOneAndDelete({email:req.user.email})
    .then((data)=>{
        console.log(data);
        let apiResponse = response.generate(false,'logged out',200,null);
        res.status(200).send(apiResponse);
    })
    .catch(err=>{
        console.log(err);
        let apiResponse = response.generate(true,'db error',500,null);
        res.status(apiResponse.status).send(apiResponse);
    });
}
module.exports = {
    signUp,
    login,
    logout
}