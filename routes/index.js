var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant")
var Comment = require("../models/comment")
var User = require("../models/user")
const passport = require('passport')
var middleware = require("../middleware")

//root route
router.get("/",middleware.isLoggedIn, function(req, res) {
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
      req.flash("error",err.message)
      return res.render('register')
    }
    passport.authenticate("local")(req, res, function() {
      req.flash("success","Succesfully registered")
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
  req.flash("success","Welcome to Restaurants ,"+user.name+"!");
})

//logout route
router.get("/logout",function(req,res){
  req.logout(); //passport logs the user out deletes all the sessions
  req.flash("success","Succesfully logged out")
  res.redirect("/login")
})


module.exports = router
