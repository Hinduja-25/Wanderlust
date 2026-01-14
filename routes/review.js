const express=require("express")
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const review=require("../models/review.js")
const listing=require("../models/listing.js")
const {validateReview,isLoggedIn,isReviewAuthor}=require("../mw.js")
const router=express.Router({mergeParams:true})

const reviewController=require("../controllers/review.js")

router.post(
    "/",
    validateReview,isLoggedIn,
    wrapAsync(reviewController.createReview))

//delete review route

router.delete("/:reviewId",
    isLoggedIn,isReviewAuthor,
    wrapAsync(reviewController.deleteReview)
)

module.exports=router
