const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const app = express();
const port = process.env.PORT || 5000;

//use middleware
app.use(cors());
app.use(express.json());

//dbuser2
//lNQ43btPnZnhSgYG




const uri = "mongodb+srv://dbuser2:lNQ43btPnZnhSgYG@cluster0.z9xi9.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// client.connect(err => {
//   const collection = client.db("foodExpress").collection("users");
//   console.log('db connected');
//   client.close();
// });

async function run(){
    try{
        await client.connect();
        const usersCollection = client.db("foodExpress").collection("user");
        // const user ={name:'Samiran Das',email:'dassamiran05@gmail.com'};
        // const result = await usersCollection.insertOne(user);
        // console.log(`User inserted with id ${result.insertedId}`);

        //Get User
        app.get('/users', async(req, res)=>{
            const query ={};
            const cursor = usersCollection.find(query);
            const users = await cursor.toArray();
            res.send(users);
        })

        //Get single user by id
        app.get('/user/:id', async(req, res) =>{
            const id =req.params.id;
            const query = {_id:ObjectId(id)};
            const result = await usersCollection.findOne(query);
            res.send(result);
        })


        //Post User: add a new user
        app.post('/user', async(req, res)=>{
            const newUser = req.body;
            console.log('Adding new User', newUser);
            const result = await usersCollection.insertOne(newUser);
            res.send(result);
        })
        //Update user
        app.put('/user/:id', async(req,res)=>{
            const id = req.params.id;
            const updatedUser = req.body;
            const filter = {_id:ObjectId(id)};
            const options = {upsert :true};
            const updatedDoc = {
                $set:{
                    name:updatedUser.name,
                    email:updatedUser.email
                }
            };
            const result = await usersCollection.updateOne(filter, updatedDoc, options);
            res.send(result);
        })


        //Delete a user
        app.delete('/user/:id', async(req, res) =>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await usersCollection.deleteOne(query);
            res.send(result);
        })
    }
    finally{
        //await client.close();
    }
}

run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('Running my node crud server');
});

app.listen(port, () =>{
    console.log('Running crud server on', port);
})