const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

const adminSchema = mongoose.Schema({
    login: {type: String},
    password: {type: String}
});

adminSchema.statics.hashofPassword = function(pass) {
    let password = {password: pass};
    let hashpass = jwt.sign(password, 'pro');

    return hashpass;
}

adminSchema.statics.generateToken = function(login, password) {
    var value = {
        login: login,
        password: password
    }
    
    var token = jwt.sign(value, 'pro');

    return token;
}


//                                                               K i r i  sh

adminSchema.statics.verifyAdmin = function(users, body) {
    var object = { isAdmin: false, isModerator: false};
    var distoken = undefined; 

    users.forEach((user) => {
        try{
            distoken = jwt.verify(user.password, 'pro');
        console.log(distoken);
        }
        catch {
        }
        if (distoken) {
            if(user.login == body.login && distoken.password == body.password ) {
                   
                    object.token = jwt.sign({login: user.login, password: user.password}, 'pro')
                           
                        if(user == users[0]){
                            object.isAdmin = true;
                        } 
                        else {
                            object.isModerator = true;
                        }
                        
            }
        }
        else {
            console.log("Distoken Undefined")
        }
    })

    return object;
}



//                                                      T e k s  h i r i  s h

adminSchema.statics.verifyOfAdmin = function(users, token) {
    var object = { isAdmin: false, isModerator: false, userId: undefined};
    var distoken = undefined; 

    users.forEach((user) => {
        try{
            distoken = jwt.verify(token, 'pro');
        }
        catch {

        }
        if (distoken) {
            if(user.login == distoken.login && user.password == distoken.password ) {
                    object.isModerator = true;
                    object.token = jwt.sign({login: user.login, password: user.password}, 'pro');
                    object.userId = user._id;
                    object.userName = user.login;

                        if(user == users[0]){
                            object.isAdmin = true;
                        } 
            }
        }
        else {
            console.log("Distoken Undefined")
        }
    })

    return object;
}



module.exports = mongoose.model('admin', adminSchema);
