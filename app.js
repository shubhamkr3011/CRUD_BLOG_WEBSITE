//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require("lodash");
require('dotenv').config();

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";


const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
//connect to data base and create own data base
mongoose.connect(process.env.MONGO_URL);

//Expert schema

const postSchema = {
  title: String,
  content: String
};

//Expert model

const Post = mongoose.model("Post",postSchema);
//user schema and model
const userSchema = {
  email: String,
  password: String
};

const User = mongoose.model("User", userSchema);
//end user schema and model

// Render login form
app.get("/login", function(req, res){
  res.render("login");
});

// Render signup form
app.get("/signup", function(req, res){
  res.render("signup");
});

// Handle login
app.post("/login", function(req, res){
  const email = req.body.email;
  const password = req.body.password;

  // Check if user exists
  User.findOne({ email: email }).exec()
  .then(function(foundUser) {
    if (foundUser) {
      // Check if password is correct
      if (foundUser.password === password) {
        // Redirect to home page
        res.redirect("/homeauth");
      } else {
        // Password is incorrect
        res.send("Incorrect password");
      }
    } else {
      // User not found
      res.send("User not found");
    }
  })
  .catch(function(err) {
    console.log(err);
  });
});

// Handle signup
app.post("/signup", function(req, res){
  const email = req.body.email;
  const password = req.body.password;

  // Create new user
  const newUser = new User({
    email: email,
    password: password
  });

  // Save user to database
  newUser.save()
  .then(function(){
    res.redirect("/");
  })
  .catch(function(err){
    console.log(err);
  });
});


app.get("/homeauth", function(req, res){
  // res.render("home", {
  //   startingContent: homeStartingContent,
  //   posts: posts
  //   });
  Post.find({})
  .then(function(posts){
    res.render("homeauth", {

      startingContent: homeStartingContent,
 
      posts: posts
    
      });
  })
  .catch(function(err){
    console.log(err);
  });
});
app.get("/",function(req,res){
  res.render("home", {
    startingContent: homeStartingContent,
    });
})

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });

  // posts.push(post);
  post.save()
  .then(function(){
    res.redirect("/");
  })
  .catch(function(err){
    console.log(err);
  });
});


app.get("/posts/:postId", function(req, res){
  const requestedPostId = req.params.postId;
  console.log(requestedPostId);
  Post.findOne({_id: requestedPostId})
    .then(function(post){
      res.render("post", {
        title: post.title,
        content: post.content
      });
    })
    .catch(function(err){
      console.log(err);
    });
}); 

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
