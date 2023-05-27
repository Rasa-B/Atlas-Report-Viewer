require('dotenv').config();
const mongoose=require('mongoose');
 mongoose.set('strictQuery', true);
mongoose.connect(process.env.MONGODB_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(()=>{
        console.log("DB CONNECTED");
    })
    .catch((err)=>{
        console.log("DB connection failed.exiting now...");
        console.error(err);
        process.exit(1);
    });

// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://SuperAdmin:XzDOQSkS37SKjUSf@atlasreportviewer.jnz3wgp.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });