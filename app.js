if(!process.env.NODE_ENV!="production"){
    require('dotenv').config()
}
const express=require("express");
const mongoose=require("mongoose");
const ejsMate = require('ejs-mate');
const path=require("path");
const ExpressError=require("./utils/ExpressError.js")
const cookieParser=require("cookie-parser")
const session=require("express-session")
const flash=require("connect-flash")
const passport=require("passport")
const localStrategy=require("passport-local")
// const passportLocalMongoose=require("passport-local-mongoose")
const User=require("./models/user.js")
const MongoStore = require("connect-mongo").MongoStore;


console.log(MongoStore);



const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js")
const userRouter=require("./routes/user.js")

let app=express();
let port=8080;

app.listen(port,(req,res)=>{
    console.log("app is listening");
})

app.use(express.json());
app.engine('ejs',ejsMate);
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({extended:true}));
const methodOverride=require("method-override");
app.use(methodOverride("_method"));

const dbUrl=process.env.ATLASDB_URL;

main()
.then((res)=>{
    console.log("Mongoose is connected to mongodb");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
}

app.get("/",(req,res)=>{
    console.log("writing")
    res.send("Its working");
})


const store = new MongoStore({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET
    },
    touchAfter: 24 * 3600
});

store.on("error",()=>{
    console.log("Error in mongo session store",err)
})
sessionOptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
    }
}

app.use(session(sessionOptions))
app.use(flash())


app.use(passport.initialize()) 
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success")
    res.locals.error=req.flash("error")
    res.locals.currUser=req.user
    next()
})


app.use("/listing",listingRouter)
app.use("/listing/:id/reviews",reviewRouter)
app.use("/",userRouter)


app.use((err,req,res,next)=>{
    let {statusCode=500,message="some random error"}=err;
    res.render("error.ejs",{message,err,statusCode});
})

