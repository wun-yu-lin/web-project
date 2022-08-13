const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").userModel;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

router.use((req, res, next) => {
  console.log("A request is coming in auth.js");
  next();
});

router.get("/testAPI", (req, res) => {
  const msgObj = {
    message: "test API is working",
  };
  return res.json(msgObj);
});

router.post("/register", async (req, res) => {
  //check the validated data
  let { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check if the user exists
  console.log(req.body);
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists)
    return res.status(400).send("Email has already been registered");

  //register the user
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role,
  });
  try {
    const savedUser = await newUser.save();
    res.status(200).send({
      msg: "succcess",
      savedObject: savedUser,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

//login the user
router.post("/login", async (req, res) => {
  let { error } = loginValidation(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  console.log(req.body.email);
  try {
    await User.findOne({ email: req.body.email }, async function (err, user) {
      if (err) {
        console.log("Wrong findone ");

        return res.status(400).send(err);
      }

      if (!user) {
        return res.send(401).send("User not found!");
      }

      await user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch) {
          console.log("Password is match");
          //if password compare finished, create a jsonwebtoken
          const tokenObj = {
            _id: user._id,
            email: user.email,
          };

          const token = jwt.sign(tokenObj, process.env.PASSPORT_SECRET);
          return res.send({ success: true, token: "JWT" + token, user });
        }
        if (err) {
          console.log(err);
          return res.status(401).send("wrong password!");
        }
      });
    });
  } catch (err) {
    console.log(err);
  }
});

module.exports = router;
