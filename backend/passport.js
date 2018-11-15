'use scrict'
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const opts = {};


opts.jwtFromRequest = ExtractJWT.fromAuthHeaderWithScheme('bearer');
opts.secretOrKey = process.env.SECRET_JWT;

/*var cookieExtractor = function(req) {
  var token = null;
  if (req && req.cookies) token = req.cookies['Authorization'];

  return token;
};*/

module.exports = passport => {
    passport.use(new JWTStrategy(opts, (jwt_payload, done) => {
      console.log('jwt_payload ==',jwt_payload);
       User.findOne({_id: jwt_payload.id})
            .then(user => {
                if(user) {
                    return done(null, user);
                }
                return done(null, false);
            })
            .catch(err => console.error(err));
    }));

  /*  passport.serializeUser((user, done) => done(null, user._id));
    passport.deserializeUser((id, done) => {
      User.findById(id)
        .then(user => {
          console.log(user);
          done(null, user)
        })
        .catch(err => done(err));
    });*/
}
