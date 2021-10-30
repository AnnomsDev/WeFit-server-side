const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors())
app.use(express.json())

//Default GET API
app.get('/', (req, res) => {
    res.send('Adventure love server is running')
})




// Connetc with mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.q3v5j.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log('connected')

        const database = client.db('adventure-lover')
        const serviceCollec = database.collection('services')
        const ordersCollection = database.collection("orders")


        // GET API - all services
        app.get('/services', async (req, res) => {
            const cursor = serviceCollec.find({})
            const services = await cursor.toArray()
            res.json(services);
        })


        // GET API - service by id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const service = await serviceCollec.findOne({ _id: ObjectId(id) })
            console.log(service)
            res.json(service)
        })


        // POST API - place order
        app.post('/place-order', async (req, res) => {
            console.log('post hit')
            const order = req.body

            const result = await ordersCollection.insertOne(order)
            console.log("A new order is placed , inserted id is: ", result.insertedId)

            res.json(result)

        })






    }
    finally {

    }

}
run().catch(console.dir)



app.listen(port, () => console.log("Server is running on port ", port))