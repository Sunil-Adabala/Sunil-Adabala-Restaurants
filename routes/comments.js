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
          console.log(comment)
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
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();

  }
  res.redirect("/login");
}
module.exports = router
