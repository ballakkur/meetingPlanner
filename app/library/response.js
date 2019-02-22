let generate = (err,message,status,data)=>{
 let response = {
     err,
     message,
     status,
     data
 }
 return response;
}


module.exports = {
    generate
}