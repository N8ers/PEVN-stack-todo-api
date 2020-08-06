const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const router = express.Router()

const db = require('../database/db')

const saltRounds = 10;

router.get('/login', (req, res) => {
  res.json({ message: 'hi Nathan! Log me in!' })
})

// create new user

// login user

// check for jwt on load

module.exports = router;