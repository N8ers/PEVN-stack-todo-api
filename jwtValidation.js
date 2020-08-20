const jwt = require("jsonwebtoken");

const { accessTokenSecret } = require("./database/db.js");

async function validateJWT (req, res, next) {
  let authHeader = req.headers["authorization"];
  let token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  await jwt.verify(token, accessTokenSecret, (err, user) => {
    // console.log('jwt verification error: ', err)
    if (err) return res.send({ status: 403, error: err });

    req["body"] = user;
    next();
  });
}

module.exports.validateJWT = validateJWT;