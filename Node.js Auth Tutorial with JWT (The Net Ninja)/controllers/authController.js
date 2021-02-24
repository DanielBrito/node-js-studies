const jwt = require("jsonwebtoken");

const User = require("../models/User");

require("dotenv").config();

// Handle errors:
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = {email: "", password: ""};

  // Check for incorrect email:
  if(err.message==="Incorrect email"){
    errors.email = "That email is not registered!";
  }

  // Check for incorrect password:
  if(err.message==="Incorrect password"){
    errors.password = "That password is not registered!";
  }

  // Duplicate error code:
  if(err.code===11000){
    errors.email = "That email is already registered!";
    return errors;
  }

  // Validation errors:
  if(err.message.includes("user validation failed")){
    Object.values(err.errors).forEach(({properties}) => {
      errors[properties.path] = properties.message;
    })
  }

  return errors;
}

const MAX_AGE = 3 * 24 * 60 * 60; // 3 days in seconds 

const createToken = (id) => {
  return jwt.sign({id}, process.env.SECRET, {
    expiresIn: MAX_AGE
  })
}

module.exports.signupGet = (req, res) => {
  res.render("signup");
}

module.exports.loginGet = (req, res) => {
  res.render("login");
}

module.exports.signupPost = async (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.create({email, password});
    const token = createToken(user._id);
    res.cookie("jwt", token, {httpOnly: true, maxAge: MAX_AGE * 1000});

    res.status(201).json({user: user._id});
  } 
  catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({errors});
  }
}

module.exports.loginPost = async  (req, res) => {
  const {email, password} = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user._id);
    res.cookie("jwt", token, {httpOnly: true, maxAge: MAX_AGE * 1000});

    res.status(200).json({user: user._id});
  } 
  catch (error) {
    const errors = handleErrors(error);
    res.status(400).json({errors});  
  }
}

module.exports.logoutGet = (req, res) => {
  res.cookie("jwt", "", {maxAge: 1});
  res.redirect("/");
}