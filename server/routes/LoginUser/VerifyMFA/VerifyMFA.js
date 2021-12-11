require('dotenv').config();
const axios = require('axios');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const cors = require('cors');
const { setInterval } = require('timers/promises');

const API_KEY = process.env.API_KEY;
const URL = process.env.URL;

const verified = false;

const config = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

const verifyMFAOption = async (body, factorId, res) => {
  console.log(`received body from client is inside verification`, body);
  await axios
    .post(`${URL}/api/v1/authn/factors/${factorId}/verify`, body, config)
    .then(result => {
      console.log('---------HELLO----------');
      console.log(result.data);
      res.send(result.data);
      console.log('----------------------');
    })
    .catch(err => {
      console.log('Verification Error ', err.message);
    });
};

router.post('/', cors(), async (req, res) => {
  const body = JSON.stringify({
    stateToken: req.body.stateToken,
  });
  //setInterval(verifyMFAOption, 5000, body, req.body.factorId, res);
  verifyMFAOption(body, req.body.factorId, res);
});

module.exports = router;
