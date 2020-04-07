var express = require("express");
var router = express.Router();
var Restaurant = require("../models/restaurant")
var Comment = require("../models/comment")
var middleware = require("../middleware/index")
var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);

//restaurant home page route
router.get("/", function(req, res) {
  //get restaurants from
  Restaurant.find({}, function(err, allrestaurants) {
    if (err) {
      console.log(err)
    } else {
      res.render("index", {
        restaurants: allrestaurants,
        currentUser: req.user
      });
    }
  });


});

//CREATE REst route

router.post("/", middleware.isLoggedIn, function(req, res) {
  var name = req.body.restaurant;
  var price = req.body.price
  var image = req.body.imglink;
  var description = req.body.desc;
  var author = {
    username: req.user.username,
    id: req.user._id
  }
  geocoder.geocode(req.body.location, function(err, data) {
    if (err || !data.length) {
      console.log(err)
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    var lat = data[0].latitude;
    var lng = data[0].longitude;
    var location = data[0].formattedAddress;
    var newRestaurant = {
      name: name,
      image: image,
      price: price,
      description: description,
      author: author,
      lat: lat,
      location: location,
      lng: lng
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
});

//SHOW- rest route
router.get("/new", middleware.isLoggedIn, function(req, res) {
  res.render("newrestaurant")
})

router.get("/:id", middleware.isLoggedIn, function(req, res) {
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

//EDIT restaurant routes
router.get("/:id/edit", middleware.checkRestaurantOwner, function(req, res) {
  Restaurant.findById(req.params.id, function(err, foundRestaurant) {
    res.render("editrestaurant", {
      restaurant: foundRestaurant
    })
  });
});



//Update restaurant routes
router.put("/:id", middleware.checkRestaurantOwner, function(req, res) {
  //maps
  geocoder.geocode(req.body.location, function(err, data) {
    if (err || !data.length) {
      console.log(err)
      req.flash('error', 'Invalid address');
      return res.redirect('back');
    }
    req.body.restaurant.lat = data[0].latitude;
    req.body.restaurant.lng = data[0].longitude;
    req.body.restaurant.location = data[0].formattedAddress;

    Restaurant.findByIdAndUpdate(req.params.id, req.body.restaurant, function(err, updatedRestaurant) {
      if (err) {
        console.log(err)
        res.redirect("/restaurants")
      } else {
        res.redirect("/restaurants/" + req.params.id)
      }
    })
  });

})

//DESTROY restaurant
router.delete("/:id", middleware.checkRestaurantOwner, function(req, res) {
  Restaurant.findByIdAndRemove(req.params.id, function(err) {
    if (err) {
      console.log(err)
      res.redirect("/restaurants")
    } else {
      res.redirect("/restaurants")
    }
  })

})




module.exports = router
