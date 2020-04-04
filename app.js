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


//TODO
app.get("/",isLoggedIn, function(req, res) {
  res.render("landing");
});



app.get("/restaurants", function(req, res) {
  //get restaurants from
  Restaurant.find({}, function(err, allrestaurants) {
    if (err) {
      console.log(err)
    } else {
      res.render("index", {
        restaurants: allrestaurants,
        currentUser:req.user
      });
    }
  });


});

app.post("/restaurants",isLoggedIn, function(req, res) {
  var name = req.body.restaurant;
  var image = req.body.imglink;
  var description = req.body.desc;

  var newRestaurant = {
    name: name,
    image: image,
    description: description
  }
  Restaurant.create(newRestaurant, function(err, newlycreated) {
    if (err) {
      console.log(err)
    } else {
      console.log(newlycreated);
      res.redirect("restaurants");

    }
  })
  // restaurants.push({
  //   name: req.body.restraunt,
  //   image: req.body.imglink
  // });
  // console.log(restaurants)
  // res.redirect("restaurants");

});

app.get("/restaurants/new",isLoggedIn, function(req, res) {
  res.render("newrestaurant")
})

app.get("/restaurants/:id", isLoggedIn,function(req, res) {
  // console.log(req.params.id)

  Restaurant.findById(req.params.id).populate("comments").exec(function(err, foundrestaurant) {
    if (err) {
      console.log(err)
    } else {
      // console.log(req.params.id)
      console.log(foundrestaurant)
      res.render("show", {
        restaurant: foundrestaurant
      });
    }
  });

  // res.render("show");
});

app.get("/restaurants/:id/comments/new",isLoggedIn, function(req, res) {
  Restaurant.findById(req.params.id, function(err, foundrestaurant) {
    if (err) {
      console.log(err)
    } else {
      res.render("newcomment", {
        restaurant: foundrestaurant
      });
    }

  })

})
// app.get("/restaurants/:id/comments/new",function(req,res){
//   Restaurant.findById(req.params.id,functions(err,foundrestaurant){
//
//   })
// })

app.post("/restaurants/:id/comments",isLoggedIn, function(req, res) {
  // var newComment = req.body.comment;
  // Restaurant.create(newComment,function(err,newlycreated){
  //   if(err){
  //     console.log(err)
  //   }
  //   else{
  //     console.log(newlycreated);
  //     res.redirect("newcomments");
  //
  //   }
  Restaurant.findById(req.params.id, function(err, restaurant) {
    if (err) {
      console.log("=+==========")
      console.log(restaurant)
      console.log(err);
    } else {
      console.log(req.body.comment.text)
      Comment.create(req.body.comment, function(err, comment) {
        if (err) {
          console.log(err)
        } else {
          // console.log(restaurant)
          restaurant.comments.push(comment);
          restaurant.save();
          res.redirect("/restaurants/" + restaurant._id);
        }
      })

    }
  })
})
//
// })


//AUTH ROUTES

app.get("/register", function(req, res) {
  res.render("register");
})


app.post("/register", function(req, res) {
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

app.get("/login",function(req,res){
  res.render("login")
})

app.post("/login",passport.authenticate("local",{
  successRedirect:"/restaurants",
  failureRedirect:"/login"
}),function(req,res){
})


app.get("/logout",function(req,res){
  req.logout(); //passport logs the user out deletes all the sessions
  res.redirect("/login")
})

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();

  }
  res.redirect("/login");
}




app.listen(3000, function() {
  console.log("Server started on port 3000");
});
