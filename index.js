const express = require('express')
const app = express()
var cors = require('cors')
require('dotenv').config()

const port = process.env.PORT || 5000 ;

app.use(cors())
app.use(express.json());

const { MongoClient } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.uc5dq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    await client.connect();
    const database = client.db("weConnect");
    const serviceCollection = database.collection("services");
   
    app.get("/services",async(req,res)=>{
      const query = {}
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.json(services);
    })
  
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello weConnect!')
})

app.listen(port, () => {
  console.log(`Server Running at http://localhost:${port}`)
})
// New Branch Created named, munna-branch