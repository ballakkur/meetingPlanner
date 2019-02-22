const adminController = require('./../controller/adminController');
const auth = require('./../middleware/authorization');

module.exports.setRouter = (app) => {
    app.get('/admin/list/users',auth.authorize,adminController.listUsers);
    app.post('/admin/schedule/meeting',auth.authorize,adminController.scheduleMeeting);
    app.get('/admin/meeting',auth.authorize,adminController.listMeeting);
    app.delete('/admin/meeting/:meetingId',auth.authorize,adminController.deleteMeeting);
    app.put('/admin/meeting/:meetingId',auth.authorize,adminController.updateMeeting);
    //regular user
    app.get('/user/meeting/:userId',auth.authorize,adminController.listMyMeeting);
}
