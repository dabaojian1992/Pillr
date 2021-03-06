const express = require("express");
const passport = require('passport');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const User = require('../../models/User');
const validateRegisterInput = require('../../validation/register');
const validateLoginInput = require('../../validation/login');

router.get("/test", (req, res) => res.json({ msg: "This is the users route" }));

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = "User already exists";
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(user => {
              
              const payload = { id: user.id, username: user.username };
              ;
              jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
                res.json({
                  success: true,
                  token: "Bearer " + token
                });
              });
            })
            .catch(err => console.log(err));
        });
      });
    }
  });
});

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.email = "This user does not exist";
      return res.status(400).json(errors);
    }
    ;

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = { id: user.id, username: user.username, email: user.email, rooms: user.rooms_subscribe_to };

        jwt.sign(payload, keys.secretOrKey, { expiresIn: 3600 }, (err, token) => {
          res.json({
            success: true,
            token: "Bearer " + token
          });
        });
      } else {
        errors.password = "Incorrect password";
        return res.status(400).json(errors);
      }
    });
  });
});

router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
  // ;
  // // User.findOne({ email: req.body.email }).then(user => {
  // //  ROOMS = ["hi"];
  //  JSON = ({
  //   id: req.user.id,
  //   username: req.user.username,
  //   email: req.user.email,
    

  // });

  // User.findById(req.user.id )
  //   .populate({ path: 'rooms_subscribe_to' })
  //   .then(user => {
  //     let rooms = []
  //     // user.rooms.forEach(room =>{
  //     //   ;
  //     // })
  //     JSON.rooms = (user.rooms_subscribe_to)
  //     
  //     return res.json(JSON)
  //   })
  //   ;
  return res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    rooms: ROOMS

  });
})
router.get('/user', (req, res) => {
  ;
 let rooms = [];
  User.findOne({ email: req.body.email })
    .populate({ path: 'rooms_subscribe_to'})
    .exec().then(user => {
    
  })
  res.json({
    id: req.user.id,
    username: req.user.username,
    email: req.user.email,
    rooms: req.user.rooms_subscribe_to
  });
})
module.exports = router;