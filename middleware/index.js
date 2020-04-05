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
          res.redirect("back");
        }

      }
    })
  } else {
    res.redirect("back");
  }
}

middlewareObj.checkCommentOwner = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        console.log(err)
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
    res.redirect("back");
  }
}

middlewareObj.isLoggedIn = function(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}

module.exports = middlewareObj
