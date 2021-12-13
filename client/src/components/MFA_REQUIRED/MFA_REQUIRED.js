import React, { useState, useRef } from 'react';
import axios from 'axios';
//means that the user is trying to login for nth time and now you have to let him choose which way he wants
//authenticate himself.

//from here on we send challenge to the user

//4 things required to verify
//stateToken is must
//factorId
//factorType
//passCode

const MFA_REQUIRED = props => {
  const factorsPreviouslyEnrolled = props.alreadyEnrolledFactors;
  const stateToken = useState(props.stateToken)[0];
  const [challengeSent, setChallengeSent] = useState(false);
  const [factorOpted, setFactorOpted] = useState('');
  const [mainFactorId, setMainFactorId] = useState('');
  const [provider, setProvider] = useState('');

  const verificationRef = useRef();

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const DisplayFactors = factor => {
    const factorType = factor.factorType;
    const factorId = factor.id;
    const factorProvider = factor.provider;

    console.log(
      'inside MFA_REQUIRED displayFactors ',
      stateToken,
      factorType,
      factorId
    );

    let onClickFunc = null;
    let text;
    switch (factorType) {
      case 'email':
        text = 'Email';
        break;

      case 'sms':
        text = 'SMS';
        break;

      case 'token:software:totp':
        if (factorProvider === 'GOOGLE') {
          text = 'Google Authenticator';
        } else if (factorProvider === 'OKTA') {
          text = 'OKTA Verify';
        }
        break;

      case 'push':
        text = 'OKTA Push';
        break;
    }

    return text ? (
      <button
        style={{
          alignSelf: 'center',
          margin: '15px',
          fontSize: '20px',
          backgroundColor: '#044599',
          color: 'white',
          borderRadius: '3px',
          fontFamily: 'Roboto',
        }}
        onClick={() => {
          sendChallenge(factorId);
        }}
      >
        {text}
      </button>
    ) : null;
  };

  const sendChallenge = async factorId => {
    const body = JSON.stringify({
      stateToken: stateToken,
      factorId: factorId,
    });

    await axios
      .post('http://localhost:1337/sendChallenge', body, config)
      .then(result => {
        console.log('RECEIVING FROM SEND CHALLENGE API ENDPOINT', result.data);
        const data = result.data;
        if (data.message === 'CHALLENGE SENT') {
          setFactorOpted(data.factorType);
          setProvider(data.provider);
          setMainFactorId(data.factorId);
          setChallengeSent(true);
        }
      })
      .catch(err => {
        console.log('Error from inside MFA_REQUIRED component', err.message);
      });
  };

  const VerificationView = props => {
    let helpText;

    const showVerificationForm = true;

    switch (props.factorOpted) {
      case 'email':
        helpText =
          'Please check your mail inbox for a Verification Code from OKTA';
        break;

      case 'sms':
        helpText = 'SMS Verification Code Sent, please check your phone';
        break;

      case 'token:software:totp':
        if (provider === 'GOOGLE') {
          helpText =
            'Open Google Authenticator App and enter the TOTP (Time One Time Password) for this account';
        } else if (provider === 'OKTA') {
          helpText =
            'Open OKTA Verify App and enter the TOTP (Time One Time Password) for this account';
        }
        break;

      case 'push':
        helpText = 'Please check your OKTA Verify App for a push notification';
        showVerificationForm = false;
        break;
    }

    return (
      <div>
        <h2>{helpText}</h2>
        {showVerificationForm && <VerificationCodeForm />}
      </div>
    );
  };

  const VerificationCodeForm = props => {
    return (
      <div
        style={{
          width: '40%',
          margin: '0 auto',
        }}
      >
        <form
          onSubmit={verifyChallenge}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          <input
            type='number'
            name='passCode'
            placeholder='Verification Code'
            style={{ fontSize: '32px', fontFamily: 'Roboto' }}
            ref={verificationRef}
          />
          <br />
          <button
            type='submit'
            style={{
              fontSize: '32px',
              backgroundColor: '#044599',
              color: 'white',
              borderRadius: '3px',
              fontFamily: 'Roboto',
            }}
          >
            Verify
          </button>
        </form>
      </div>
    );
  };

  const verifyChallenge = async event => {
    event.preventDefault();
    const passCode = verificationRef.current.value;
    console.log(`passCode entered = ${passCode}`);

    console.log(`state Token = ${stateToken}`);
    console.log(`factorTypeOpted = ${factorOpted}`);
    console.log(`factorId = ${mainFactorId}`);
    console.log(`provider = ${provider}`);

    const body = JSON.stringify({
      stateToken: stateToken,
      factorType: factorOpted,
      factorId: mainFactorId,
      passCode: passCode,
    });

    await axios
      .post('http://localhost:1337/verifyFactor', body, config)
      .then(result => {
        console.log('VERIFICATION RESPONSE', result.data);
        if (result.data.status === 'SUCCESS') {
          props.setAuthenticationState('SUCCESS');
          props.setSessionToken(result.data.sessionToken);
        }
      })
      .catch(err => {
        console.log('VERIFICATION ERROR', err.message);
      });
  };

  console.log(
    'inside MFA_REQUIRED yooo',
    stateToken,
    factorsPreviouslyEnrolled
  );

  return (
    <div>
      {challengeSent === false ? (
        factorsPreviouslyEnrolled.map(factor => {
          return DisplayFactors(factor);
        })
      ) : (
        <VerificationView />
      )}
    </div>
  );
};

export default MFA_REQUIRED;