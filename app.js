const mongoose = require("mongoose");
var https = require("https");
const expressLayouts = require("express-ejs-layouts");
const express = require("express");
const passport = require("passport");
const session = require("express-session");
const flash = require("connect-flash");
const httpLogger = require("./logger/httpLogger");
const logger = require("./logger/logger");
var privateKey = fs.readFileSync("sslcert/server.key", "utf8");
var certificate = fs.readFileSync("sslcert/server.crt", "utf8");
var credentials = { key: privateKey, cert: certificate };
const yaml = require('js-yaml');
const fs   = require('fs');
const doc = yaml.safeLoad(fs.readFileSync('config/test.yml', 'utf8'));

require("./models/passport")(passport);
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(
  doc.databaseUrl
);
mongoose.set("debug", true);

// For Express Layouts
app.use(httpLogger);
app.use(expressLayouts);
app.set("view engine", "ejs");
app.use(flash());
app.use(
  session({
    secret: "zendesk",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

const PORT = process.env.PORT || 3000;
var httpsServer = https.createServer(credentials, app);
httpsServer.listen(PORT, logger.info(`Process started on port ${PORT}`));
