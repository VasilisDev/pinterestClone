'use scrict'
const mongoose = require('mongoose');
const findOrCreate = require('findorcreate-promise');

mongoose.Promise = global.Promise;
const Schema = mongoose.Schema;

const PinSchema = new Schema({
  url: String,
  description: String,
  addedBy: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  likedBy: [{
  type: Schema.Types.ObjectId,
  ref: 'users'
}],
  addedOn: {
    type: Date,
    default: Date.now(),
  }
});

PinSchema.plugin(findOrCreate);
const Pin = mongoose.model('pin', PinSchema);

module.exports = Pin;
