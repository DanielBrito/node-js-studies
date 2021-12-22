const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const {isEmail} = require("validator");

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, "Please insert an email"],
    unique: true,
    lowercase: true,
    validate: [isEmail, "Please insert a valid email"]
  },
  password: {
    type: String,
    required: [true, "Please insert a password"],
    minlength: [6, "Minimum password length is 6 characters"]
  }
});

// Mongoose Hooks:

// Fire a function after doc saved to database:
userSchema.post("save", function(doc, next){
  console.log("New user created!", doc);
  
  next();
});

// Fire a function before doc saved to database:
userSchema.pre("save", async function(next){
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// Static method to login user:
userSchema.statics.login = async function(email, password){
  const user = await this.findOne({email: email});

  if(user){
    const auth = await bcrypt.compare(password, user.password);

    if(auth){
      return user;
    }

    throw Error("Incorrect password");
  }

  throw Error("Incorrect email");
}

const User = mongoose.model("user", userSchema);

module.exports = User;