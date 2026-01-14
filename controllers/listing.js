const listing=require("../models/listing.js")

module.exports.index=async(req,res)=>{
    const lists=await listing.find();
    res.render("./listings/index.ejs",{lists});
}

module.exports.createListing=async(req,res,next)=>{
        let url=req.file.path
        let filename=req.file.filename
        //if(!req.body.listing)throw new ExpressError(400,"send a valid data");
        let{title,description,image,price,location,country}=req.body.listing;
        console.log(req.body.listing);
        let newList=new listing({
        title:title,
        description:description,
        image:{url,filename},
        price:price,
        location:location,
        country:country
    })
    newList.owner=req.user._id
    await newList.save();
    req.flash("success","New listing added")
    res.redirect("/listing");
} 

module.exports.updateListing=async(req,res)=>{
    let {id}=req.params;
    let newData=req.body.listing;
    let list=await listing.findByIdAndUpdate(`${id}`,{...newData})
    if(typeof req.file!="undefined"){
        let url=req.file.path
        let filename=req.file.filename
        list.image={url,filename}
        await list.save()
    }
    req.flash("success","listing updated")
    res.redirect(`/listing/${id}`);
}

module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(`${id}`)
    .then((req)=>{
        console.log("deleted");
    }).catch(err=>console.log(err));
    req.flash("success","listing deleted")
    res.redirect("/listing");
}

module.exports.renderEditForm=async(req,res)=>{
    let {id}=req.params;
    const list=await listing.findById(id);
    if(!list){
        req.flash("error","listing you requested for does not exist")
        return res.redirect("/listing")
    }
    let originalImageUrl=list.image.url
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250")
    res.render("./listings/update",{list,originalImageUrl});
}

module.exports.renderNewForm=(req,res)=>{
    console.log(req.user)
    
    res.render("./listings/new.ejs");
}

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const list=await listing.findById(id).
    populate({
        path:"reviews",
        populate:{
            path:"author"
        },
    })
    .populate("owner");
    if(!list){
        req.flash("error","listing you requested for does not exist")
        return res.redirect("/listing")
    }
    res.render("./listings/show.ejs",{list});
}