
var express = require('express')
var cors = require('cors')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
var app = express()
var port = process.env.PORT || 3000;

// middlewire
app.use(cors())
app.use(express.json())


const uri = `mongodb+srv://${process.env.DB_user}:${process.env.DB_pass}@cluster0.exrbbd1.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    //await client.connect();

    // database

    const database = client.db("time_tracking")
    const projectscollection = database.collection("projects")

    app.post("/projects", async (req, res) => {
      const user = req.body
      const result = await projectscollection.insertOne(user)
      res.send(result)
    })

    app.get("/projects", async (req, res) => {
      const result = await projectscollection.find().toArray()
      res.send(result)
    })

    app.get('/projects/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const result = await projectscollection.findOne(query)
      res.send(result)
    })
    app.patch('/projects/:_id', async (req, res) => {
      const id = req.params._id
      const item = req.body
      const query = { _id: new ObjectId(id) }
      const updateDoc = {
        $set: {
          second: item.newsecond,
          minute: item.newminute,
          hour: item.newhour
        }
      }

      const result = await projectscollection.updateOne(query, updateDoc)
      res.send(result)
    })



    // Send a ping to confirm a successful connection
    //await client.db("admin").command({ ping: 1 });
    //console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send("running time tracking")
})
app.listen(port, () => {
  console.log(`running time tracking on ${port}`)
})
