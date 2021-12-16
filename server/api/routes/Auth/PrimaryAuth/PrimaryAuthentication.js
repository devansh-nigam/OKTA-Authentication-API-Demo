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
      console.log(
        '-------------------------PRIMARY AUTHENTICATION STAGE------------------------------',
        responseFromOkta
      );
      if (responseFromOkta.stateToken) {
        res.status(200).json({
          stateToken: responseFromOkta.stateToken,
          userId: responseFromOkta._embedded.user.id,
          status: responseFromOkta.status,
          email: responseFromOkta._embedded.user.profile.login,
          factors: responseFromOkta._embedded.factors,
        });
      }
      fs.writeFileSync(
        'loginResponseFromOkta.json',
        JSON.stringify(responseFromOkta)
      );
      console.log(
        '-----------------------------------------------------------------------------------'
      );
    })
    .catch(err => {
      console.log('Error', err.message);
      res.status(500).json({ message: 'USER LOGIN FAILED' });
    });
};

router.post('/', cors(), async (req, res) => {
  const body = JSON.stringify({
    username: req.body.username,
    password: req.body.password,
    options: {
      multiOptionalFactorEnroll: true,
      warnBeforePasswordExpired: true,
    },
  });
  loginUserUsingOkta(body, res);
});

module.exports = router;
