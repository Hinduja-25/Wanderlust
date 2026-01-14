const express=require("express")
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const User=require("../models/user.js");
const passport = require("passport");
const {saveRedirectUrl}=require("../mw.js")
const router=express.Router()

const userController=require("../controllers/user.js")

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync(userController.signup))

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome to wanderlust you are logged in")
    let redirectUrl=res.locals.redirectUrl || "/listing"
    res.redirect(redirectUrl)
})

router.get("/logout",userController.logout)

module.exports=router