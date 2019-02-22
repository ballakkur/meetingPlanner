const jwt = require('./../library/jwt');
const response = require('./../library/response');
const mongoose = require('mongoose');

const tokenModel = mongoose.model('token');

let authorize = (req, res, next) => {
    // console.log('no?')
    if (req.header('authToken') || req.body.authToken || req.params.authToken || req.query.authToken) {
        let token = req.header('authToken') || req.body.authToken || req.params.authToken || req.query.authToken;
        // console.log('token:',token);
        tokenModel.findOne({ jwt: token })
            .then((data) => {
                // console.log(data);
                if (data) {
                    jwt.verify(token)
                        .then((decode)=>{
                            // console.log(decode);
                            req.user = {
                                userId:decode.data.userId,
                                admin:decode.data.admin,
                                email:decode.data.email
                            }
                            next();
                        })
                        .catch((error) => {
                            // console.log('failed  authorize', error);
                            let apiResponse = response.generate(true, 'failed to authorize', 500, null);
                            res.status(500).send(apiResponse);
                        })
                } else {
                    let apiResponse = response.generate(true, 'invalid token', 404, null);
                    res.status(404).send(apiResponse);
                }
            })

    } else {
        let apiResponse = response.generate(true, 'authToken missing', 401, null);
        res.status(apiResponse.status).send(apiResponse);
    }
}

module.exports = {
    authorize
}