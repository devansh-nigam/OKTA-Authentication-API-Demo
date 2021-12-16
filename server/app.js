require('dotenv').config(); // this loads env vars
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

//morgan is logger middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

const createUserRoute = require('./api/routes/CreateUser/CreateUserWithPassword');
const primaryAuthRoute = require('./api/routes/Auth/PrimaryAuth/PrimaryAuthentication');
const factorEnrollmentRoute = require('./api/routes/Auth/FactorEnrollment/FactorEnrollment');
const factorActivationRoute = require('./api/routes/Auth/FactorActivation/FactorActivation');
const factorChallengeRoute = require('./api/routes/Auth/SendChallenge/SendChallenge');
const factorVerificationRoute = require('./api/routes/Auth/FactorVerification/FactorVerification');
const skipTransactionRoute = require('./api/routes/Auth/SkipTransaction/SkipTransaction');
const listFactorsRoute = require('./api/routes/Factors/ListFactors/ListFactors');

//Routes which should handle requests
app.use('/createUser', createUserRoute);
app.use('/auth/primary', primaryAuthRoute);
app.use('/enrollFactor', factorEnrollmentRoute);
app.use('/activateFactor', factorActivationRoute);
app.use('/sendChallenge', factorChallengeRoute);
app.use('/verifyFactor', factorVerificationRoute);
app.use('/skipTransaction', skipTransactionRoute);
app.use('/listFactors', listFactorsRoute);

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
