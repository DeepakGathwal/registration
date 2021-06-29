require('dotenv').config();
const express = require('express')
const path = require("path")
const auth = require("./middelware/auth")
const app = express()
const jwt = require("jsonwebtoken")
const hbs = require("hbs")
const Register = require("./models/registers")
const bcrypt = require("bcryptjs");
const async = require('hbs/lib/async');
const { ALL } = require('dns');
const cookieparser = require('cookie-parser')
require("./db/conn")
const port = process.env.PORT || 8000;
const publicviews = path.join(__dirname,"../templates/views");
const publicpartials = path.join(__dirname,"../templates/partials");
hbs.registerPartials(publicpartials)
app.use(express.json());
app.use(cookieparser());
app.use(express.urlencoded({extended:false}))
app.use(express.static(publicviews))
app.set('view engine',"hbs")
app.set("views",publicviews)

app.get("/",(req, res)=> {
    res.render(`register`)
})
app.get("/login",(req, res)=> {
    res.render(`login`)
})
app.get("/register", (req, res)=> {
    res.render('register')
    })
app.get("/info", auth ,async(req, res)=> {
     //console.log(`hello${req.cookies.jwt}`)
        res.render('info')
        })
app.get("/logout", auth, async(req, res)=> {
    try{
       // single logout
        //req.user.tokens = req.users.tokens.filter((currntelemet)=>{
       // return currntelemet.token =! req.token
        //})
        // multi logout
        req.user.tokens = [];

        res.clearCookie("jwt");
        //console.log("logout")
        await req.user.save();
        res.render('index')
    }catch(error){
        res.status(500).send(error)
    }
       
        })
    //Register validation
app.post("/register", async (req, res)=> {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if(password === cpassword){
            const registerEmployee = new Register({
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                email:req.body.email,
                gender:req.body.gender,
                phone:req.body.phone,
                age:req.body.age,
                password:password,
                confirmpassword:cpassword
            })
          const token = await registerEmployee.generateAuthToken();
          res.cookie("jwt",token, {
              expires:new Date(Date.now() + 50000),
              httpOnly:true
          })

            const registered = await registerEmployee.save()
            res.status(201).render("login")
        }else{
            res.send("Password not matching")
        }
    }catch(e){
       const er =  res.status(400).send("Sorry")
       console.log(er)
    }
})
app.post("/login", async (req, res)=> {
try{
    const email = req.body.email;
    const password = req.body.password;
    const useremail = await Register.findOne({email:email})
     const isMatch = await bcrypt.compare(password, useremail.password);
     const token = await useremail.generateAuthToken();
     res.cookie("jwt",token, {
        expires:new Date(Date.now() + 50000),
        httpOnly:true,
    })
         
     if(isMatch){
         res.status(201).render('info');
     }else{
         res.end('Sorry, Try Again')
     }
}catch(e){
    res.status(400).send("invalid email")
}
})

app.listen(port,()=> {
    console.log(`jbs`)
});