const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;
const passport = require("passport");
require("./config/passport")(passport); //require a function, and 執行 function並給予passport作為參數，因為此model有使用passport的use middleware

//connect to DB
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connect to Mongo Altas");
  })
  .catch((e) => {
    console.log(e);
  });

//middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", authRoute);
app.use(
  "/api/course",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

app.listen(8080, () => {
  console.log("Server runnung on port 8080.");
});
