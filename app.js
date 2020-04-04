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

var Restaurant = require("./models/restaurant")
var seedDB = require("./seed")
var Comment = require("./models/comment")
var User = require("./models/user")

//requiere routes
var restaurantsRoutes = require("./routes/restaurants")
var commentRoutes = require("./routes/comments")
var indexRoutes = require("./routes/index")


seedDB();
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

app.use(function(req,res,next){
  res.locals.currentUser= req.user;
  next();
})

app.use("/restaurants",restaurantsRoutes);
app.use("/restaurants/:id/comments",commentRoutes);
app.use(indexRoutes);

app.listen(3000, function() {
  console.log("Server started on port 3000");
});









//
// var restaurants = [{
//     name: "paradise",
//     image: "https://pixabay.com/get/57e8d6474d5aa814f1dc8460cf2934771438dbf85254794c712f7dd19f4e_340.jpg"
//   },
//   {
//     name: "mehfil",
//     image: "https://pixabay.com/get/51e6dd444d53b10ff3d89975c62b3e7f123ac3e45659744d75297edc94_340.jpg"
//   }
// ]

//schema


//
// Restaurant.create(
//     {
//       name: "paradise",
//       image: "https://pixabay.com/get/57e8d6474d5aa814f1dc8460cf2934771438dbf85254794c70297ad19145_340.jpg",
//       description:"biryani is dope but has ghee in it!"
//     }, function(err, restaurant) {
//       if (err) {
//         console.log(err)
//       } else {
//         console.log("newly added restaurant :");
//         console.log(restaurant);
//       }
//     });
