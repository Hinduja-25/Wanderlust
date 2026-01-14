const express=require("express")
const wrapAsync=require("../utils/wrapAsync.js");
const ExpressError=require("../utils/ExpressError.js")
const listing=require("../models/listing.js")
const {isLoggedIn,isOwner,validateListing}=require("../mw.js")
const router=express.Router()

const multer  = require('multer')
const{storage}=require("../cloudConfig.js")
const upload = multer({storage})

const listingController=require("../controllers/listing.js")

router.get("/new",isLoggedIn,listingController.renderNewForm)
router.
    route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,upload.single('listing[image]'),validateListing,wrapAsync(listingController.createListing))


router.
    route("/:id")
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn,isOwner,upload.single('listing[image]'),validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner,listingController.destroyListing)

//updateForm route
router.get("/:id/update",isLoggedIn,listingController.renderEditForm)

//New Route


module.exports=router

