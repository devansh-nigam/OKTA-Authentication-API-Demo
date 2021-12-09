require('dotenv').config();
const axios = require('axios');
const express = require('express');
const router = express.Router();
const fs = require('fs');

const getDomainURL = `https://dev-05292564.okta.com`;

const cors = require('cors');
const res = require('express/lib/response');

const API_KEY = process.env.OKTA_API_TOKEN;

const axiosOptions = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `SSWS ${API_KEY}`,
  },
};

const config = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: `SSWS ${API_KEY}`,
  },
};

const createUserInOkta = async body => {
  console.log(`received body is`, body);
  await axios
    .post(
      'https://dev-05292564.okta.com/api/v1/users?activate=true',
      body,
      config
    )
    .then(result => {
      console.log('Result from axios', result.data);
      fs.writeFileSync('responseFromOkta.json', JSON.stringify(result.data));
    })
    .catch(err => {
      console.log('Errorrr', err.message);
    });
};

router.post('/', async (req, res) => {
  createUserInOkta(req.body);
  res.status(200).json({ message: 'received ok' });
});

module.exports = router;
