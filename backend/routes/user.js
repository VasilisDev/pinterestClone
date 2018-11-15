'use scrict'
const express = require('express');
const router = express.Router();
const app    = express();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const async = require('async');
const crypto = require('crypto');
const validateRegisterInput = require('../validation/register');
const validateLoginInput = require('../validation/login');
const validateResetInput = require('../validation/reset');
const validateResetPasswordInput = require('../validation/resetPassword');
const nodemailer = require('nodemailer');
const RateLimit = require('express-rate-limit');
var geoip = require('geoip-lite');


const User = require('../models/User');

var loginLimiter = new RateLimit({
  windowMs: 15*60*1000, // 15 minutes
  max: 10,
  message:{block:"Too many requests from this IP, please try again after an 15 minutes"}
});


router.post('/register', (req, res)=> {

  var ip = req.headers['x-forwarded-for'].split(',')[0] || req.connection.remoteAddress;
  var geo = geoip.lookup(ip);

    const { errors, isValid } = validateRegisterInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }
    User.findOne({
        email: req.body.email
    }).then(user => {
        if(user) {
            return res.status(400).json({
                email: 'Email already exists'
            });
        }
        else {
            const newUser = new User({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                country: geo.country
                                        });

            bcrypt.genSalt(10, (err, salt) => {
                if(err) console.error('There was an error', err);
                else {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) console.error('There was an error', err);
                        else {
                            newUser.password = hash;
                            newUser
                                .save()
                                .then(user => {
                                    res.json(user)
                                });
                        }
                    });
                }
            });
        }
    });
});

router.post('/login',loginLimiter, (req, res) => {

    const { errors, isValid } = validateLoginInput(req.body);

    if(!isValid) {
        return res.status(400).json(errors);
    }

    const email = req.body.email;
    const password = req.body.password;

    User.findOne({email})
        .then(user => {
            if(!user) {
                errors.badCredentials = 'Incorrect Password or Email'
                return res.status(404).json(errors);
            }
            bcrypt.compare(password, user.password)
                    .then(isMatch => {
                        if(isMatch) {
                            const payload = {
                                id: user.id,
                                name: user.name,
                                code:user.country
                                                          }
                            jwt.sign(payload, process.env.SECRET_JWT, {
                                expiresIn: 3600
                            }, (err, token) => {
                                if(err) console.error('There is some error in token', err);
                                else {
                                  console.log(token)
                              //    res.cookie('bearer',token);
                                    res.json({
                                        success: true,
                                        token:`bearer ${token}`
                                    });
                                }
                            });
                        }
                        else {
                            errors.badCredentials = 'Incorrect Password or Email';
                            return res.status(401).json(errors);
                        }
                    });
        });
});

router.post('/forgot', (req, res, next) => {
 console.log("forgot")
  const email = req.body.email;
  const { errors, isValid } = validateResetInput(req.body);
  if(!isValid) {
      return res.status(400).json(errors);
  }
  console.log(req.body)
  async.waterfall([
     (done) => {
      crypto.randomBytes(20, function (err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
  (token, done) => {
      User.findOne({ email},(err, user)=> {
        if (!user) {
          console.log("no user")
          errors.email = 'User not found'
          return res.status(404).json(errors);
        }
        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

      console.log(user.resetPasswordExpires)

        user.save((err) => {
          done(err, token, user);
        });
      });
    },
     (token, user, done) => {
      var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
      //  host: process.env.MAIL_HOST,
        port: 3306,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD
        }
      });
      var mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject: 'Password Reset',
        text: 'This email allows you to change your password.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + /*req.headers.host*/'localhost:3000' + '/reset/' + token + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
      };
      smtpTransport.sendMail(mailOptions,(err)=> {
      res.json({info:'An e-mail has been sent to ' + user.email + ' with a link to change the password.'});
        done(err, 'done');
      });
    }
  ],(err)=> {
    if (err) return next(err);
  });
});

router.get('/reset/:token',(req, res)=> {
  console.log("get Reset")
  console.log(req.params.token+"now"+ Date.now())
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, (err, user)=> {
    console.log(user)
    if (!user) {
      return res.json({error:'Password reset token is invalid or has expired.'});
    }
  });
});

router.post('/reset',(req, res)=> {
  console.log(req.body)
  const {token}=req.body.token
  console.log(token)

  const passwordValidate={
     password:req.body.password,
     password_confirm:req.body.password_confirm
  };
  console.log(passwordValidate)

  const { errors, isValid } = validateResetPasswordInput(passwordValidate);
  if(!isValid) {
      return res.status(400).json(errors);
  }

  async.waterfall([
     (done) => {
      User.findOne({ resetPasswordToken: token, resetPasswordExpires: { $gt: Date.now() } },(err, user)=> {
      console.log(user)
        if (!user) {
          res.json({error:'Password reset token is invalid or has expired.'});
        }
        bcrypt.genSalt(10, (err, salt) => {
            if(err) console.error('There was an error', err);
            else {
                bcrypt.hash(req.body.password, salt, (err, hash) => {
                    if(err) console.error('There was an error', err);
                    else {
                       console.log(user)
                        user.resetPasswordToken = undefined;
                        user.resetPasswordExpires = undefined;
                        user.password = hash;
                        user
                            .save(err=>{
                              done(err, user);


                            })
                    }
                });
            }
        });
  });
},
  (user, done) => {
      var smtpTransport = nodemailer.createTransport({
        service: 'gmail',
      //  host: process.env.MAIL_HOST,
        port: 3306,
        secure: false,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.PASSWORD,
        }
      });
      var mailOptions = {
        to: user.email,
        from: process.env.EMAIL,
        subject: 'Password Reset',
        text: 'Hello,\n\n' +
        'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions,(err)=> {
        res.json({'message':'Success! Your password has been changed.'});
        done(err);
      });
    }
  ], (err) => {
  });
});

///////////////////////////////////////////////////////////////////////////////////////////////////////


module.exports = router;
