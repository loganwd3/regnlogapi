const mongoose = require("mongoose");
const http = require("http");
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const cors = require("cors");
const app = express();

//models
const userModel = require("./Models/usermodel");

//middleware
app.use(express.json());
app.use(cors());
mongoose
  .connect("mongodb://localhost:27017/registerform")
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log(err);
  });

//user register

app.post("/register", (req, res) => {
  let user = req.body;

  try {
    //bcrypt password
    if (user.email && user.password && user.name && user.age !== null) {
      bcrypt.genSalt(10, (err, salt) => {
        if (!err) {
          bcrypt.hash(user.password, salt, async (err, hpass) => {
            if (!err) {
              user.password = hpass;
              let userData = await userModel.create(user);
              res.status(201).send({ message: "User registered" });
            } else {
              console.log(err);
              res.status(404).send({ message: "some problem" });
            }
          });
        } else {
          console.log(err);
        }
      });
    } else {
      res.send({ message: "fill all the fields" });
    }
  } catch (err) {
    console.log(err);
    res.send({ message: "Some problem" });
  }
});

// app.post("/register", (req, res) => {
//   let user = req.body;

//   try {
//     //bcrypt password
//     bcrypt.genSalt(10, (err, salt) => {
//       if (!err) {
//         bcrypt.hash(user.password, salt, async (err, hpass) => {
//           if (!err) {
//             user.password = hpass;
//             let userData = await userModel.create(user);
//             res.status(201).send({ message: "User registered" });
//           } else {
//             console.log(err);
//             res.status(404).send({ message: "some problem" });
//           }
//         });
//       } else {
//         console.log(err);
//       }
//     });
//   } catch (err) {
//     console.log(err);
//     res.send({ message: "Some problem" });
//   }
// });

//user login

app.post("/login", async (req, res) => {
  let user = req.body;
  try {
    let loginUser = await userModel.findOne({ email: user.email });
    if (loginUser !== null) {
      //compare password
      bcrypt.compare(user.password, loginUser.password, (err, success) => {
        if (success === true) {
          // console.log("user found , login success");
          res.status(200).send({ message: "Login Success", type: "success" });
        } else {
          console.log(err);
          res.status(404).send({ passwordMessage: "wrong password" });
        }
      });
    } else {
      res.status(404).send({ message: "mail id doesn't exist" });
    }
  } catch (err) {
    console.log(err);
  }
});

app.listen(8000, () => {
  console.log("server running");
});
