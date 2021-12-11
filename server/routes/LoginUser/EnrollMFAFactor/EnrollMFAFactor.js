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

const activateMFAOption = async (
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

  console.log(
    `-------------------------------------------------FROM STAGE 2------------`
  );

  console.log('Body that is going to be sent to OKTA API ', b);

  await axios
    .post(
      `${URL}/api/v1/authn/factors/${factorId}/lifecycle/activate/poll`,
      b,
      config
    )
    .then(result => {
      console.log("Let's seee", result.data);
    })
    .catch(err => {
      console.log(`Errorrrr From MFA Stage 2`, err.message);
    });
};

const enrollMFAOption = async (body, res) => {
  console.log(`received body from client is`, body);
  await axios
    .post(`${URL}/api/v1/authn/factors`, body, config)
    .then(result => {
      console.log('----------STAGE 1--------');
      const data = result.data;
      console.log(data);
      console.log('------------------');
      const factorID = data._embedded.factor.id;
      const factors = data._embedded.factor;
      console.log(`state token : ${data.stateToken}`);
      console.log(`factor id : ${factorID}`);
      console.log(`provider : ${factors.provider}`);
      console.log(`factor type : ${factors.factorType}`);
      console.log(
        `QR CODE LINK : ${data._embedded.factor._embedded.activation._links.qrcode.href}`
      );

      activateMFAOption(
        data.stateToken,
        factors.provider,
        factors.factorType,
        factorID,
        res
      );
    })
    .catch(err => {
      console.log('Errorrr MFA Stage 1', err.message);
    });
};

router.post('/', cors(), async (req, res) => {
  enrollMFAOption(req.body);
});

module.exports = router;
