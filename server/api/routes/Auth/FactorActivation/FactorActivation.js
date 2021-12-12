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
        `------------------------------------FACTOR ACTIVATION LOG--------------------------------`
      );
      console.log(result.data);
      const data = result.data;
      //   res
      //     .status(200)
      //     .json({ message: 'FACTOR ACTIVATION LOG', response: result.data });

      // const qr_code =
      //   data._embedded.factor._embedded.activation._links.qrcode.href;
      // console.log(`QR CODE LINK : ${qr_code}`);

      //   res.status(200).json({
      //     message: `FACTOR ACTIVATION STAGE RESPONSE FOR ${provider} ${factorType}`,
      //     stateToken: data.stateToken,
      //     userId: data._embedded.user.id, //not required
      //     status: data.status,
      //     email: data._embedded.user.profile.login, //not required
      //     factorType: factorType,
      //     factorId: factorID,
      //     qr_code_link: qr_code,
      //     provider: provider,
      //   });
      console.log(
        `-------------------------------------------------------------------------------------------`
      );
    })
    .catch(err => {
      console.log(`Errorrrr From MFA Factor Activation`, err.message);
    });
};

module.exports = activateFactor;
