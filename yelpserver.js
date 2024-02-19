//load keys from the .env file
require('dotenv').config();
const mongoose = require('mongoose');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

// Connect to MongoDB and once connected listen for requests on port 5678
mongoose
  .connect(process.env.URI)
  .then(() => console.log(`Connected to MongoDB`))
  .catch((err) => console.log(`Error connecting to MongoDB`, err));

const db = mongoose.connection; //set db to mongoose connection
const collection = db.collection(process.env.COL); //set collection to full database collection

const yelp = require('yelp-fusion');
const client = yelp.client(process.env.yelpAPIkey);

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

var corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

//mongo endpoints here

app.put('/favorites/:userID/:businessID', function (req, res) {
  const businessID = req.params.businessID;
  const userID = req.params.userID;
  const favorite = req.body;

  collection
    .findOne({ userID: userID, 'favorites.id': businessID })
    .then((result) => {
      var rsp_obj = {}; // create a response object to store response message and status code
      if (result) {
        collection
          .updateOne({ userID: userID }, { $pull: { favorites: favorite } })
          .then((result) => {
            rsp_obj.message = 'Business is already in favorites and has now been removed';
            rsp_obj.isFavorite = false;
            rsp_obj.status = 200; // set the status code in the response object
            res.send(rsp_obj); // send the response object to the client
          })
          .catch((err) => {
            rsp_obj.message = 'error - add to favorite failed';
            rsp_obj.isFavorite = false;
            rsp_obj.status = 500;
            res.send(rsp_obj);
          });
      } else {
        collection
          .updateOne({ userID: userID }, { $push: { favorites: favorite } })
          .then((result) => {
            rsp_obj.message = 'Business added to favorites';
            rsp_obj.status = 200;
            res.send(rsp_obj);
          })
          .catch((err) => {
            rsp_obj.message = 'error - add to favorite failed';
            rsp_obj.status = 500;
            res.send(rsp_obj);
          });
      }
    })
    .catch((err) => {
      var rsp_obj = {};
      rsp_obj.message = 'error - issue finding business in favorites';
      rsp_obj.isFavorite = false;
      rsp_obj.status = 509;
      res.send(rsp_obj);
    });
});

// //get user obj based on userID
// app.get("/user/:userID", async function (req, res) {
//   var id = req.params.userID;

//   const cursor = await coll.findOne({ UID: id });
//   return res.status(200).send(cursor);
// });

// NEW get all favorite businesses of a user
app.get('/favorites/:userID', async function (req, res) {
  const userID = req.params.userID;

  try {
    const user = await collection.findOne({ userID: userID });
    if (!user) {
      return res.status(404).send('User not found');
    }

    const favorites = user.favorites;
    return res.status(200).send(favorites);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server error');
  }
});

// NEW check if business exists in user favs returns response obj with isFavorite true or false
app.get('/isfav/:userID/:bizID', async function (req, res) {
  const userID = req.params.userID;
  const businessID = req.params.bizID;

  collection
    .findOne({ userID: userID, 'favorites.id': businessID })
    .then((result) => {
      if (result) {
        res.status(200).send({ isFavorite: true, message: 'Business exists in favorites' });
      } else {
        res.status(200).send({
          isFavorite: false,
          message: 'Business does not exist in favorites',
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        isFavorite: false,
        message: 'Error finding business in favorites',
      });
    });
});

//edit preferences
app.patch('/preferences/:userID', async function (req, res) {
  var id = req.params.userID;

  const newPreferences = {
    hotel: req.body.hotel,
    breakfast: req.body.breakfast,
    lunch: req.body.lunch,
    activity: req.body.activity,
    dinner: req.body.dinner,
  };

  coll.updateOne({ UID: id }, { $set: { preferences: newPreferences } });
  return res.status(201).send(newPreferences);
});

//add trip with data
app.post('/trip/:userID', async function (req, res) {
  var id = req.params.userID;

  const trip = {
    id: '1',
    destination: req.body.destination,
    from: req.body.from,
    to: req.body.to,
    hotel: req.body.hotel,
    breakfast: req.body.breakfast,
    lunch: req.body.lunch,
    activity: req.body.activity,
    dinner: req.body.dinner,
  };

  coll.updateOne({ UID: id }, { $push: { trips: trip } });

  return res.status(201).send(trip);
});

// NEW add a user profile for user for the first time.
app.post('/user/:userID', async function (req, res) {
  var userID = req.params.userID;

  collection
    .findOne({ userID: userID })
    .then((result) => {
      rsp_obj = {};
      if (result) {
        // user exists in database
        rsp_obj.status = 300;
        rsp_obj.message = 'user already exists';
        res.send(rsp_obj);
      } else {
        collection
          .insertOne({
            userID: userID,
            favorites: [],
            trips: [],
            preferences: {
              hotel: [],
              breakfast: [],
              lunch: [],
              activity: [],
              dinner: [],
            },
          })
          .then((result) => {
            if (result) {
              // user profile created message can be changed
              rsp_obj.message = 'user profile created successfully';
              rsp_obj.status = 200;
              res.send(rsp_obj);
            } else {
              rsp_obj.message = 'error creating user profile';
              rsp_obj.status = 509;
              res.send(rsp_obj);
            }
          })
          .catch((err) => {
            rsp_obj.message = 'error with database';
            rsp_obj.status = 505;
            res.send(rsp_obj);
          });
      }
    })
    .catch((err) => {
      rsp_obj.message = 'unable to find user';
      rsp_obj.status = 509;
      res.send(rsp_obj);
    });
});

('use strict');

//Endpoint for searching businesses based on:
//  -term(food, hotel, etc.)
//  -location(zipcode, city, etc.)
//  *It is possible to include more search params like price/category
app.get('/search/:term/:location', async function (req, res) {
  const searchTerm = req.params.term;
  const searchLocation = req.params.location;

  client
    .search({
      term: searchTerm,
      location: searchLocation,
    })
    .then((response) => {
      return res.status(200).send(response.jsonBody.businesses);
    })
    .catch((e) => {
      console.log(e);
    });
});

//Endpoint to retrieve business details by using biz ID or Alias.
app.get('/biz/:id', async function (req, res) {
  const bizID = req.params.id;

  client
    .business(bizID)
    .then((response) => {
      return res.status(200).send(response.jsonBody);
    })
    .catch((e) => {
      console.log(e);
    });
});

//Endpoint to retrieve 3 reviews from biz ID
//Also possible to change the sort_by param to sort by newest instead of default
app.get('/biz/:id/reviews', async function (req, res) {
  const bizID = req.params.id;

  client
    .reviews(bizID)
    .then((response) => {
      return res.status(200).send(response.jsonBody);
    })
    .catch((e) => {
      console.log(e);
    });
});

//Endpoint to retrieve yelp search categories/terms based on input text
//May need to account for spaces in string input
app.get('/auto/:text', async function (req, res) {
  const autoText = req.params.text;

  client
    .autocomplete({
      text: autoText,
    })
    .then((response) => {
      return res.status(200).send(response.jsonBody);
    })
    .catch((e) => {
      console.log(e);
    });
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('odyssey/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'odyssey', 'build', 'index.html'));
  });
}

app.listen(port || 8000); //start the server
console.log(`Server is running at port ${port || 8000}`);
