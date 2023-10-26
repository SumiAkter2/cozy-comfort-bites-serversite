const express = require("express");
const req = require("express/lib/request");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORT || 5000;

// middleware:
app.use(cors());
app.use(express());

// mongodb:

const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.8rhsfz4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    console.log("You successfully connected to MongoDB!");

    const menuCollection = client.db("cozyComfortBitesdb").collection("menu");
    const reviewCollection = client
      .db("cozyComfortBitesdb")
      .collection("reviews");
    const cartCollection = client.db("cozyComfortBitesdb").collection("carts");

    app.get("/menu", async (req, res) => {
      const result = await menuCollection.find().toArray();
      res.send(result);
    });
    app.get("/review", async (req, res) => {
      const result = await reviewCollection.find().toArray();
      res.send(result);
    });

    app.post("/carts", async (req, res) => {
      const cart = req.body;
      const result = await cartCollection.insertOne(cart);
      res.send(result);
    });

    app.get("carts", async (req, res) => {
      const result = await cartCollection.find().toArray();
      res.send(result);
    });
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Cozy Comfort Bites Is Your Favorite Restaurant");
});
app.listen(port, () => {
  console.log(`Cozy Comfort Bites is running on ${port}`);
});
