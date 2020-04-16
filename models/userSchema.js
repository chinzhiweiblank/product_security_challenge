const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});
/*
UserSchema.pre('save', function (next) {
  var user = this;

  // Hash password only when modified
  if (!user.isModified("password")) return next();

  // Generate a salt using a factor of 10
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);

    // Hashing password
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);

      // User password becomes the hashed
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};*/

module.exports = mongoose.model('User', UserSchema);