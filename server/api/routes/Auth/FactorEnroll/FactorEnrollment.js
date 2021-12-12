require('dotenv').config();
const axios = require('axios');
const express = require('express');
const router = express.Router();
const fs = require('fs');
const cors = require('cors');

const API_KEY = process.env.API_KEY;
const URL = process.env.URL;

const activateFactor = require('./../FactorActivation/FactorActivation');

const config = {
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

const enrollFactor = async (body, res) => {
  console.log(`received body from client is`, body);
  await axios
    .post(`${URL}/api/v1/authn/factors`, body, config)
    .then(result => {
      const data = result.data;
      const factorID = data._embedded.factor.id;
      const factors = data._embedded.factor;

      console.log(
        `----------ENROLLMENT OF FACTOR ${factors.factorType} : Step 1--------`
      );
      console.log(data);
      console.log(
        '------------------------------------------------------------------------'
      );

      console.log(`state token : ${data.stateToken}`);
      console.log(`factor id : ${factorID}`);
      console.log(`provider : ${factors.provider}`);
      console.log(`factor type : ${factors.factorType}`);
      if (factors.factorType === 'push') {
        //or OKTA Verify as well
        const qr_code =
          data._embedded.factor._embedded.activation._links.qrcode.href;
        console.log(`QR CODE LINK : ${qr_code}`);
        res.status(200).json({
          message: 'FACTOR ENROLLMENT STAGE RESPONSE',
          stateToken: data.stateToken,
          userId: data._embedded.user.id,
          status: data.status,
          email: data._embedded.user.profile.login,
          factorType: data._embedded.factor.factorType,
          factorId: data._embedded.factor.id,
          qr_code_link: qr_code,
        });
      }
      console.log(
        '------------------------------------------------------------------------'
      );

      // activateFactor(
      //   data.stateToken,
      //   factors.provider,
      //   factors.factorType,
      //   factorID,
      //   res
      // );
    })
    .catch(err => {
      console.log('Error from Factor Enrollment Stage', err.message);
    });
};

router.post('/', cors(), async (req, res) => {
  enrollFactor(req.body, res);
});

module.exports = router;
