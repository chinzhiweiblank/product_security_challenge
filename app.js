const mongoose = require("mongoose");
const expressLayouts = require('express-ejs-layouts');
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// MongoDB Connection
mongoose.connect('mongodb+srv://blackoutzw:blackoutzw@cluster0-joffh.mongodb.net/test?retryWrites=true&w=majority')
mongoose.set('debug', true);
// For Express Layouts
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Process started on port ${PORT}`));
