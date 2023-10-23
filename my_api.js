const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());


const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/Mydatabase', {useNewUrlParser: true});

const playerSchema = new mongoose.Schema({
    Name: String, 
    jerseyNumber: Number,
    team: String,
    nationality: Number, 
    position: string
  });
  
  const Player = mongoose.model('Player', playerSchema);

  app.post('/players', (req, res) => {
    let newPlayer = new Player(req.body);
  newPlayer.save()
  .then((savedPlayer) => {
    res.status(201).send(savedPlayer._id);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
  });
  

  // Update a player
  app.put('/players/:id', (req, res) => {
    Player.findByIdAndUpdate(req.params.id, req.body, {new: true}).then((players) => {
        res.send(players);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });

  


  // Delete a player 
  app.delete('/players/:id', (req, res) => {
    Player.findByIdAndRemove(req.params.id).then((players) => {
        res.send("Player deleted");
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });
  
  app.get('/players/byjerseyNumber/:jerseyNumber', (req, res) => {
    Player.find({ jerseyNumber: req.params.jerseyNumber })
      .then((players) => {
        res.send(players);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });

  app.get('/players', (req, res) => {
    Player.find()
      .then((players) => {
        res.send(players);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });
  


  app.listen(3000, () => {
    console.log('Server listening on port 3000');