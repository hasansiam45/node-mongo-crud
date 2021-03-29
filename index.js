const express = require('express');
const password = 'hasansiam2020';
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
const uri = "mongodb+srv://hasansiam:hasansiam2020@cluster0.pqklg.mongodb.net/hasansiamdb?retryWrites=true&w=majority";

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}))
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})


const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});
client.connect(err => {
    const collection = client.db("hasansiamdb").collection("products");

    app.get('/products', (req, res) => {
        collection.find({})
            .toArray((err, documents) => {
                res.send(documents);
            })
    })

    app.get('/product/:id', (req, res) => {
        collection.find({
                _id: ObjectId(req.params.id)
            })
            .toArray((err, documents) => {
                res.send(documents[0])
            })
    })

    app.post('/addProduct', (req, res) => {
        const product = req.body;
        collection.insertOne(product)
            .then(result => {
                console.log('product added successfully')
                res.redirect('/')
            })
    })

    app.patch('/update/:id', (req, res) => {
        collection.updateOne({
                    _id: ObjectId(req.params.id)
                },

                {
                    $set: {
                        price: req.body.price,
                        quantity: req.body.quantity
                    }
                }
            )
            .then(result => {
                res.send(result.modifiedCount > 0)
            })

    })

    app.delete('/delete/:id', (req, res) => {
        collection.deleteOne({
                _id: ObjectId(req.params.id)
            })
            .then(result => {
                res.send(result.deletedCount > 0)
            })
    })
    // perform actions on the collection object


});



app.listen(3000);