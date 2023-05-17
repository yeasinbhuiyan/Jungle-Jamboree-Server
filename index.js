const express = require('express');

const cors = require('cors');
const app = express()
require('dotenv').config()

const port = process.env.PORT || 5000


// middleWear

app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9xgdj4e.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        const database = client.db("jungleJamboree");
        const allToysCollection = database.collection("allToysCollection");



        app.get('/allToys', async (req, res) => {

            let query = {}
            if (req?.query?.email) {
                query = { seller_email: req.query.email }
            }
            if (query) {
                const result = await allToysCollection.find(query).toArray()
                res.send(result)
                console.log(query,result)
            }
            else {
                const result = await allToysCollection.find().toArray()
                res.send(result)
            }

        })


        app.post('/addToys', async (req, res) => {
            const body = req.body
            //  console.log(body)
            const result = await allToysCollection.insertOne(body)
            res.send(result)
        })




        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);





app.get('/', (req, res) => {
    res.send('This Is Jungle Jamboree server')
})

app.listen(port, () => {
    console.log(`this server running on ${port} port`)

})
