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

const loginUserUsingOkta = async (body, res) => {
  console.log(`received body is`, body);
  await axios
    .post(`${URL}/api/v1/authn`, body, config)
    .then(result => {
      const responseFromOkta = result.data;
      console.log('Result from axios', responseFromOkta.stateToken);
      if (responseFromOkta.stateToken) {
        res.status(200).json({
          stateToken: responseFromOkta.stateToken,
          userId: responseFromOkta._embedded.user.id,
          status: responseFromOkta.status,
          email: responseFromOkta._embedded.user.profile.login,
          mfaFactors: responseFromOkta._embedded.factors,
        });
      }
      fs.writeFileSync(
        'loginResponseFromOkta.json',
        JSON.stringify(responseFromOkta)
      );
    })
    .catch(err => {
      console.log('Errorrr', err.message);
    });
};

router.post('/', cors(), async (req, res) => {
  loginUserUsingOkta(req.body, res);
  //res.status(200).json({ stateToken: 'received ok' });
});

module.exports = router;
