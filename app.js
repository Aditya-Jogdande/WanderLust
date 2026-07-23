if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const Listing = require("./models/listing.js");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const { MongoStore } = require("connect-mongo"); //mongostore is used to store the large amount of data
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const userRoute = require("./routes/user.js");
const listingRoute = require("./routes/listings.js");
const reviewRoute = require("./routes/reviews.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);

const dbURL = process.env.ATLASDB_URL;

const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24 * 3600,
});

store.on("error", (err) => {
  console.log("error in MONGO SESSION STORE", err);
});

const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};
app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize()); // Initializes Passport to handle authentication.
app.use(passport.session()); // Enables login sessions so users stay logged in.

passport.use(new LocalStrategy(User.authenticate())); // Uses the Local Strategy to authenticate users with username and password.

passport.serializeUser(User.serializeUser()); // Stores only the user's ID in the session after successful login.
passport.deserializeUser(User.deserializeUser()); // Retrieves the full user from the stored ID and makes it available as req.user.

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//Database Connection
mongoose.set("strictQuery", true);
// const MONGO_URL = "mongodb://127.0.0.1:27017/wonderLust";

main()
  .then(() => {
    console.log("Connection Successfull");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbURL);
}

app.use("/listings", listingRoute);
app.use("/listings/:id/review", reviewRoute);
app.use("/", userRoute);

app.listen("1111", () => {
  console.log("Server is running on : 1111 port");
});

app.get("/", (req, res) => {
  res.send("App is working");
});

app.all("/*path", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
  // res.status(statusCode).send(message);
});

// app.use((err, req, res, next) => {
//   res.send("Something went wrong");
// });
