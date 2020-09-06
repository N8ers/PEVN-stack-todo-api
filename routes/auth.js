const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const jwtValidator = require("../jwtValidation");
const db = require("../database/db");

const saltRounds = 10;


// create new user
router.post("/createUser", async (req, res) => {
  let { email, name, password } = req.body;

  const { rows } = await db.query("SELECT * FROM persons WHERE email = ($1)", [email]);

  if (rows.length) {
    res.status(200).json({ message: "email already in use" });
    console.log("email is already in use");
    return;
  }

  let hashedPW = await bcrypt.hash(password, saltRounds);
  let setNewUser = "INSERT INTO persons (email, name, password) VALUES ($1, $2, $3)";

  db.query(setNewUser, [email, name, hashedPW], (error, dbResponse) => {
    if (error) res.status(200).json({ message: error.message });
    res.status(200).json({ message: "success" });
  });
});

router.post("/login", async (req, res) => {

  console.log("/login ", req.body.payload);

  let { email, password } = req.body.payload;

  let checkForEmail = "SELECT * FROM persons WHERE email = ($1)";
  db.query(checkForEmail, [email], async (error, dbResponse) => {
    console.log("dbResponse ", dbResponse.rows.length);
    if(!dbResponse.rows.length) res.status(200).json({ loginSuccess: false, message: "no such user exists" });
    if (error) res.status(error.status).json({ loginSuccess: false, message: error.message });
    
    bcrypt.compare(password, dbResponse.rows[0].password)
      .then((result) => {
        if (result) {
          let user = {
            email: dbResponse.rows[0].email, 
            name: dbResponse.rows[0].name, 
            id: dbResponse.rows[0].id
          };
          console.log("user: ", user);
          let myJWT = jwt.sign({ user }, db.accessTokenSecret);
          res.status(200).json({ loginSuccess: "true", userData: user, jwt: myJWT });
        } else {
          // how should is end 401 bad login errors without mucking up console
          res.json({ loginSuccess: "false", message: "email or password may be wrong???" });
        }
      });
  }); 
});

// check for jwt on load

// check jwt
router.post("/check-jwt", jwtValidator.validateJWT, (req, res) => {
  let userData = req.body.user;

  res.status(200).json({ loginSuccess: "true", userData });
});

module.exports = router;