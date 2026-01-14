let mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose")
const Schema=mongoose.Schema;


const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
})

userSchema.plugin(passportLocalMongoose.default);
module.exports=mongoose.model("User",userSchema)