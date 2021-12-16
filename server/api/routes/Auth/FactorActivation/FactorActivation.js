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

const activateFactor = async (
  stateToken,
  passCode,
  factorType,
  factorId,
  res
) => {
  const b = JSON.stringify({
    stateToken: stateToken,
    passCode: passCode,
  });

  console.log(
    'in FACTOR ACTIVATION Body that is going to be sent to OKTA API ',
    b
  );

  let apiURL = `${URL}/api/v1/authn/factors/${factorId}/lifecycle/activate`;
  if (factorType === 'push') {
    apiURL = apiURL + '/poll';
  }

  console.log(`Factor ID is ${factorId}`);
  await axios
    .post(apiURL, b, config)
    .then(result => {
      console.log(
        `------------------------------------FACTOR ACTIVATION LOG--------------------------------`
      );
      console.log(result.data);
      const data = result.data;
      console.log(
        `-------------------------------------------------------------------------------------------`
      );
      res.send(result.data);
    })
    .catch(err => {
      console.log(`Error From MFA Factor Activation`, err.message);
      res.status(500).json({ message: 'CANNOT ACTIVATE FACTOR, TRY LATER' });
    });
};

router.post('/', cors(), async (req, res) => {
  const { stateToken, factorType, factorId, passCode } = req.body;
  activateFactor(stateToken, passCode, factorType, factorId, res);
});

module.exports = router;
