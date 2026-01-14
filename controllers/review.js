const review=require("../models/review.js")
const listing=require("../models/listing.js")

module.exports.createReview=async(req,res)=>{
    const list=await listing.findById(req.params.id);
    let newReview=new review(req.body.review);
    newReview.author=req.user._id
    list.reviews.push(newReview);

    await newReview.save();
    await list.save();
    req.flash("success","New review created")
    res.redirect(`/listing/${list._id}`)
}

module.exports.deleteReview=async(req,res)=>{
        let {id,reviewId}=req.params
        await listing.findByIdAndUpdate(id,{$pull: {reviews:reviewId}})
        await review.findByIdAndDelete(reviewId)
        req.flash("success","review deleted")
        res.redirect(`/listing/${id}`)
}