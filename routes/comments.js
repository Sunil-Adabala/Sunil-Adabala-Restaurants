var express = require("express");
var router = express.Router({mergeParams:true});
var Restaurant = require("../models/restaurant")
var Comment = require("../models/comment")
var middleware = require("../middleware") //index file is required automatically



router.get("/new",middleware.isLoggedIn, function(req, res) {
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

router.post("/",middleware.isLoggedIn, function(req, res) {

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
//EDIT Route for comments
router.get("/:comment_id/edit",middleware.checkCommentOwner,function(req,res){
  // res.send("hey!")
  Comment.findById(req.params.comment_id,function(err,foundComment){
    if (err) {
      console.log(err)
    } else {
      // console.log(req.params.id)
      console.log("++++++++++++++++++++++++++++++++++++++")
      console.log(foundComment)
      console.log(req.params.id)
      res.render("editcomment", {restaurant_id:req.params.id,comment: foundComment});//restaurant id is already thr in the url can find in app.js
    }
  });
});

//UPDATE COMMENT
router.put("/:comment_id",middleware.checkCommentOwner,function(req,res){
  console.log("+++++++++++")
  console.log(req.params.id)
  Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){ //findByIdAndUpdate(find,update,callback)
    if(err){
      console.log(err)
      res.redirect("back")
    }
    else{
      res.redirect("/restaurants/"+req.params.id)
    }
  })
  // res.send("HEY!")
});

//DESTROY COMMENT
router.delete("/:comment_id",middleware.checkCommentOwner,function(req,res){
  Comment.findByIdAndRemove(req.params.comment_id,function(err){
    if(err){
      console.log(err)
      res.redirect("/restaurants/"+req.params.id)
    }
    else{
      res.redirect("/restaurants/"+req.params.id)
    }
  })
})

module.exports = router
