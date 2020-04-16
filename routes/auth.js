const express = require("express");
const router = express.Router();
const { alrAuth } = require("../auth");
const bodyParser = require("body-parser");
const UserSchema = require("../models/userSchema");
const validateEmail = require("../utils");

// Disable objects loaded into URL
router.use(express.urlencoded({ extended: true }));
router.use(express.json());
// If user has logged in, redirects to the end
router.get("/login", alrAuth, (req, res) => {
  res.render("login");
});
router.get("/signup", alrAuth, (req, res) => {
  res.render("signup");
});
router.get("/signedup", alrAuth, (req, res) => {
  res.render("signedup");
});
// Register Page
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
    const password = password1;
    console.log("PASSWORD!", password);
    UserSchema.findOne(
      {
        email: email,
        username: username,
        password: password,
      },
    ).then((user) => {
      if (user) {
        errors.push({ message: "Username already taken" });
        res.render("signup", { errors, email, username, password1, password2 });
      } else {
        const user = new UserSchema({
          email: email,
          username: username,
          password: password1,
          active: true,
        });
        user.save();
        res.redirect("/auth/signedup");
      }
    });
  }
});


module.exports = router;
