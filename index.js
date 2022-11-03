const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;


//middleware

app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_NAME}:${process.env.DB_PASS}@cluster0.ddpko0x.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const productCollection = client.db('emajon').collection('products')


        app.get('/products', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);

            const query = {}
            const cursor = productCollection.find(query);
            const products = await cursor.skip(page * size).limit(size).toArray();
            const count = await productCollection.estimatedDocumentCount();
            res.send({ count, products });
        });

        app.post('/productsByIds', async (req, res) => {
            const ids = req.body;
            const objectIds = ids.map(id => ObjectId(id))
            const query = { _id: { $in: objectIds } };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();
            res.send(products);
        })
    }
    finally {

    }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send("API Working...");
})
app.listen(port, () => {
    console.log(`Server Running...${port}`)
})