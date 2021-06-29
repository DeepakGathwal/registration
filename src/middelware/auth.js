const jwt = require("jsonwebtoken");
const { model } = require("mongoose");
const Register = require("../models/registers")
const auth = async (req,res,next) => {
try{
    const  token = req.cookies.jwt
    const verifytoken = jwt.verify(token,process.env.SECRET_KEY);
    const user = await Register.findOne({_id:verifytoken._id})
    req.token =token;
    req.user = user;
    next();
}catch(error){
    res.status(401).send(error)
}
}
module.exports = auth;