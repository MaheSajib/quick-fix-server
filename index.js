const express = require('express')
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ep4dk.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
console.log(uri);


const port =process.env.PORT || 5055

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello DataBase Working!')
  })

  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  client.connect(err => {
    const serviceCollection = client.db("quickFix").collection("service");
    const testimonialCollection = client.db("quickFix").collection("testimonials");
    const orderCollection = client.db("quickFix").collection("order");
    const adminCollection = client.db("quickFix").collection("admin");

    app.get('/services', (req, res) => {
      serviceCollection.find()
      .toArray((err, items) => {
        res.send(items)
      })
    })

    app.post('/addService', (req, res) =>{
        const newService = req.body;
        console.log('adding new service:', newService);
        serviceCollection.insertOne(newService)
        .then(result => {
          console.log('inserted count', result.insertedCount)
          res.send(result.insertedCount > 0)
        })
      })


      app.get('/testimonials', (req, res) => {
        testimonialCollection.find()
        .toArray((err, testimonials) => {
          res.send(testimonials)
        })
      })

      app.post('/addTestimonial', (req, res) => {
        const newTestimonial = req.body;
        console.log('adding new Testimonial:', newTestimonial);
        testimonialCollection.insertOne(newTestimonial)
        .then(result => {
          console.log('inserted count', result.insertedCount)
          res.send(result.insertedCount > 0)
        })
      })

      app.post('/addOrder', (req, res) =>{
        const newOrder = req.body;
        console.log('adding new order:', newOrder);
        orderCollection.insertOne(newOrder)
        .then(result => {
          console.log('inserted count', result.insertedCount)
          res.send(result.insertedCount > 0)
        })
      })


      app.get('/orderList', (req, res) => {
        orderCollection.find()
        .toArray((err, orders) => {
          res.send(orders)
        })
      })


      app.post('/addAdmin', (req, res) =>{
        const newAdmin = req.body;
        console.log('adding new admin:', newAdmin);
        adminCollection.insertOne(newAdmin)
        .then(result => {
          console.log('inserted count', result.insertedCount)
          res.send(result.insertedCount > 0)
        })
      })


      app.get('/adminCheck', (req, res) => {
        const email = req.query.email;
        adminCollection.find({email: email})
        .toArray((err, admin) => {
          console.log(admin.length)
          res.send(admin)
        })
      })


      app.patch('/processStatus', (req, res) => {
        const status = req.query.status;
        const id = req.query.id;
        console.log(req.query);
        orderCollection.updateOne({_id: ObjectId(id)}, { $set : {status: status}})
        .then(result => {
          res.send(result.modifiedCount > 0);
        })
      })

      app.delete('/deleteService/:id', (req, res) => {
        const id = req.params.id;
        serviceCollection.findOneAndDelete({_id: ObjectId(id)})
        .then(result => {
          res.send(result.deletedCount > 0);
        })
      })



  });


app.listen(process.env.PORT || port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })