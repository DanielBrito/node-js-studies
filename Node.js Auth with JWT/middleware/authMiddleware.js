const jwt = require("jsonwebtoken");

const User = require("../models/User");

require("dotenv").config();

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;

  // Check existence and validation of token:
  if(token){
    jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
      if(err){
        console.log(err.message);
        res.redirect("/login");
      }
      else{
        console.log(decodedToken);
        next();
      }
    })
  }
  else{
    res.redirect("/login");
  }
}

// Check user:
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if(token){
    jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
      if(err){
        console.log(err.message);
        res.locals.user = null;
        next();
      }
      else{
        console.log(decodedToken);
        let user = await User.findById(decodedToken.id);
        res.locals.user = user;
        next();
      }
    });
  }
  else{
    res.locals.user = null;
    next();
  }
}

module.exports = {requireAuth, checkUser};