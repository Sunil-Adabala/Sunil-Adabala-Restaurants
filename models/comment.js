var mongoose = require("mongoose")


var commentSchema = new mongoose.Schema({
  text:String,
  author:{
    id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User" //ref to user model
    },
    username:String
  }
});

module.exports = mongoose.model("Comment", commentSchema);
