const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authRoute = require("./routes/auth-route");
const profileRoute = require("./routes/profile-route");
dotenv.config();
require("./config/passport");
const cookieSession = require("cookie-session");
const passport = require("passport");

mongoose
  .connect(process.env.mongoDBurl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to mongoDB atlas database.");
  })
  .catch((err) => {
    console.log(err);
    console.log("Error! connect to mongoDB atlas database.");
  });

//middlewares
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cookieSession({
    keys: [process.env.SECRET],
  })
);
app.use(passport.initialize());
app.use(passport.session()); //browser stores cookies

app.use("/auth", authRoute); //if url 為 /auth 會執行 authRoute module來接login的方式
//if local login, the url was /auth/login
app.use("/profile", profileRoute);

app.get("/", (req, res) => {
  res.render("index");
});

app.listen(8080, (req, res) => {
  console.log("Server running on port 8080 is running.");
});
