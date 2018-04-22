var express = require('express'),
    mongoose = require('mongoose'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    expressSanitizer = require('express-sanitizer'),
    app = express()

    mongoose.connect("mongodb://localhost/Restful_Blog");
    app.set("view engine","ejs");
    app.use(express.static("public"));
    app.use(bodyParser.urlencoded({extended:true}));
    //sanitizer must goes under bodyparser as we sanitize users input
    app.use(expressSanitizer());
    app.use(methodOverride("_method"));

    //setting schema
    var blogSchema = new mongoose.Schema({
      title:String,
      image: String,
      body: String,
      created: {type: Date, default:Date.now}
    });

    //declar model based on blogSchema
    var Blog = mongoose.model("Blog",blogSchema);

    // Blog.create({
    //   title:"Learn Web Development",
    //   image: "https://cdn.pixabay.com/photo/2015/01/21/14/14/macbook-606763__340.jpg",
    //   body: "Understand what is front-end & backend.Also know how it works.",
    // })

    //Restful Routes

    //home
    app.get("/",function(req,res){
      res.redirect("/blogs");
      // res.send("Index page");
    })

    //Index Route
    app.get("/blogs",function(req,res){
      Blog.find({},function(err, blogs){
        if(err){
          console.log(err);
        }else{
            res.render("index",{blogs:blogs});
        }
      })
    })

    //New Route
    app.get("/blogs/new",function(req,res){
      res.render("new");
    })

    //Create Route
    app.post("/blogs",function (req,res){
      console.log(req.body);
      req.body.blog.body = req.sanitize(req.body.blog.body);
      console.log("====================");
      console.log(req.body);
      //create blog
      Blog.create(req.body.blog, function(err, newBlog){
        if(err){
        res.render("new");
        }else{
          res.redirect("/blogs")
        }
      })
    })

    //SHOW Route
    app.get("/blogs/:id",function(req,res) {
      Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
          res.redirect("/blogs");
        }else {
          res.render("show",{blog: foundBlog});
        }
      })
    })

    //EDIT route
    app.get("/blogs/:id/edit",function(req,res){
      Blog.findById(req.params.id, function(err, foundBlog){
        if (err) {
          res.redirect("/blogs");
        }else {
          res.render("edit",{blog: foundBlog});
        }
    })
  })

  //UPDATE Route
  app.put("/blogs/:id",function(req,res){
    req.body.blog.body = req.sanitize(req.body.blog.body);
    Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updateBlog){
      if (err) {
        console.log(err);
      }else {
        res.redirect("/blogs/"+req.params.id);
      }
    })
  })

  //DELETE Route
  app.delete("/blogs/:id", function(req,res){
    //destroy the post
    Blog.findByIdAndRemove(req.params.id,function(err) {
      if (err) {
      console.log(err);
    }else {
      res.redirect("/blogs");
    }
    })
  })

    app.listen(8080, function(){
      console.log("Server is running");
    })
