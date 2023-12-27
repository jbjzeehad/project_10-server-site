// DGbtAJdaLlUl4Nzy
// library11

const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@library-management.x2cb2sv.mongodb.net/?retryWrites=true&w=majority`;

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

        const database = client.db('libraryDB');

        const bookCollection = database.collection('allbooks');
        const browBookColl = database.collection('borrowedbooks');

        app.post('/allbooks', async (req, res) => {
            const addbooks = req.body;
            // console.log('New book:', addbooks);
            const addingBooks = await bookCollection.insertOne(addbooks);
            res.send(addingBooks);
        })

        app.get('/allbooks', async (req, res) => {
            const books = bookCollection.find();
            const bookresult = await books.toArray();
            res.send(bookresult);
        })

        app.get('/allbooks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const user = await bookCollection.findOne(query);
            res.send(user);
            // console.log('update : ', user);
        })

        app.put('/allbooks/:id', async (req, res) => {
            const id = req.params.id;
            const user = req.body;
            // console.log(id, user);
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updatedUser = {
                $set: {
                    image: user.image,
                    bookName: user.bookName,
                    authorName: user.authorName,
                    category: user.category,
                    rating: user.rating,
                    amount: user.amount
                }
            }
            const result = await bookCollection.updateOne(filter, updatedUser, options);
            res.send(result);
        })

        app.get('/borrowedbooks', async (req, res) => {
            const getbooks = browBookColl.find();
            const getbookresult = await getbooks.toArray();
            res.send(getbookresult);
        })

        app.post('/borrowedbooks', async (req, res) => {
            const browBooks = req.body;
            // console.log('New book:', browBooks);
            const addingBrwBooks = await browBookColl.insertOne(browBooks);
            res.send(addingBrwBooks);
        })

        app.delete('/borrowedbooks/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await browBookColl.deleteOne(query);
            res.send(result);
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
    res.send('SERVER IS RUNNING');
});

app.listen(port, () => {
    console.log(`RUNNING ON : ${port}`);
});

