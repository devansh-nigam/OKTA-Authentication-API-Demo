require('dotenv').config(); // this loads env vars
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

//const userRoutes = require('./api/routes/user');

//morgan is logger middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.get('/favicon.ico', (req, res) => res.status(204));

//Routes which should handle requests
//app.use('/user', userRoutes);

//if you're reaching this middleware, then the request was not able to get through any of the get,post,patch,delete middlewares specified in those rotues above
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

//will able to handle errors from all over the code
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

module.exports = app;
