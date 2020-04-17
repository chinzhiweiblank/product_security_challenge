const express = require("express");
const router = express.Router();
const { check, validationResult, body } = require("express-validator");

// Authentication Imports
const { alrAuth } = require("../auth");
const passport = require("passport");
const bcrypt = require("bcrypt");
const UserSchema = require("../models/userSchema");
const { validateEmail, genResetToken, sendMail } = require("../utils");
const SALT_WORK_FACTOR = 10;

// Email Configurations
const yaml = require("js-yaml");
const fs = require("fs");
const filePath = __dirname + "/../config/test.yml";
const doc = yaml.safeLoad(fs.readFileSync(filePath, "utf8"));
const { senderEmail, password, service, port } = doc;

// Reset Token
const cryptoRandom = require("js-crypto-random");

// CSRF: Attaching a CSRF Token (Randomly generated string)
// Getting CookieParser to parse the cookie for the CSRF token
const csrf = require("csurf");
const cookieParser = require("cookie-parser");

router.use(cookieParser());
const csrfProtection = csrf({ cookie: true });
router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// If user has logged in, redirects to the end
router.get("/login", csrfProtection, alrAuth, (req, res) => {
  res.render("login", { csrfToken: req.csrfToken() });
});

router.post(
  "/login",
  csrfProtection,
  passport.authenticate("local", {
    successRedirect: "/end",
    failureRedirect: "/",
    failureFlash: true,
  })
);

// Forgot
router.get("/forget", csrfProtection, alrAuth, (req, res) => {
  res.render("forget", { csrfToken: req.csrfToken() });
});

router.get("/forgetSuccess", csrfProtection, alrAuth, (req, res) => {
  res.render("forgetSuccess", { csrfToken: req.csrfToken() });
});

router.post(
  "/forget",
  csrfProtection,
  [body("email").isEmail().normalizeEmail()],
  (req, res) => {
    const validationErrors = validationResult(req);
    const email = req.body.email;
    if (validationErrors.array().length > 0) {
      res.render("forget", {
        errors: [{ message: "Email is not valid" }],
        email: email,
        csrfToken: req.csrfToken(),
      });
    } else {
      UserSchema.findOne({
        email: email,
      }).then((user) => {
        if (user) {
          const resetToken = genResetToken(20, 30);
          user.resetToken = resetToken;
          user.save();
          let receiverEmail = email;
          sendMail(
            senderEmail,
            receiverEmail,
            password,
            service,
            port,
            resetToken
          ).then((err) => {
            if (err) {
              res.render("forget", {
                errors: [{ message: "An error has occurred" }],
                email: req.email,
                csrfToken: req.csrfToken(),
              });
            } else {
              res.render("forgetSuccess", {
                csrfToken: req.csrfToken(),
              });
            }
          });
        } else {
          res.render("forget", {
            errors: [{ message: "User with the entered email does not exist" }],
            email: req.email,
            csrfToken: req.csrfToken(),
          });
        }
      });
    }
  }
);

// Reset
router.get("/reset", csrfProtection, alrAuth, (req, res) => {
  res.render("reset", { csrfToken: req.csrfToken() });
});
router.get("/resetSuccess", csrfProtection, alrAuth, (req, res) => {
  res.render("resetSuccess", { csrfToken: req.csrfToken() });
});
router.post(
  "/reset",
  csrfProtection,
  [
    body("resetToken").not().isEmpty().trim(),
    body("password").not().isEmpty().trim(),
  ],
  (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      res.render("reset", {
        errors: [{ message: "Your reset token or your password is invalid" }],
        csrfToken: req.csrfToken(),
      });
    } else {
      const { resetToken, password } = req.body;
      UserSchema.findOne({
        resetToken,
      }).then((user) => {
        if (user) {
          bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
              if (err) throw err;
              user.password = hash;
              user.save();
            });
          });
          res.render("resetSuccess", { csrfToken: req.csrfToken() });
        } else {
          res.render("reset", {
            errors: [{ message: "User did not send reset token" }],
          });
        }
      });
    }
  }
);

// Sign up and signed up
router.get("/signup", csrfProtection, alrAuth, (req, res) => {
  res.render("signup", { csrfToken: req.csrfToken() });
});
router.get("/signedup", csrfProtection, alrAuth, (req, res) => {
  res.render("signedup", { csrfToken: req.csrfToken() });
});

// Sanitization and Error Handling
// Then checking and insertion into MongoDB
// Hashing using Bcrypt
router.post(
  "/signup",
  csrfProtection,
  [
    body("email").isEmail().normalizeEmail(),
    body("username").not().isEmpty().trim().escape(),
    body("password1").isLength({ min: 5 }),
    body("password2").custom((value, { req }) => {
      if (value !== req.body.password1) {
        throw new Error("Password confirmation does not match password");
      }
    }),
  ],
  (req, res) => {
    const { email, username, password1, password2 } = req.body;
    let errors = [];
    const validationErrors = validationResult(req);
    console.log(validationErrors.mapped());
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
          res.render("signup", {
            errors,
            email,
            username,
            password1,
            password2,
          });
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
          res.render("signedup", {csrfToken: req.csrfToken()});
        }
      });
    }
  }
);

router.get("/logout", csrfProtection, (req, res) => {
  req.logout();
  res.redirect("/auth/login", { csrfToken: req.csrfToken() });
});
module.exports = router;
