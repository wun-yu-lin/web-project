require("dotenv").config();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");

//profile page and logout
// req.user;
// req.logout();
// req.isAuthenticator();

passport.serializeUser((user, done) => {
  console.log("Serializing user now");
  done(null, user._id);
});

passport.deserializeUser((_id, done) => {
  console.log("Deserializing user now.");
  User.findById({ _id }).then((user) => {
    console.log("Found user.");
    done(null, user);
  });
});
passport.use(
  new GoogleStrategy(
    {
      //與google API 溝通
      clientID: process.env.GoogleClientID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/redirect",
    },
    (accessToken, refreshToken, profile, done) => {
      //passport callback, google API 同意回傳帳號資訊後，回傳資料並 redirect to /auth/google/redirect endpoint
      //verify callback, if have data in mongoDB => login, if no data in DB => save data to mongoDB

      //console.log(profile); //return infor by google

      //verify 是否有帳號資料在資料庫中
      console.log(profile);
      User.findOne({ googleID: profile.id }).then((foundUser) => {
        if (foundUser) {
          //if have data in mongoDB => login
          console.log("User exist in DB");
          done(null, foundUser);
        } else {
          // if no data in DB => save data to mongoDB
          new User({
            name: profile.displayName,
            googleID: profile.id,
            thumbnail: profile.photos[0].value,
            email: profile.email[0].value,
          })
            .save()
            .then((newUser) => {
              console.log("New User created.");
              done(null, newUser);
            });
        }
      });
    }
  )
);
