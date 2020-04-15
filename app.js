const mongoose = require("mongoose");
const flash = require("connect-flash");
const session = require("express-session");
const express = require("express");
const app = express();

//require("./passport")(passport);

mongoose.connect("mongodb://localhost/zendesk");
app.use(express.static(__dirname+'/project/assets/main.css'));
app.use("/login", function(req, res) {res.sendFile(__dirname+'/project/index.html')});
app.use('/signup', function(req, res) {res.sendFile(__dirname+'/project/signup.html')})


const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Process started on port ${PORT}`));
