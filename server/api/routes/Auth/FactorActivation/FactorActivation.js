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
  provider,
  factorType,
  factorId,
  res
) => {
  const b = JSON.stringify({
    stateToken: stateToken,
    factorType: factorType,
    provider: provider,
  });

  console.log('Body that is going to be sent to OKTA API ', b);

  await axios
    .post(
      `${URL}/api/v1/authn/factors/${factorId}/lifecycle/activate/poll`,
      b,
      config
    )
    .then(result => {
      console.log(
        `------------------------------------From Factor Activation--------------------------------`
      );
      console.log(result.data);
      console.log(
        `-------------------------------------------------------------------------------------------`
      );
    })
    .catch(err => {
      console.log(`Errorrrr From MFA Stage 2`, err.message);
    });
};

module.exports = activateFactor;
