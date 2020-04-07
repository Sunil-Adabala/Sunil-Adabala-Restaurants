//jshint esversion:6
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
const passport = require('passport')
const LocalStrategy = require("passport-local");
const passportLocalMongoose = require("passport-local-mongoose")
const methodOverride = require("method-override"); // to do a put request and del request
const flash = require("connect-flash") //for flash messsages

var Restaurant = require("./models/restaurant")
var seedDB = require("./seed")
var Comment = require("./models/comment")
var User = require("./models/user")

//requiere routes
var restaurantsRoutes = require("./routes/restaurants")
var commentRoutes = require("./routes/comments")
var indexRoutes = require("./routes/index")


// seedDB(); //seed Database
// console.log("============"+__dirname)
// const bodyParser=require('body-parser');

const app = express();
mongoose.connect("mongodb://localhost:27017/restaurantsDB");

//use express-session and perform actions
app.use(require("express-session")({
  secret: process.env.SESSION_SECRET, //secret to encode or decode the sessions
  resave: false,
  saveUninitialized: false
}))

app.set('view engine', 'ejs');
app.use(methodOverride("_method"));
app.use(flash())
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(__dirname + "/public"));

passport.use(new LocalStrategy(User.authenticate()))
//reading the data from the session that is encoded and once done then  encode
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//allows to have currentuser info available to every template
app.use(function(req,res,next){
  res.locals.currentUser= req.user;//make available CurrentUser for every template
  res.locals.error = req.flash("error") //make available error for every template
  res.locals.success = req.flash("success")//make available  success  for every template
  next();
})

app.use("/restaurants",restaurantsRoutes);
app.use("/restaurants/:id/comments",commentRoutes);
app.use(indexRoutes);



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
