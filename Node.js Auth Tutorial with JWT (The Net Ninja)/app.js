const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/authRoutes");
const {requireAuth, checkUser} = require("./middleware/authMiddleware");

require("dotenv").config();

const app = express();

// Middleware:
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// View engine:
app.set('view engine', 'ejs');

// Database connection:
const dbURI = process.env.DATABASE_CONFIG;

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex:true })
  /* Bug: Trying to reconnect on this port after every save: */
  .then((result) => app.listen(3000))
  .catch((err) => {
    console.log(err)
  });

// Routes:
app.get("*", checkUser); // Applying middleware for every route get request
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', requireAuth, (req, res) => res.render('smoothies'));

app.use(authRoutes);

// Working with cookies (examples):
/*
app.get("/set-cookies", (req, res) => {
  // Setting cookie manually:
  // res.setHeader("Set-Cookie", "newUser=true");

  // Setting cookie with lib:
  res.cookie("newUser", false);
  res.cookie("isEmployee", true, {maxAge: 1000 * 60 * 60 * 24, httpOnly: true});

  res.send("You got the cookie!");
});

app.get("/read-cookies", (req, res) => {
   const cookies = req.cookies;

   console.log(cookies.newUser);

   res.json(cookies);
});
*/