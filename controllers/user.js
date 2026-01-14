const User=require("../models/user.js");

module.exports.renderSignupForm=(req,res)=>{
    res.render("./users/signup.ejs")
}

module.exports.signup=async(req,res,next)=>{
    try{
        let {username,email,password}=req.body
        let newuser=new User({username,email})
        let registerUser=await User.register(newuser,password)
        req.login(registerUser,(err)=>{
            if(err){
            next(err)
        }
        req.flash("success","User registered successfully")
        res.redirect(req.session.redirectUrl)
        })
        console.log(registerUser)
    }catch(e){
        req.flash("error",e.message)
        res.redirect("/signup")
    }
}

module.exports.renderLoginForm=(req,res)=>{
    res.render("./users/login.ejs")
}

module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        req.flash("success","you have logged out now")
        res.redirect("/listing")
    })
}

