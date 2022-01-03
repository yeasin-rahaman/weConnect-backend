const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uc5dq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("weConnect");
    const serviceCollection = database.collection("services");
    const usersCollection = database.collection("allUsers");

  //  Service API 
    app.get("/services",async(req,res)=>{
      const query = {}
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.json(services);
    })
    // service heighlight api 
    app.get("/serviceheighlight",async(req,res)=>{
      const query = {}
      const cursor = serviceCollection.find(query).limit(4);
      const result = await cursor.toArray();
      res.json(result);
    })

    // Users API 
    app.get("/users",async(req,res)=>{
      const query = {}
      const cursor = usersCollection.find(query);
      const users = await cursor.toArray();
      res.json(users);
    })
    // user by id 
    app.get("/users/:id",async(req,res)=>{
      const {id} = req.params;
      const query = {_id: ObjectId(id)}
      const profile = await usersCollection.findOne(query)
      res.json(profile);
    })

    // new user input 
    app.post("/newuser",async(req,res)=>{
      const newUser = req.body;
      const result = await usersCollection.insertOne(newUser);
      res.json(result)
    })
  
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello weConnect!");
});

app.listen(port, () => {
  console.log(`Server Running at ${port}`)
})

