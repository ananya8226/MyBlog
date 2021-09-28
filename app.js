//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
var _ = require('lodash');

mongoose.connect("mongodb://localhost:27017/blogDB", {useNewUrlParser: true});

const homeStartingContent ="If you are someone who loves to read, you are at the right place. To get some amazing content on tech and food, do visit myBlog. Here you get access to all my blog posts at one place. If you wish to get all new contents in your inbox, don't forget to subscribe to ";
const about_Content = "Hi there! Get to read all by blogs here."
const contact_Content = "Hello! You can contact me at ";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const postSchema = {
	title: String,
	content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
   Post.find({}, function(err, posts){
   		 res.render("home", {
     homeContent: homeStartingContent,
     posts: posts
     });
   });  
});


app.get("/compose", function(req, res){
	res.render("compose");
});

app.post("/compose", function(req, res){
	const post = new Post({
		title: req.body.postTitle,
		content: req.body.postContent
    });

    post.save(function(err){
    	if(!err){
    		res.redirect("/");
    	}
    });
});

app.get("/posts/:postId", function(req, res){

	const requestedpostId = req.params.postId;

	Post.findOne({_id: requestedpostId}, function(err, post){

   res.render("post", {

     postName: post.title,

     postBody: post.content

   });

 });
	
});

app.get("/about", function(req, res){
   res.render("about", {aboutContent: about_Content});

});

app.get("/contact", function(req, res){
   res.render("contact", {contactContent: contact_Content});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
