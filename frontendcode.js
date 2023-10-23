const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/RameezDB';

app.use(bodyParser.json());

MongoClient.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log(`Connected to Mydatabase: ${mongoUrl}`);
  const db = client.db();

  app.get('/RameezDB/data', async (req, res) => {
    try {
      const data = await db.collection('data').find().toArray();
      res.send(data);
    } catch (error) {
      console.error('Error fetching data from database:', error);
      res.status(500).send('Error fetching data from database');
    }
  });

  app.post('/RameezDB/data', async (req, res) => {
    const newData = req.body;
    try {
      const result = await db.collection('data').insertOne(newData);
      res.send(result.ops[0]);
    } catch (error) {
      console.error('Error inserting data into database:', error);
      res.status(500).send('Error inserting data into database');
    }
  });

  app.put('/RameezDB/data/:id', async (req, res) => {
    const id = req.params.id;
    const updatedData = req.body;
    try {
      const result = await db.collection('data').updateOne({ _id: ObjectId(id) }, { $set: updatedData });
      res.send(result);
    } catch (error) {
      console.error('Error updating data in database:', error);
      res.status(500).send('Error updating data in database');
    }
  });

  app.delete('/RameezDB/data/:id', async (req, res) => {
    const id = req.params.id;
    try {
      const result = await db.collection('data').deleteOne({ _id: ObjectId(id) });
      res.send(result);
    } catch (error) {
      console.error('Error deleting data from database:', error);
      res.status(500).send('Error deleting data from database');
    }
  });

  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
});
