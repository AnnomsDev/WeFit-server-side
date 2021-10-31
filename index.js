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

        // GET API - Get orders by email
        app.get('/my-orders/:email', async (req, res) => {
            const email = req.params.email;
            const myOrders = await ordersCollection.find({ email: email }).toArray()
            console.log(myOrders)
            res.json(myOrders)


        })

        // GET API - all orders
        app.get('/all-orders', async (req, res) => {
            const allOrders = await ordersCollection.find({}).toArray()
            console.log(allOrders)
            res.json(allOrders)

        })


        // DELETE API - Delete order by _id
        app.delete('/delete/:id', async (req, res) => {
            const id = req.params.id
            const result = await ordersCollection.deleteOne({ _id: ObjectId(id) })
            console.log("1 item is deleted")
            res.json(result)
        })



        // PUT API - update order status
        app.put('/change-status', async (req, res) => {
            const id = req.body.id;
            console.log('Got and status update request for id: ', id)
            const update = { $set: { status: 'confirmed' } }
            const result = await ordersCollection.updateOne({ _id: ObjectId(id) }, update)
            res.json(result)
        })












    }
    finally {

    }

}
run().catch(console.dir)



app.listen(port, () => console.log("Server is running on port ", port))