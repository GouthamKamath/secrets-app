//jshint esversion:6
require('dotenv').config(); 
const express = require("express");
const ejs = require("ejs");
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({
  extended: true
}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/userDB');

const userSchema = new mongoose.Schema({
    username: String,
    password: String
});


userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields :['password']});

const User = mongoose.model('User',userSchema);

//TODO
app.get('/',(req,res)=>{
    res.render('home');
});

app.get('/login',(req,res)=>{
    res.render('login');
});

app.get('/register',(req,res)=>{
    res.render('register');
});

app.post('/register',(req,res)=>{
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });
    user.save(function(err){
        if(err){
            console.log(err);
        }else{
            res.render('secrets');
        }
    })
})

app.post('/login',(req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    User.findOne({username:username},(err,foundUser)=>{
        if(!err){
            if(foundUser.password === password){
                res.render('secrets');
            }
        }else{
            res.send(err);
        }
    })
})

app.listen(3000, function() {
  console.log("Server started on port 3000");
});