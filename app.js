//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');
// const bodyParser=require('body-parser');

const app = express();
mongoose.connect()

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

var restaurants = [
  {name:"paradise",image:"https://pixabay.com/get/57e8d6474d5aa814f1dc8460cf2934771438dbf85254794c712f7dd19f4e_340.jpg"},
  {name:"mehfil",image:"https://pixabay.com/get/51e6dd444d53b10ff3d89975c62b3e7f123ac3e45659744d75297edc94_340.jpg"}
]

//TODO
app.get("/",function(req,res){
  res.render("landing");
});



app.get("/restaurants",function(req,res){

  res.render("restaurants",{restaurants:restaurants})
});

app.get("/restaurants/new",function(req,res){
  res.render("newrestaurant")
})

app.post("/restaurants",function(req,res){
  restaurants.push({name:req.body.restraunt,image:req.body.imglink});
  console.log(restaurants)
  res.redirect("restaurants");

});



app.listen(3000, function() {
  console.log("Server started on port 3000");
});
