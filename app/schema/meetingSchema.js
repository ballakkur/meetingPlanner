const mongoose = require('mongoose');

let meetingSchema = new mongoose.Schema({
    meetingId:{
        type:String,
        required:true,
        index:true
    },
    userId:{
        type:String,
        required:true
    },
    meetingTitle:{
        type:String,
        required:true
    },
    meetingDescription:{
        type:String
    },
    dateOfMeet:{
        type:Date,
        required:true
    },
  /*   timeOfMeet:{
        type:Number,//minutes
        required:true
    }, */
    createdOn:{
        type:Date,
        required:true
    },
    updatedOn:{
        type:Date,
        default:Date.now(),
        required:true
    },
    members:[]//[id1,id2,id3,id4]
});

mongoose.model('meeting-user',meetingSchema);