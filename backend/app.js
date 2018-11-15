'use scrict'
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./db');
const session = require('express-session');
const users = require('./routes/user');
const pins = require('./routes/api');
const cookieParser = require('cookie-parser')
const helmet =require('helmet')
const logger = require("morgan");
const cors = require('cors')
const path = require('path');



mongoose.connect(config.DB, { useNewUrlParser: true }).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}

);



const app = express();



app.use(cookieParser('6xH$*CYY*u44gcUN57%H'));
/////////////////security/////////////////
app.use(helmet.hidePoweredBy({ setTo: 'PHP 4.2.0' }))//change value of X-Powered-By header to given value
//app.use(helmet.noCache({noEtag: true})); //set Cache-Control header
app.use(helmet.noSniff());    // set X-Content-Type-Options header
app.use(helmet.frameguard()); // set X-Frame-Options header
app.use(helmet.xssFilter());  // set X-XSS-Protection header
app.use(helmet.ieNoOpen())

app.use(cors())

app.use(logger("short"));
//app.use(hpp());


app.use(passport.initialize());
app.use(passport.session());


app.use(session({
  cookie: { path: '/', httpOnly: true, maxAge: 36000000 },
  secret: process.env.SECRET_SESSION,
  resave: true,
  name: 'SESS_ID',
  saveUninitialized: true,
}));

require('./passport')(passport);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api/users', users);
app.use('/api/pins', pins);
app.set('trust proxy', 1) // trust first proxy


app.use(express.static(path.join(__dirname, '../frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
