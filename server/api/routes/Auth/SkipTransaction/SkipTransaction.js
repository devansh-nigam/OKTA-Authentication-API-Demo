require('dotenv').config();
const axios = require('axios');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const cors = require('cors');

const API_KEY = process.env.API_KEY;
const URL = process.env.URL;

const config = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

const skipTransaction = async (body, res) => {
  console.log(`received body from client in SKIP TRANSACTION is`, body);
  await axios
    .post(`${URL}/api/v1/authn/skip`, body, config)
    .then(result => {
      const data = result.data;
      console.log(`----------SKIP TRANSACTION-----------------`);
      console.log(data);
      console.log(
        '------------------------------------------------------------------------'
      );
      res.send(data);
    })
    .catch(err => {
      console.log('Error from Factor Enrollment Stage', err.message);
    });
};

router.post('/', cors(), async (req, res) => {
  skipTransaction(req.body, res);
});

module.exports = router;
//SkipTransaction
