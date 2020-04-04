var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant")
var Comment = require("../models/comment")
var User = require("../models/user")
const passport = require('passport')

//root route
router.get("/",isLoggedIn, function(req, res) {
  res.render("landing");
});

//AUTH ROUTES
//reg route
router.get("/register", function(req, res) {
  res.render("register");
})

//create user
router.post("/register", function(req, res) {
  var newUser = new User({
    username: req.body.username
  });
  // var password = req.body.password;

  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      console.log(err)
      console.log("==========")
      return res.render('register')
    }
    passport.authenticate("local")(req, res, function() {
      res.redirect("/login")
    })
  })
  //
  // console.log(username)
  // console.log(password)
  // res.redirect("register")
})

router.get("/login",function(req,res){
  res.render("login")
})

//login route
router.post("/login",passport.authenticate("local",{
  successRedirect:"/restaurants",
  failureRedirect:"/login"
}),function(req,res){
})

//logout route
router.get("/logout",function(req,res){
  req.logout(); //passport logs the user out deletes all the sessions
  res.redirect("/login")
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();

  }
  res.redirect("/login");
}
module.exports = router
