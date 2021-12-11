require('dotenv').config();
const axios = require('axios');
const express = require('express');
const router = express.Router();
const fs = require('fs');

const cors = require('cors');
const res = require('express/lib/response');
//i think we can remove these imports

const API_KEY = process.env.API_KEY;
const URL = process.env.URL;

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
    .post(`${URL}/api/v1/users?activate=true`, body, config)
    .then(result => {
      console.log('Result from axios', result.data);
      fs.writeFileSync(
        'newUserResponseFromOkta.json',
        JSON.stringify(result.data)
      );
    })
    .catch(err => {
      console.log('Errorrr', err.message);
    });
};

router.post('/', cors(), async (req, res) => {
  createUserInOkta(req.body);
  res.status(200).json({ message: 'received ok' });
});

module.exports = router;
