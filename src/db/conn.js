const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/registration",{
    useCreateIndex : true,
   // user : true,
    useFindAndModify : true,
    useUnifiedTopology : true,
    useNewUrlParser : true
}).then(()=>{
    console.log(`conection successful`)
}).catch((e)=>{
    console.log("Not find")
})
//module.exports = Conn;
