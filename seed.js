var mongoose = require("mongoose")
var Restaurant = require("./models/restaurant")
var Comment = require("./models/comment")

var data = [{
    name: "paradise",
    image: "https://www.wearegurgaon.com/wp-content/uploads/2017/07/paradise-biryani-gurgaon-1.jpg",
    description: "nice biryani but has ghee init"

  },
  {
    name: "pista house",
    image: "https://media.weddingz.in/images/2e68d77263df76529509a7fdb029805c/pista-house-banquet-hall-kukatpally-hyderabad.jpg",
    description: "best haleem in the city"
  }, {
    name: "shah-gouse",
    image: "https://imgstaticcontent.lbb.in/lbbnew/wp-content/uploads/2018/03/04220518/ShahGhouse.jpg",
    description: "paya sherwa is dope"
  }, {
    name: "Ram ki bandi",
    image: "https://pbs.twimg.com/media/CHCk3vTUAAEqz46.jpg",
    description: "Great dosa"
  }
]
function seedDB() {
  Restaurant.remove({}, function(err) {
    if (err) {
      console.log(err)
    }
    console.log("all entries removed");
    data.forEach(function(seed){
      Restaurant.create(seed, function(err, restaurant){
        if(err){
          console.log(err)
        }else{
          console.log("record added")
          console.log("========")
          console.log(data)
          // create a comment
          Comment.create(
            {
              text:"this place is great, but I wish there was internet",
              author:"sunil"
            },function(err,comment){
              if(err){
                console.log(err)
              }else{
                console.log("Comment added")
                restaurant.comments.push(comment);
                restaurant.save();
              }
            })
        }
      })
    });
  });

}


module.exports = seedDB;
