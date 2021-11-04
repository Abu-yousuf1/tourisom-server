const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config()

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())
app.use(express.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.o9fdd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();

        const database = client.db("tourismDb")
        const serviceCollection = database.collection("services")
        const orderCollection = database.collection('orders')

        //get method....all service
        app.get('/services', async (req, res) => {
            const cursor = serviceCollection.find({});
            const services = await cursor.toArray();
            res.send(services)
        })

        app.get('/orders', async (req, res) => {
            const cursor = orderCollection.find({});
            const orders = await cursor.toArray();
            res.send(orders)
        })
        //post .....order services
        app.post('/orders', async (req, res) => {
            const order = req.body
            const result = await orderCollection.insertOne(order)
            res.json(result)
        })

        app.post('/services', async (req, res) => {
            const cursor = req.body
            const service = await serviceCollection.insertOne(cursor)
            res.json(service)
        })



        app.post('/logInService', async (req, res) => {
            const email = []
            const getEmail = req.body.email;
            email.push(getEmail)
            console.log(email);
            const query = { email: { $in: email } }
            const services = await orderCollection.find(query).toArray();
            res.json(services)
        })

        // deleting order service......
        app.delete('/logInService/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await orderCollection.deleteOne(query)
            console.log(result);
            res.json(result)
        })

    } finally {

    }
} run().catch(console.dir)

app.get('/', (req, res) => {
    console.log("hello world");
    res.send("hello world")
})

app.listen(port, () => {
    console.log("listening to ", port);
})