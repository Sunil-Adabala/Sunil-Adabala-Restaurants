//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// const bodyParser=require('body-parser');

const app = express();
mongoose.connect("mongodb://localhost:27017/restaurantsDB");

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

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

var restaurantSchema = new mongoose.Schema({
  name: String,
  image: String,
  description:String
})

var Restaurant = mongoose.model("Restaurant", restaurantSchema);

Restaurant.create(
    {
      name: "paradise",
      image: "https://pixabay.com/get/57e8d6474d5aa814f1dc8460cf2934771438dbf85254794c70297ad19145_340.jpg",
      description:"biryani is dope but has ghee in it!"
    }, function(err, restaurant) {
      if (err) {
        console.log(err)
      } else {
        console.log("newly added restaurant :");
        console.log(restaurant);
      }
    });


    //TODO
    app.get("/", function(req, res) {
      res.render("landing");
    });



    app.get("/restaurants", function(req, res) {
      //get restaurants from
      Restaurant.find({},function(err,allrestaurants){
        if(err){
          console.log(err)
        }
        else{
          res.render("index", {
            restaurants: allrestaurants
          });
        }
      });


    });

        app.post("/restaurants", function(req, res) {
          var name= req.body.restraunt;
          var image= req.body.imglink;
          var description=req.body.desc;

          var newRestaurant={name:name,image:image,description:description}
          Restaurant.create(newRestaurant,function(err,newlycreated){
            if(err){
              console.log(err)
            }
            else{
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

    app.get("/restaurants/new", function(req, res) {
      res.render("newrestaurant")
    })

    app.get("/restaurants/:id",function(req,res){
      // console.log(req.params.id)

      Restaurant.findById(req.params.id,function(err,foundrestaurant){
        if(err){
          console.log(err)
        }else{
          // console.log(req.params.id)
          // console.log(foundrestaurant)
          res.render("show",{restaurant:foundrestaurant});
        }
      })
      // res.render("show");
    })




    app.listen(3000, function() {
      console.log("Server started on port 3000");
    });
