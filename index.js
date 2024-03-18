const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cookieParser = require("cookie-parser");
const port = process.env.PORT || 5000;

// MIDDLEWARE
app.use(express.json());
app.use(cookieParser());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ctziwlh.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const userCollection = client.db("stayFinder").collection("users");
const hotelCollection = client.db("stayFinder").collection("hotels");

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    // console.log(
    //   "Pinged your deployment. You successfully connected to MongoDB!"
    // );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//--------------------------------------------------//

// user related apis ------------------------------------------

app.post("/users", async (req, res) => {
  const user = req.body;
  const result = await userCollection.insertOne(user);
  res.send(result);
});
app.post("/hotels", async (req, res) => {
  const user = req.body;
  const query = { email: user.email };
  const existingUser = await userCollection.findOne(query);
  if (existingUser) {
    return res.send({ message: "User already exist", insertedId: null });
  }
  const result = await userCollection.insertOne(user);
  res.send(result);
});

app.get("/hotels", async (req, res) => {
  const cursor = hotelCollection.find();
  const result = await cursor.toArray();
  res.send(result);
});

app.get("/hotels/details/:id", async (req, res) => {
  const id = req.params.id;
  const query = { _id: new ObjectId(id) };
  const result = await hotelCollection.findOne(query);
  res.send(result);
});

// okay from here
// home ------------------------------------------------

app.get("/", (req, res) => {
  res.send("Stay Finder Server is running");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
