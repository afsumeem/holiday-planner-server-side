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
    res.send(' Holiday Planner Server is running');
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
        });


        //POST API- New package
        app.post('/packages', async (req, res) => {
            const packages = await packageCollection.insertOne(req.body);
            res.json(packages);
        });


        //GET API - package details
        app.get('/packages/:id', async (req, res) => {
            const packageDetails = await packageCollection.findOne({ _id: ObjectId(req.params.id) });
            res.send(packageDetails);
            console.log(packageDetails);
        });


        //POST API -booking orders
        app.post('/orders', async (req, res) => {
            const orders = await orderCollection.insertOne(req.body);
            res.json(orders);
        });


        //GET API-booking orders
        app.get('/orders', async (req, res) => {
            const orders = await orderCollection.find({}).toArray();
            res.send(orders);
        });


        //UPDATE API - booking orders status property
        app.put('/orders/:id', async (req, res) => {
            const order = req.body;
            const options = { upsert: true };
            const updatedOrder = {
                $set: { status: order.status }
            };
            const updateStatus = await orderCollection.updateOne({ _id: ObjectId(req.params.id) }, updatedOrder, options);

            res.json(updateStatus);
        });


        //Delete API- delete order
        app.delete('/orders/:id', async (req, res) => {
            const deletedOrder = await orderCollection.deleteOne({ _id: ObjectId(req.params.id) });
            res.json(deletedOrder)
        });



    } finally {
        //await client.close();
    }
}

run().catch(console.dir);



app.listen(port, () => {
    console.log('Server running at port', port);
});