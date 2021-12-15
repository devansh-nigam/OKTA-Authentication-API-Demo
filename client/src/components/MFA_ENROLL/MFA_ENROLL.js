import React, { useState, useRef } from 'react';
import axios from 'axios';

const MFA_ENROLL = props => {
  const availableFactors = props.availableFactors;
  const stateToken = useState(props.stateToken)[0];
  const [enrollActivate, setEnrollActivate] = useState(false);
  const [qrCode, setQrCode] = useState('');
  const [factorOpted, setFactorOpted] = useState('');
  const [mainFactorId, setMainFactorId] = useState('');
  const [provider, setProvider] = useState('');
  const [localAuthState, setLocalAuthState] = useState('MFA_ENROLL');

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
      'inside MFA_ENROLL displayFactors ',
      stateToken,
      factorType,
      factorId
    );

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

      default:
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
          enrollMFA(factorType, factorProvider);
        }}
      >
        {text}
      </button>
    ) : null;
  };

  const enrollMFA = async (factorType, provider) => {
    const body = JSON.stringify({
      stateToken: stateToken,
      factorType: factorType,
      provider: provider,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios
      .post('http://localhost:1337/enrollFactor', body, config)
      .then(result => {
        console.log(
          '-----------------------ENROLLMENT STATUS-------------------------',
          result.data
        );
        const data = result.data;
        console.log('ENROLLMENT RESPONSE', data);
        //console.log(`token =  ${data.stateToken}`);

        if (data.stateToken === stateToken) {
          if (data.status === 'MFA_ENROLL_ACTIVATE') {
            console.log('inside enrollmeant');
            //pollForMFA(factors);
            setEnrollActivate(true);
          }
          setLocalAuthState(data.status);
          setQrCode(data.qr_code_link);
          setFactorOpted(data.factorType);
          setProvider(data.provider);
          setMainFactorId(data.factorId);
        }
        console.log(
          '---------------------------------------------------------------------------'
        );
      })
      .catch(err => {
        console.log(`ENROLLMENT ERROR : ${err.message}`);
      });
  };

  const VerificationView = props => {
    let helpText;

    let showVerificationForm = true;
    let showQRCode = false;

    switch (factorOpted) {
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
        showVerificationForm = true;
        showQRCode = true;
        break;

      case 'push':
        helpText = 'Please check your OKTA Verify App for a push notification';
        showVerificationForm = false;
        showQRCode = true;
        break;

      default:
        break;
    }

    return (
      <div>
        <h2>{helpText}</h2>
        <VerificationCodeForm
          showInput={showVerificationForm}
          showQRCode={showQRCode}
        />
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
          {props.showQRCode &&
            (factorOpted === 'push' || factorOpted === 'token:software:totp') &&
            qrCode && (
              <div
                style={{
                  justifyContent: 'center',
                }}
              >
                <h2>
                  Scan the QR Code shown below with
                  {provider === 'GOOGLE'
                    ? ' Google Authenticator or OKTA Verify App'
                    : ' OKTA Verify App'}
                </h2>
                <div style={{ backgroundColor: '#044599', padding: '0' }}>
                  <img
                    src={qrCode}
                    width='80%'
                    height='100%'
                    alt='QR CODE DISPLAYED HERE'
                  />
                </div>
              </div>
            )}
          {props.showInput && (
            <input
              type='number'
              name='passCode'
              placeholder='Verification Code'
              style={{ fontSize: '32px', fontFamily: 'Roboto' }}
              ref={verificationRef}
            />
          )}
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

  const skipTransaction = async () => {
    const body = JSON.stringify({ stateToken: stateToken });
    await axios
      .post('http://localhost:1337/skipTransaction', body, config)
      .then(result => {
        const data = result.data;
        if (data.status === 'SUCCESS') {
          props.setSessionToken(data.sessionToken);
          props.setAuthenticationState('SUCCESS');
        }
      })
      .catch(err => {
        console.log('SKIP TRANSACTION ERROR', err.message);
      });
  };

  const verifyChallenge = async event => {
    event.preventDefault();
    let body;
    console.log('-----------------------------');
    console.log(`state Token = ${stateToken}`);
    console.log(`factorTypeOpted = ${factorOpted}`);
    console.log(`factorId = ${mainFactorId}`);
    console.log(`provider = ${provider}`);
    console.log('-----------------------------');

    if (factorOpted !== 'push') {
      const passCode = verificationRef.current.value;
      console.log(`passCode entered = ${passCode}`);
      body = JSON.stringify({
        stateToken: stateToken,
        factorType: factorOpted,
        factorId: mainFactorId,
        passCode: passCode,
      });
    } else if (factorOpted === 'push') {
      body = JSON.stringify({
        stateToken: stateToken,
        factorType: factorOpted,
        factorId: mainFactorId,
      });
    }

    await axios
      .post('http://localhost:1337/activateFactor', body, config)
      .then(result => {
        console.log('VERIFICATION RESPONSE', result.data);
        if (result.data.status === 'MFA_ENROLL') {
          skipTransaction();
        }
      })
      .catch(err => {
        console.log('VERIFICATION ERROR', err.message);
      });
  };

  console.log('inside MFA_ENROLL yooo', stateToken, availableFactors);

  return (
    <div>
      <h1 style={{ fontSize: '40px' }}>{localAuthState}</h1>
      <p>------------------------------------------</p>
      {enrollActivate === false ? (
        availableFactors.map(factor => {
          return DisplayFactors(factor);
        })
      ) : (
        <VerificationView />
      )}
    </div>
  );
};

export default MFA_ENROLL;
