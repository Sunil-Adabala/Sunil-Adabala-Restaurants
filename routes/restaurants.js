var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant")
var Comment = require("../models/comment")


//restaurant home page route
router.get("/", function(req, res) {
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

//CREATE REst route
router.post("/",isLoggedIn, function(req, res) {
  var name = req.body.restaurant;
  var image = req.body.imglink;
  var description = req.body.desc;
  var author={
    username:req.user.username,
    id:req.user._id

  }


  var newRestaurant = {
    name: name,
    image: image,
    description: description,
    author:author
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

//SHOW- rest route
router.get("/new",isLoggedIn, function(req, res) {
  res.render("newrestaurant")
})

router.get("/:id", isLoggedIn,function(req, res) {
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
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();

  }
  res.redirect("/login");
}
module.exports = router
