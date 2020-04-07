//MIDDLEWARE FILE
var Restaurant = require("../models/restaurant")
var Comment    = require("../models/comment")
middlewareObj = {}

middlewareObj.checkRestaurantOwner = function(req, res, next) {
  //user logged in?
  if (req.isAuthenticated()) {
    Restaurant.findById(req.params.id, function(err, foundRestaurant) {
      if (err) {
        console.log(err)
        res.redirect("back")
      } else {

        if (foundRestaurant.author.id.equals(req.user._id)) { //.equals becuz one is obj and other isa str
          // res.render("editrestaurants",{restaurant:foundRestaurant})
          next();
        } else {
          req.flash("error","No permission bro")
          res.redirect("back");
        }

      }
    })
  } else {
    req.flash("error","you need to be logged in")
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwner = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        console.log(err)
        req.flash("error","campground not found")
        res.redirect("back")
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          res.redirect("back");
        }
      }
    })
  } else {
    req.flash("error","No permission bro!")
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash("error","You need to login first!")
  res.redirect("/login");
}

module.exports = middlewareObj
