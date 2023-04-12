require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const bcrypt = require('bcryptjs');
const jwt = require("jsonwebtoken");
const app = express();

app.use(express.json());

// Logic goes here

// importing user context
const User = require("./model/user");


const admin_auth = require("./middleware/admin_auth");
// Register
app.post("/register", admin_auth, async (req, res) => {

    // Our register logic starts here
    try {
      // Get user input
      const { first_name, last_name, email, password, administrator } = req.body;
        
      // Validate user input
      if (!(email && password && first_name && last_name && typeof administrator == "boolean")) {
        res.status(400).send("All input is required");
      }
      if (email != `${email}`.toLocaleLowerCase()) {
        res.status(400).send("E-mail must be in lowercase!");
      }
      // check if user already exist
      // Validate if user exist in our database

      const oldUser = await User.findOne({ email });

      if (oldUser) {
        return res.status(409).send("User Already Exist. Please Login");
      }
  
      //Encrypt user password
      encryptedPassword = await bcrypt.hash(password, 10);
  
      // Create user in our database
      const user = await User.create({
        first_name,
        last_name,
        email: email.toLowerCase(), // sanitize: convert email to lowercase
        password: encryptedPassword,
        administrator: administrator
      });
  
      // Create token
      if (administrator) {  
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.ADMIN_TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
          // save user token
          user.token = token;
      }
      else {
      const token = jwt.sign(
        { user_id: user._id, email },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
          // save user token
          user.token = token;
      }


  
  
      // return new user
      res.status(201).json(user);
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });

// Login
app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
      // Get user input
      const { email, password } = req.body;
  
      // Validate user input
      if (!(email && password)) {
        res.status(400).send("All input is required");
      }
      // Validate if user exist in our database

      const user = await User.findOne({ email });

      if (user.administrator) {
        if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = jwt.sign(
            { user_id: user._id, email },
            process.env.ADMIN_TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
    
          // save user token
          user.token = token;
    
          // user
          res.status(200).json(user);
        }
      }
      else  if (user && (await bcrypt.compare(password, user.password))) {
          // Create token
          const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
              expiresIn: "2h",
            }
          );
    
          // save user token
          user.token = token;
    
          // user
          res.status(200).json(user);
        }
      else{
        res.status(400).send("Invalid Credentials");
      }
      
    } catch (err) {
      console.log(err);
    }
    // Our register logic ends here
  });

const auth = require("./middleware/auth");



app.get("/welcome", auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

app.get("/admin_welcome", admin_auth, (req, res) => {
  res.status(200).send("Welcome 🙌 ");
});

const port = process.env.PORT || 3030;

// // your code

app.listen(process.env.PORT, () => {
  console.log(`server started on port ${port}`);
});

module.exports = app;