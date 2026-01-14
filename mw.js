let listing=require("./models/listing.js");
const review = require("./models/review.js");
const {listingSchema,reviewSchema}=require("./schema.js");
const ExpressError=require("./utils/ExpressError.js")

module.exports.isLoggedIn=(req,res,next)=>{
    if(!req.isAuthenticated()){
        //redirectUrl
        req.session.redirectUrl=req.originalUrl
        req.flash("error","you must be logged in to create a listing")
        return res.redirect("/login")
    }
    next()
}

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl
    }
    next()
}

module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params
    let list=await listing.findById(id)
        if(!list.owner.equals(res.locals.currUser._id)){
            req.flash("error","you dont have permission to edit")
            return res.redirect(`/listing/${id}`)
        }
    next()
}

module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params
    let rev=await review.findById(reviewId)
        if(!rev.author.equals(res.locals.currUser._id)){
            req.flash("error","you are not author of this review")
            return res.redirect(`/listing/${id}`)
        }
    next()
}

module.exports.validateListing=(req,res,next)=>{
    const {error}=listingSchema.validate(req.body);
    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg)
    }else{
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);

    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};