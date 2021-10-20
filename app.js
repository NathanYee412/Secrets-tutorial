//jshint esversion:6
require('dotenv').config(); // enviornment variable for secret
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const md5 = require('md5');


const app = express();
// Express & EJS setup
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: true
}));

// Mongoose setup
mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});



const User = new mongoose.model("User", userSchema);


app.get("/", (req, res) =>{
    res.render("home");
});

app.get("/login", (req, res) =>{
    res.render("login");
});

app.get("/register", (req, res) =>{
    res.render("register");
});


app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save((err) =>{ // will automatically encrypt 
        if(err){
            console.log(err);
        } else{
            res.render("secrets");
        }
    });

});

app.post("/login", (req, res) =>{
    const username = req.body.username;
    const password = md5(req.body.password);

    User.findOne({email: username}, (err, foundUser) => { // will automatically decrypt
        if(err){
            console.log(err);
        } else{
            if(foundUser){
                if(foundUser.password === password){
                    console.log("Login Success");
                    res.render("secrets");
                }
            }
        }
    });
});

app.listen(3000, () =>{
    console.log("Running on port 3000");
});