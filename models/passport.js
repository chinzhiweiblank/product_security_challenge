const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Load User model
const User = require('../models/userSchema');

module.exports = function(passport) {
  passport.use(
    new LocalStrategy( (username, password, done) => {
      User.findOne({
        username: username
      }).then(user => {

        if (user === null) {
          return done(null, false, { message: 'Username does not exist' });
        }

        bcrypt.compare(password, user.password, (err, isMatch) => {
          console.log(isMatch)
          if (isMatch) return done(null, user);
          else  return done(null, false, { message: 'Password incorrect' });
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
};