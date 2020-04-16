const express = require("express");
const router = express.Router();
const { alrAuth } = require("../auth");
const passport = require("passport");
const bcrypt = require("bcrypt");
const UserSchema = require("../models/userSchema");
const validateEmail = require("../utils");
const SALT_WORK_FACTOR = 1;
// For Mongodb to work
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// If user has logged in, redirects to the end
router.get("/login", alrAuth, (req, res) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/end",
    failureRedirect: "/",
    failureFlash: true,
  })
);

// Sign up and signed up
router.get("/signup", alrAuth, (req, res) => {
  res.render("signup");
});
router.get("/signedup", alrAuth, (req, res) => {
  res.render("signedup");
});

router.post("/signup", (req, res) => {
  const { email, username, password1, password2 } = req.body;
  let errors = [];

  if (!email || !username || !password1 || !password2) {
    errors.push({ messsage: "All required fields are not filled in." });
  }
  if (!validateEmail(email)) {
    errors.push({ message: "Email not valid" });
  }
  if (password1 !== password2) {
    errors.push({ message: "Reconfirm that your passwords match" });
  }
  if (errors.length > 0) {
    res.render("signup", { errors, email, username, password1, password2 });
  } else {
    UserSchema.findOne({
      email: email,
      username: username,
      password: password1,
    }).then((user) => {
      if (user) {
        errors.push({ message: "Username already taken" });
        res.render("signup", { errors, email, username, password1, password2 });
      } else {
        const newUser = new UserSchema({
          email: email,
          username: username,
          password: password1,
          active: true,
        });
        bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser.save();
          });
        });
        res.redirect("/auth/signedup");
      }
    });
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});
module.exports = router;
