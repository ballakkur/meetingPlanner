const mongoose = require('mongoose');
const id = require('short-id');
const response = require('../library/response');

let user = mongoose.model('user');
let meetingUser = mongoose.model('meeting-user');

let listUsers = (req, res) => {
    console.log(req.body, req.user);
    if (req.user.admin) {
        user.find()
            .limit(25)
            .select('-_id -__v -password')
            .then((data) => {
                if (data) {
                    let apiResponse = response.generate(false, 'listed users', 200, data);
                    res.status(200).send(apiResponse);
                } else {
                    let apiResponse = response.generate(false, 'no users yet!', 404, null);
                    res.status(404).send(apiResponse);
                }

            })
            .catch((err) => {
                let apiResponse = response.generate(true, 'db error', 500, err.message);
                res.status(200).send(apiResponse);
            })
    } else {
        let apiResponse = response.generate(false, 'you need admin rights', 403, null);
        res.status(403).send(apiResponse);
    }
}

let scheduleMeeting = (req, res) => {


    //data to be sent in this format
    /* 
    {
"meetingTitle":"some meeting",
"meetingDescription":"some description for the meeting",
"dateOfMeet":"02/08/2019 12:52:32 PM",
"member":["4929bf","fa1d80"]
}
     */
    /*  user.findOne({userId:{$in:["fa1d80","4929bf","naaa"]}})
     .then((data)=>{
         console.log(data);
     })
     .catch((err)=>{
         console.log(err);
     }) */
    if (req.user.admin) {
        let meetDate = new Date(req.body.dateOfMeet);
        console.log(meetDate);
        /* let meeters=[];
        for (let x in req.body.member){
            // console.log('each member',req.body.member[x]);
            meeters.push(req.body.member[x]);
        }
        console.log(meeters); */
        // console.log("string",meetDate.toString());
        if (new Date() < meetDate) {
            let scheduleMeet = new meetingUser({
                userId: req.user.userId,
                meetingId: id.generate(),
                meetingTitle: req.body.meetingTitle,
                meetingDescription: req.body.meetingDescription,
                createdOn: Date.now(),
                dateOfMeet: meetDate,
                // members:meeters
                members: req.body.members
            })
            scheduleMeet.save()
                .then((data) => {
                    console.log(data);
                    let apiResponse = response.generate(false, 'meeting scheduled', 200, data);
                    res.status(200).send(apiResponse);
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            // console.log(req.body);
            // console.log(req.body.member);
            let apiResponse = response.generate(true, 'date and time already passed', 422, null);
            res.status(422).send(apiResponse);
        }
    } else {
        let apiResponse = response.generate(false, 'you need admin rights', 403, null);
        res.status(403).send(apiResponse);
    }


}

let deleteMeeting = (req, res) => {

    if (req.user.admin) {
        meetingUser.findOneAndDelete({ meetingId: req.params.meetingId })
            .then((result) => {
                console.log(result);
                if (result) {
                    let apiResponse = response.generate(false, 'meeting removed', 200, null);
                    res.status(200).send(apiResponse);
                } else {
                    let apiResponse = response.generate(false, 'nothing to remove', 200, null);
                    res.status(200).send(apiResponse);
                }
            })
            .catch((err) => {
                console.log(err);
            })
    } else {
        let apiResponse = response.generate(false, 'you need admin rights', 403, null);
        res.status(403).send(apiResponse);
    }
}

let listMeeting = (req, res) => {

    if (req.user.admin) {
        meetingUser.find()
            .select('-_id,-_v')
            .then((data) => {
                console.log(data);
                let apiResponse = response.generate(false, 'meetings listed', 200, data);
                res.status(200).send(apiResponse);
            })
            .catch((err) => {
                console.log(err);
                let apiResponse = response.generate(true, 'db error', 500, err.message);
                res.status(500).send(apiResponse);
            })
    } else {
        let apiResponse = response.generate(false, 'you need admin rights', 403, null);
        res.status(403).send(apiResponse);
    }
}

//you will come here to refer this again
let updateMeeting = (req, res) => {

    if (req.user.admin) {
        if (req.body.dateOfMeet) {
            let meetDate = new Date(req.body.dateOfMeet);
            if (new Date() > meetDate) {
                let apiResponse = response.generate(true, 'date and time already passed', 422, null);
                res.status(422).send(apiResponse);
                return;
            }
        }
        let update = {
            // meetingTitle:req.body.meetingTitle,
            // meetingDescription:req.body.meetingDescription,
            // dateOfMeet:req.body.dateOfMeet,
            // members:req.body.member
            updatedOn: Date.now(),
            $set: req.body
        }
        meetingUser.findOneAndUpdate({ meetingId: req.params.meetingId }, update)
            .then((data) => {
                console.log(data);
                let apiResponse = response.generate(false, 'updated', 200, null);
                res.status(200).send(apiResponse);
            })
            .catch((err) => {
                console.log(err);
                let apiResponse = response.generate(true, 'db error', 500, err.message);
                res.status(500).send(apiResponse);
            })
    } else {
        let apiResponse = response.generate(false, 'you need admin rights', 403, null);
        res.status(403).send(apiResponse);
    }
}

let listMyMeeting = (req, res) => {

    meetingUser.find({ members: { $elemMatch: { $eq: req.params.userId } } })
        .select('-_id,-_v')
        .then((data) => {
            console.log(data);
            if (data) {
                let apiResponse = response.generate(false, 'meetings listed', 200, data);
                res.status(200).send(apiResponse);
            } else {
                let apiResponse = response.generate(false, 'no meetings', 200, null);
                res.status(200).send(apiResponse);
            }
        })
        .catch((err) => {
            console.log(err);
            let apiResponse = response.generate(true, 'db error', 500, err.message);
            res.status(500).send(apiResponse);
        })
}
module.exports = {
    listUsers,
    listMeeting,
    scheduleMeeting,
    deleteMeeting,
    updateMeeting,
    //for normal users
    listMyMeeting
}