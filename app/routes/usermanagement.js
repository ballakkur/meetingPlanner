const userController = require('../controller/userController');
const auth = require('./../middleware/authorization');


module.exports.setRouter = (app) => {

    app.post('/signUp',userController.signUp );
    app.post('/login',userController.login);
    app.get('/logout',auth.authorize ,userController.logout);
    
}
