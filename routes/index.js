const express = require('express');
const router = express.Router();
const { checkAuth,alrAuth } = require('../auth.js');

router.get('/', alrAuth, (req, res) => res.render("cover"));
router.get('/end', checkAuth, (req, res) => res.render("end"));

module.exports = router;