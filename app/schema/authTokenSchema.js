const mongoose = require('mongoose');

let tokenSchema = new mongoose.Schema({
    jwt:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true
    }
})

mongoose.model('token',tokenSchema);