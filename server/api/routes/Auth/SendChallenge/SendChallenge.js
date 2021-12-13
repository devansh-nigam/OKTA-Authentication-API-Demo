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

const sendChallenge = async (stateToken, factorId, res) => {
  console.log(stateToken, factorId);

  const config = {
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  };

  const body = JSON.stringify({ stateToken: stateToken });

  await axios
    .post(`${URL}/api/v1/authn/factors/${factorId}/verify`, body, config)
    .then(result => {
      const data = result.data;
      console.log(data);
      if (
        data.status === 'MFA_CHALLENGE' &&
        data.factorResult === 'CHALLENGE'
      ) {
        const factor = data._embedded.factor;
        res.status(200).json({
          message: 'CHALLENGE SENT',
          factorType: factor.factorType,
          provider: factor.provider,
          factorId: factor.id,
        });
      }
    })
    .catch(err => {
      console.log('Error from SEND CHALLENGE', err.message);
    });
};

router.post('/', cors(), async (req, res) => {
  sendChallenge(req.body.stateToken, req.body.factorId, res);
  //sendChallenge(stateToken, factorId, res);
});

module.exports = router;
