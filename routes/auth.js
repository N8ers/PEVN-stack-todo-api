const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const router = express.Router()

const db = require('../database/db')

const saltRounds = 10;

// create new user
router.post('/createUser', async (req, res) => {
  let { email, name, password } = req.body;

  // validate inputs

  // validate email is not already in use

  // salt password
  let hashedPW = await bcrypt.hash(password, saltRounds)

  // shove new user data into db
  let setNewUser = `INSERT INTO persons (email, name, password) VALUES ($1, $2, $3)`
  try {
    db.query(setNewUser, [email, name, hashedPW], (error, dbResponse) => {
      if (error) {
        console.log('error: ', error)
        res.status(error.status).json({ message: error.message })
      } else {
        res.sendStatus(200)
      }
    })
  } catch {
    console.log('SORRY something went wrong')
    res.sendStatus(404).json({ message: '/createUser failed' })
  }
})

// login user
router.post('/login', async (req, res) => {
  let { email, password } = req.body;

  // validate inputs

  // check db, does email exist
  let checkForEmail = `SELECT * FROM persons WHERE email = ($1)`
  db.query(checkForEmail, [email], (error, dbResponse) => {
    if (error) {
      console.log('error: ', error)
      res.status(error.status).json({ message: error.message })
    }

    if (!bcrypt.compare(password, dbResponse.rows[0].password)) {
      res.status(404).json({ message: "email or password may be wrong???" })
    }

    res.status(200).json({ user: dbResponse.rows[0] })
  }) 
})

// check for jwt on load

module.exports = router;