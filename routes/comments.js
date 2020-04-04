var express = require("express");
var router = express.Router({mergeParams:true});
var Restaurant = require("../models/restaurant")
var Comment = require("../models/comment")



router.get("/new",isLoggedIn, function(req, res) {
  // console.log(req.params.id)
  Restaurant.findById(req.params.id, function(err, restaurant) {
    if (err) {
      console.log(err)
    } else {
      // console.log(restaurant)
      res.render("newcomment",{restaurant:restaurant});
    }

  })

})
// app.get("/restaurants/:id/comments/new",function(req,res){
//   Restaurant.findById(req.params.id,functions(err,foundrestaurant){
//
//   })
// })

router.post("/",isLoggedIn, function(req, res) {

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
          //add username and if to comment
          comment.author.id = req.user._id
          comment.author.username = req.user.username
          console.log(comment);
          comment.save();
          restaurant.comments.push(comment);
          restaurant.save();
          console.log("====after save+====");
          console.log(comment);
          res.redirect("/restaurants/" + restaurant._id);
        }
      })

    }
  })
})
//
// })
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();

  }
  res.redirect("/login");
}
module.exports = router
