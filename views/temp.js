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
