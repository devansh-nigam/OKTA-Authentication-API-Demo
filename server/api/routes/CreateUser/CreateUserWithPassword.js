require('dotenv').config();
const axios = require('axios');
const express = require('express');
const router = express.Router();
const fs = require('fs');

const cors = require('cors');
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

const createUserInOkta = async (body, res) => {
  console.log(`received body is`, body);
  await axios
    .post(`${URL}/api/v1/users?activate=true`, body, config)
    .then(result => {
      console.log(
        '----------------------------------USER REGISTRATION LOG-------------------------------------',
        result.data
      );
      console.log(
        '--------------------------------------------------------------------------------------------'
      );
      if (result.data.id && result.data.status === 'ACTIVE') {
        res.status(200).json({ message: 'USER REGISTRATION SUCCESSFUL' });
      }
      fs.writeFileSync(
        'newUserRegistrationResponseFromOkta.json',
        JSON.stringify(result.data)
      );
    })
    .catch(err => {
      console.log(
        '-------------Error from USER REGISTRATION-----------',
        err.message
      );
      console.log(
        '------------------------------------------------------------'
      );
      res
        .status(500)
        .json({ message: 'USER REGISTRATION FAILED, PlEASE TRY AGAIN LATER' });
    });
};

router.post('/', cors(), async (req, res) => {
  createUserInOkta(req.body, res);
});

module.exports = router;
