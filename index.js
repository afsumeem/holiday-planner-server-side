const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;


const app = express();

//set port
const port = process.env.PORT || 5000;

//middleaware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send(' server is running');
});

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7s5ai.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        //set database and database collection
        const database = client.db("holidayPlanner");
        const packageCollection = database.collection("packages");
        const orderCollection = database.collection("orders");



        //GET API-popular packages
        app.get('/packages', async (req, res) => {
            const packages = await packageCollection.find({}).toArray();
            res.send(packages);
        })


        //POST API -booking orders
        app.post('/orders', async (req, res) => {
            const orders = await orderCollection.insertOne(req.body);
            res.json(orders);
        });


        //GET API-booking orders
        app.get('/orders', async (req, res) => {
            const orders = await orderCollection.find({}).toArray();
            res.send(orders);
        })



    } finally {
        //await client.close();
    }
}

run().catch(console.dir);



app.listen(port, () => {
    console.log('Server running at port', port);
});