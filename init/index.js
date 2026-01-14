const mongoose=require("mongoose");
const listing=require("../models/listing.js")
const initdata=require("./data.js");

const mongo_url='mongodb://127.0.0.1:27017/wanderlust';

main()
.then((res)=>{
    console.log("Mongoose is connected to mongodb");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(mongo_url);
}

const initDB=async()=>{
    console.log(initdata.data)
    await listing.deleteMany({});
    console.log("prevoious deleted");
    initdata.data = initdata.data.map(obj => ({
    ...obj,
    owner: "6958c8ab8c4650e82c2e121b"
    }));
    await listing.insertMany(initdata.data);
    console.log("data was intialized");
    
}
initDB();