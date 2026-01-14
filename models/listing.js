let mongoose=require("mongoose");
const { listingSchema } = require("../schema");
const Review=require("./review.js")
const Schema=mongoose.Schema;

const listSchema=new mongoose.Schema({
    title:{
        type:String,
    },
    description:String,
    image:{
        url:String,
        filename:String,
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User"
    }
});

listSchema.post("findOneAndDelete",async(listing)=>{
    if(listing){
        await Review.deleteMany({_id:{$in:listing.reviews}})
    }
})

module.exports=mongoose.model("Listing",listSchema);
