const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const employeeSchema = new mongoose.Schema({
    firstname : {
        type : String,
        required: true
    },
    lastname : {
        type : String,
        required: true
    },
    email :{
        type : String,
        required: true,
        unique : true
    },
    gender : {
        type : String,
        required: true
    },
    phone : {
        type : String,
        required: true,
        unique : true,
        minlength:10
    },
    age : {
        type : Number,
        required: true
    },
    password:{
        type : String,
        required: true,
    },
    confirmpassword :{
        type : String,
        required: true
    },
    tokens:[{
        token:{
        type : String,
        required: true
        }
    }]
})
employeeSchema.methods. generateAuthToken = async function(){
    try{
        
        const token = jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
        this.tokens = this.tokens.concat({token})
        await this.save();
        return token;
    }catch(error){
        res.send("the error part" + error);
        console.log("the error part" + error);
}
}

employeeSchema.pre("save", async function(next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
        this.confirmpassword=await bcrypt.hash(this.password,10)
    }
    next();
})
// now we need to create a collection

const Register = new mongoose.model("Register",employeeSchema);
module.exports = Register;