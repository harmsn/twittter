var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var mongoose= require('mongoose');
var session = require('express-session');
var db = mongoose.connect('mongodb://localhost:27017/sn');
var Account= require('./models/Account');
var Post= require('./models/Post');
var app = express();
app.engine('hbs', require('hbs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const port = process.env.PORT || 3000;
app.use(session({secret: 'harman123',
resave: false,
    saveUninitialized: false}));
app.listen(port, function(){
    console.log("Server running on " ,port);
})
var authenticate = function(req,res,next){
    if (req.session && req.session.user) return next();
    return res.redirect('/login');

}
app.get('/', function(req, res, next) {
    if (req.session && req.session.user){
      Post.find({},function(error,posts){
          res.render('index',{title:"home",posts:posts});
      });
    }
    else res.render('welcome', { title: "Social Network" });
});
app.get('/signup',function(req,res){
    res.render('signup', { title: "signup" });
});
app.post('/signup',function(req,res){
    if (!req.body.username || !req.body.password){
      return res.render('signup', { title: "signup" , message: "Please Enter both username and password"});
    }
    Account.findOne({username: req.body.username}, function(error,account)
    {
        if(account) return res.render('signup', { title: "signup" , message: "Username Already Exists"});
        else if (error) return console.log("error in accessing the database");
        else{
        Account.create({
            username : req.body.username,
            password : req.body.password
            },function(error,account){
            if (error) return console.log("Error in adding User to Database");
            else res.redirect('/');
            });
        }
    });
});
app.get('/login',function(req,res){
    res.render('login', { title: "login" });
});
app.post('/login',function(req,res){
    if (!req.body.username || !req.body.password){
      return res.render('login', { title: "login" , message: "Please Enter both username and password"});
    }
    Account.findOne({username:req.body.username},function(error,account)
    {
      if (error) return console.log("error in accessing the database");
      else if (!account) return res.render('login', { title: "login" , message: "Username doesnot Exists"});
      if (account.compare(req.body.password)){
        req.session.user = account;
        req.session.save();
        console.log("saved");
        console.log(req.session.user.username);
        console.log(req.session);
        res.redirect('/');
      }
      else return res.render('login', { title: "login" , message: "Wrong password"});
    });
});
app.get('/post',authenticate,function(req,res){
    console.log('rbrbjnbjntfbj');
    res.render('post',{title:"Post Something"});
});
app.post('/post',authenticate,function(req,res){
    if(req.body && req.body.post){
      Post.create({
        post: req.body.post,
        author: req.session.user._id,
        username: req.session.user.username
        },function(error,post){
          if(error) return console.log("Error in adding the post to database");
          console.log("Post created");
          res.redirect("/")
        }
      );
    }
});
app.get('/logout',function(req,res){
    console.log('rvrbbrfb');
    req.session.destroy();
    res.redirect("/");
});
likePost = (req, res) => {
    Post.findByIdAndUpdate(
      req.body.postId,
      { $push: { likes: req.body.userId } },
      { new: true }
    )
      .select('_id title content created likes')
      .exec((err, data) => {
        if (err) res.json({ err });
        res.json(data);
    });
};
app.put('/like/:post/:name',function(req,res){
    console.log('hiiii!');
    //console.log(req.params.post)
    //console.log(req.params.name);
    let ob = Post.find({post: req.params.post,username:req.params.name});
    console.log(ob.likes);
})