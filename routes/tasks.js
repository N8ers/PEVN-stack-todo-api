const express = require('express')
const router = express.Router()

const jwtValidator = require('../jwtValidation')
const db = require('../database/db')

router.get('/getTasks', jwtValidator.validateJWT, (req, res) => {
  let userData = req.body.user

  let query = `SELECT * FROM tasks WHERE user_id = ($1)`

  db.query(query, [userData.id], (error, response) => {
    if (error) { 
      console.log('error: ', error)
    } else {
      res.status(200).json({ tasks: response.rows })
    }
  })
})


module.exports = router;