const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").userModel;
const bcrypt = require("bcrypt");

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

module.exports = router;
