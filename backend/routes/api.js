'use scrict'
const express = require('express');
const router =  express.Router();
const Pin = require('../models/pimage');
const User = require('../models/User');
const passport = require('passport');
const moment =require('moment');
const validatePinInput = require('../validation/pinValidation');


router.get('/all', (req, res) => {
  console.log("get all")
  Pin.find({})
    .populate('addedBy')
    .sort({ addedOn: -1 })
    .then(pins => res.json(pins))
    .catch(err => {
      console.log(err);
      res.json({ error: 'Pins could not be retrieved' });
    });
});

router.get('/user',passport.authenticate('jwt', { session: false }),(req, res) => {
    const { user } = req;
    console.log(user)
    Pin.find({ addedBy: user._id })
      .populate('addedBy')
      .sort({ addedOn: -1 })
      .then(pins =>res.json(pins))
      .catch(err => {
        console.log(err);
        res.json({ error: 'Pins could not be retrieved' });
      });

});

router.post( '/add',passport.authenticate('jwt', { session: false }), (req, res) => {

  const { errors, isValid } = validatePinInput(req.body);

  if(!isValid) {
      return res.status(400).json(errors);
  }

   const { url, description } = req.body;
   const { user } = req;
console.log("add")
User.findById(user._id)
  .then(user => {

    const pin = new Pin({ url, description, addedBy: user, addedOn:moment() });

    pin.save()
       .then(results => res.json(results))
       .catch(err => {
         console.log(err);
         res.json({ error: 'Pin could not be saved' });
       });
   })
   .catch(err => {
     console.log(err);
     res.json({ error: 'User could not be retrieved' })
   });
});

router.delete( '/delete/:pinId*?',passport.authenticate('jwt', { session: false }), (req,res) => {
    const { url, description } = req.body;
    const { user } = req;
    const { pinId } = req.params;

    Pin.findById(pinId)
      .populate('addedBy')
      .then(pin => {
        const { addedBy } = pin;
        if (user._id.toString() !== addedBy._id.toString()) return res.json({ error: 'You cannot delete another user\'s pins' });
        pin.remove()
          .then(deletedPin => res.json(deletedPin._id))
          .catch(err => {
            console.log(err);
            res.json({ error: 'Pin could not be deleted' });
          })
      })
      .catch(err => {
        console.log(err);
        res.json({ error: 'Pin could not be retrieved' });
      });

});

router.put( '/like/:pinId*?',passport.authenticate('jwt', { session: false }), (req,res) => {



    const { url, description } = req.body;
    const { user } = req;
    const { pinId } = req.params;

    Pin.findById(pinId)
      .populate('likedBy')
      .populate('addedBy')
      .then(pin => {
        const { likedBy } = pin;
        const index = pin.likedBy.findIndex(likedByUser => likedByUser._id.toString() === user._id.toString());

        if (index !== -1) return res.json({ error: 'User already liked this pin' });

        pin.likedBy.push(user);
        pin.save()
          .then(savedPin => res.json(savedPin) )
          .catch(err => {
            console.log(err);
            res.json({ error: 'Pin could not be updated' });
          })
      })
      .catch(err => {
        console.log(err);
        res.json({ error: 'Pin could not be retrieved' });
      });

});

router.put( '/unlike/:pinId*?', passport.authenticate('jwt', { session: false }),(req,res) => {


  const { url, description } = req.body;
   const { user } = req;
   const { pinId } = req.params;

   Pin.findById(pinId)
     .populate('likedBy')
     .populate('addedBy')
     .then(pin => {
       const { likedBy } = pin;


       const index = pin.likedBy.findIndex(likedByUser =>likedByUser._id.toString() === user._id.toString());

       if (index === -1) return res.json({ error: 'User must already have liked the pin' });


       pin.likedBy.splice(index, 1);
       pin.save()
         .then(savedPin => res.json(savedPin))
         .catch(err => {
           console.log(err);
           res.json({ error: 'Pin could not be updated' });
         })
     })
     .catch(err => {
       console.log(err);
       res.json({ error: 'Pin could not be retrieved' });
     });
});


module.exports = router;
