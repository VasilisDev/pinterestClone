'use scrict'
const mongoose = require('mongoose');
const findOrCreate = require('findorcreate-promise');


mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    },
  resetPasswordExpires:{
    type: Date
  },
  resetPasswordToken:{
    type:String
  },
  country:{
    type:String
  }
});

UserSchema.plugin(findOrCreate);
const User = mongoose.model('users', UserSchema);

module.exports = User;
