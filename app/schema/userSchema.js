const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    
    userId: {
        type:String,
        required:true,
        unique:true
    },
    firstName: {
        type:String,
        require:true
    },
    lastName: {
        type:String
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    admin:{
        type:Boolean,
        default:false,
        required:true
    },
    userName:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true,
        minlength:6
    },
    mobile:{
        type:Number,
        minlength: 10,
        maxlength: 10
    }
})

mongoose.model('user',userSchema);