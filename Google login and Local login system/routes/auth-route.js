//this js file 處理跟認證有關的文件
const router = require("express").Router();
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user-model");

router.get("/login", (req, res) => {
  res.render("login", { user: req.user });
});

router.get("/signup", (req, res) => {
  res.render("signup", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/auth/login",
    failureFlash: "Wrong email or password.", //erorr message
  }),
  (req, res) => {
    if (req.session.returnTo) {
      let newUrl = req.session.returnTo;
      req.session.returnTo = "";
      res.redirect(newUrl);
    } else {
      res.redirect("/profile");
    }
  }
);
//local signup
router.post("/signup", async (req, res) => {
  console.log(req.body);
  let { name, email, password } = req.body;
  //check data has existed in database;
  const emailExist = await User.findOne({ email });
  if (emailExist) {
    //透過flash來設定msg
    req.flash("error_msg", "此信箱已經被註冊過了! ");
    res.redirect("/auth/signup");
    return; //return 避免跑下面的程式
  }
  const hash = await bcrypt.hash(password, 10);
  password = hash;
  let newUser = new User({
    name,
    email,
    password,
  });
  try {
    await newUser.save();
    req.flash("success_msg", "帳號成功註冊! 可以登入了! ");
    res.redirect("/auth/login");
  } catch (err) {
    req.flash("error_msg", err.errors.name.properties.message);
    res.status(400).redirect("/auth/signup");
  }
});

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
  if (req.session.returnTo) {
    let newUrl = req.session.returnTo;
    req.session.returnTo = "";
    res.redirect(newUrl);
  } else {
    res.redirect("/profile");
  }
});

module.exports = router;
