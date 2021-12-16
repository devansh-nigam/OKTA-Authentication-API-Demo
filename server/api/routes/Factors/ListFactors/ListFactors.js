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

const listFactors = async (body, res) => {
  console.log(`received body from client in LIST FACTORS is`, body);

  await axios
    .post(`${URL}/api/v1/users/${body.userId}/factors/catalog`, null, config)
    .then(result => {
      console.log('----------FACTOR LIST LOG-------------');
      console.log(result.data);
      console.log('---------------------------------------');
    })
    .catch(err => {
      console.log('LIST FACTOR ERROR ', err.message);
    });
};

router.post('/', cors(), async (req, res) => {
  const { userId } = req.body;
  listFactors(userId, res);
});

module.exports = router;
