/** 
*
*  @author: Mr_Wei 
*  @version: 1.0.0 
*  @description: 验证token是否合法
*  @Date: 2019/10/17 10:42  
*
*/ 

const User = require("../dbModel/user");
const Admin = require("../dbModel/admin");
const Key = require("../secret/jwtkey").KEYORSECRET;
const JwtStrategy = require('passport-jwt').Strategy,
      ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = Key;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        User.findById(jwt_payload.id)
                .then(user => {
                    if (user) {
                        return done(null, user);
                    } else {
                        Admin.findById(jwt_payload.id)
                                .then(admin => {
                                    if(admin){
                                        return done(null, admin);
                                    }else{
                                        return done(null, false);
                                        // or you could create a new account
                                    }
                                })
                    }
                })
    }));
}