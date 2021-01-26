const express = require("express");
const AsyncHandler = require("express-async-handler");
const router = express.Router();
const User = require("../models/User");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const { generateToken } = require("../utils/generateToken");
const { protect, admin } = require("../midleware/authMidleware");
const transporter = require("../config/config");
const jwt = require("jsonwebtoken");

//@description Auth user and get token
//@rotes POST api/users/login
router.post(
  "/login",
  AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        isAdmin: user.isAdmin,
        image: user.image,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  })
);

//@description Register user
//@rotes POST api/users
router.post(
  "/",
  AsyncHandler(async (req, res) => {
    const { email, password, name, image } = req.body;

    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(400);
      throw new Error("User exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      image,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        isAdmin: user.isAdmin,
        image: user.image,
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  })
);

router.post('/reset-password',(req,res)=>{
  crypto.randomBytes(32,(err,buffer)=>{
      if(err){
          console.log(err)
      }
      const token = buffer.toString("hex")
      User.findOne({email:req.body.email})
      .then(user=>{
          if(!user){
              return res.status(422).json({error:"User dont exists with that email"})
          }
          user.resetToken = token
          user.expireToken = Date.now() + 3600000

          nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD,
            },
          });

          transporter.verify(function (error, success) {
            if (error) {
              console.log(error);
            } else {
              console.log("Server is ready to take our messages");
            }
          });

          user.save().then((result)=>{
              transporter.sendMail({
                  to: user.email,
                  from:"luffynami1997@gmail.com",
                  subject:"password reset",
                  html:`
                  <h3>${user.name}</h3>
                  <p>You requested for a password reset, kindly use this <a target="_blank" href="http://localhost:3000/reset/${token}">link</a> to reset password.</p>
                  <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
                  `
              })
              res.json({message:"recovery email sent"})
          })

      })
  })
})

router.post('/new-password',(req,res)=>{
  const newPassword = req.body.password
  const sentToken = req.body.token
  User.findOne({resetToken:sentToken,expireToken:{$gt:Date.now()}})
  .then(user=>{
      if(!user){
          return res.status(422).json({error:"Try again session expired"})
      }
      bcrypt.hash(newPassword,12).then(hashedpassword=>{
         user.password = hashedpassword
         user.resetToken = undefined
         user.expireToken = undefined
         user.save().then((saveduser)=>{
             res.json({message:"password updated success"})
         })
      })
  }).catch(err=>{
      console.log(err)
  })
})

//@description Get user profile
//@rotes GET api/users/profile
router.get(
  "/profile",
  protect,
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

//@description Update user profile
//@rotes PUT api/users/profile
router.put(
  "/profile",
  protect,
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser._id),
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);



//@description Get all users
//@rotes GET api/users/
//Admin
router.get(
  "/",
  protect,
  admin,
  AsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.json(users);
  })
);

//@description Delete user
//@rotes DELETE api/users/:id
//Admin
router.delete(
  "/:id",
  protect,
  admin,
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
      await user.remove();
      res.json({ message: "User removed" });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

//@description Get user by id
//@rotes GET api/users/:id
//Admin
router.get(
  "/:id",
  protect,
  admin,
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
      res.json(user);
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

//@description Update user
//@rotes PUT api/users/id
//Admin
router.put(
  "/:id",
  protect,
  admin,
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      //user.isAdmin = req.body.isAdmin || user.isAdmin;
      user.isAdmin = req.body.isAdmin;

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

module.exports = router;
