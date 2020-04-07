var mongoose = require("mongoose")

var restaurantSchema = new mongoose.Schema({
  name: String,
  price:String,
  image: String,
  description:String,
  comments:[
    { // referencing ids
      type:mongoose.Schema.Types.ObjectId,
      ref:"Comment" //ref to comment model
    }
  ],
  author:{
    id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User" //ref to user model
    },
    username:String
  }
})

module.exports = mongoose.model("Restaurant", restaurantSchema);
