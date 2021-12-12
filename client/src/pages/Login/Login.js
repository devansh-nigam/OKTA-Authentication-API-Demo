import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DisplayFactors from './../../components/DisplayFactors/DisplayFactors';

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [primaryAuthState, setPrimaryAuthState] = useState(false);

  const [stateToken, setStateToken] = useState('');

  const [authenticationState, setAuthenticationState] = useState('');

  const [email, setEmail] = useState('');

  const [userId, setUserId] = useState('');

  const [mfaFactors, setMfaFactors] = useState([]);

  const [factorType, setFactorType] = useState('');

  const [factorId, setFactorId] = useState('');

  const [qrCode, setQrCode] = useState('');

  const [provider, setProvider] = useState('');

  useEffect(() => {
    renderUponStatus();
  }, [isLoggedIn, authenticationState]);

  const emailRef = useRef();
  const passwordRef = useRef();
  const verificationRef = useRef();

  const loginForm = (
    <div
      style={{
        width: '40%',
        margin: '0 auto',
      }}
    >
      <form
        onSubmit={loginUser}
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignContent: 'center',
        }}
      >
        <input
          type='email'
          name='email'
          placeholder='Email'
          style={{ fontSize: '32px', fontFamily: 'Roboto' }}
          ref={emailRef}
        />
        <br />
        <input
          type='password'
          placeholder='Password'
          style={{ fontSize: '32px', fontFamily: 'Roboto' }}
          ref={passwordRef}
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
          Login
        </button>
      </form>
    </div>
  );

  const pollForMFA = async factors => {
    console.log(`multi factors`, mfaFactors);
    const body = JSON.stringify({
      stateToken: stateToken,
      factorType: factors.factorType,
      provider: factors.vendorName,
      factorId: factors.factorId,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios
      .post('http://localhost:1337/auth/primary/pollForFactor', body, config)
      .then(result => {
        console.log('Running Poll and logging', result.data);
      })
      .catch(err => {
        console.log(`Poll For Factor Enrollment ERROR : ${err.message}`);
      });
  };

  const enrollMFA = async factors => {
    const body = JSON.stringify({
      stateToken: stateToken,
      factorType: factors.factorType,
      provider: factors.vendorName,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios
      .post('http://localhost:1337/auth/primary/enrollMFA', body, config)
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
            console.log('inside enrollmeant', factors);
            //pollForMFA(factors);
          }
          setAuthenticationState(data.status);
          setQrCode(data.qr_code_link);
          setFactorType(data.factorType);
          setProvider(data.provider);
          setFactorId(data.factorId);
        }
        console.log(
          '---------------------------------------------------------------------------'
        );
      })
      .catch(err => {
        console.log(`ENROLLMENT ERROR : ${err.message}`);
      });
  };

  let verificationInterval = null;

  const keepCallingVerifyMFA = factors => {
    verificationInterval = setInterval(requireMFA, 4000, factors);
  };

  const requireMFA = async factors => {
    //by the time MFA_REQUIRE comes, we have factor id of the factors which were previously enrolled by the user
    console.log(`in requireMFA authenticatedState = ${authenticationState}`);
    let body;
    body = JSON.stringify({
      stateToken: stateToken,
      factorId: factors.factorId || factorId,
      factorType: factors.factorType || factorType,
      // passCode: verificationRef.current.value,
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios
      .post('http://localhost:1337/auth/primary/verifyMFA', body, config)
      .then(result => {
        console.log('verification response', result.data);
        console.log('Authentication State', authenticationState);

        const data = result.data;
        console.log(`token on stage verification =  ${data.stateToken}`);
        console.log(`status received from server ${data.status}`);
        //if (data.stateToken === stateToken) {
        if (data.status === 'SUCCESS') {
          console.log(`VERIFICATION COMPLETE, LOGGED IN `);
          clearInterval(verificationInterval);
        }
        if (authenticationState !== data.status) {
          console.log(
            `inside changing of authentication state to = ${data.status}`
          );
          setAuthenticationState(data.status);
          setFactorType(data._embedded.factor.factorType);
        }
        //}
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const renderUponStatus = () => {
    let view = null;
    switch (authenticationState) {
      case 'MFA_ENROLL':
        view = (
          <div style={{ justifyContent: 'center' }}>
            <h1>-------------------------</h1>
            <h1>MFA_ENROLL-OPTIONS</h1>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                // justifyContent: 'center',
              }}
            >
              {mfaFactors.map(factor => {
                return (
                  <DisplayFactors
                    factor={factor}
                    authenticationState={authenticationState}
                    factorEnroll={enrollMFA}
                    pushFactorVerify={keepCallingVerifyMFA}
                    verify={requireMFA}
                  />
                );
              })}
            </div>
            <h1>-------------------------</h1>
          </div>
        );
        break;

      case 'MFA_ENROLL_ACTIVATE':
        view = (
          <div style={{ justifyContent: 'center' }}>
            <h1>-------------------------</h1>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                // justifyContent: 'center',
              }}
            >
              {(factorType === 'push' ||
                factorType === 'token:software:totp') &&
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
                      <img src={qrCode} width='20%' height='100%' />
                    </div>
                  </div>
                )}
              {factorType === 'email' && verificationCodeForm()}
            </div>
            <h1>-------------------------</h1>
          </div>
        );
        break;

      case 'MFA_REQUIRED':
        view = (
          <div style={{ justifyContent: 'center' }}>
            <h1>-------------------------</h1>
            <h1>MFA_REQUIRED-OPTIONS</h1>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                // justifyContent: 'center',
              }}
            >
              {mfaFactors.map(factor => {
                return (
                  <DisplayFactors
                    factor={factor}
                    authenticationState={authenticationState}
                    factorEnroll={enrollMFA}
                    pushFactorVerify={keepCallingVerifyMFA}
                    verify={verifyActivateFactor}
                  />
                );
              })}
            </div>
            <h1>-------------------------</h1>
          </div>
        );
        break;

      case 'MFA_CHALLENGE':
        view = (
          <div style={{ justifyContent: 'center' }}>
            {factorType === 'push' && (
              <h1>Please Check your OKTA Verify app for a push notification</h1>
            )}
            {factorType === 'email' && verificationCodeForm()}
          </div>
        );
        break;

      case 'SUCCESS':
        view = (
          <div style={{ justifyContent: 'center' }}>
            <h1>Succesfully Logged In</h1>
          </div>
        );
        break;
    }
    return view;
  };

  const activateFactor = async () => {
    console.log('going to activate the factor ', factorType);

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const passCode = verificationRef.current.value;
    const body = JSON.stringify({
      stateToken: stateToken,
      passCode: passCode,
      factorId: factorId,
    });

    console.log(`stateToken entered ${stateToken}`);
    console.log(`passCode entered ${passCode}`);

    if (passCode) {
      await axios
        .post('http://localhost:1337/auth/primary/activateMFA', body, config)
        .then(result => {
          console.log('RESPONSE received from FACTOR ACTIVATION', result.data);
          const status = result.data.status;
          if (status === 'MFA_ENROLL') {
            setAuthenticationState('SUCCESS');
          }
        })
        .catch(err => {
          console.log('Inside activateFactor in client ', err.message);
        });
    }
  };

  const verifyActivateFactor = event => {
    switch (authenticationState) {
      case 'MFA_ENROLL_ACTIVATE':
        event.preventDefault();
        activateFactor();
        break;

      case 'MFA_REQUIRED':
        console.log('so you have reacherd');
        break;

      case 'MFA_CHALLENGE':
        const passCode = verificationRef.current.value;
        console.log('hello coder');
        console.log(`passCode entered in box ${passCode}`);
        break;
    }
  };

  const verificationCodeForm = props => {
    return (
      <div
        style={{
          width: '40%',
          margin: '0 auto',
        }}
      >
        <form
          onSubmit={verifyActivateFactor}
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

  async function loginUser(event) {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const body = JSON.stringify({
      username: email,
      password: password,
      options: {
        multiOptionalFactorEnroll: true,
        warnBeforePasswordExpired: true,
      },
    });

    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (email && password) {
      await axios
        .post('http://localhost:1337/auth/primary', body, config)
        .then(result => {
          const data = result.data;
          if (data.stateToken) {
            setPrimaryAuthState(true);
            setStateToken(data.stateToken);
            setAuthenticationState(data.status);
            setEmail(data.email);
            setUserId(data.userId);
            const temp = [];
            data.mfaFactors.map(factor => {
              console.log(factor);
              temp.push({
                factorId: factor.id, //at this stage, only those factors are shown which were previoulsy enrolled in MFA list
                factorType: factor.factorType,
                vendorName: factor.vendorName,
              });
            });
            setMfaFactors(temp);
          }

          emailRef.current.value = '';
          passwordRef.current.value = '';
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  return (
    <>
      {primaryAuthState ? (
        <div style={{ textAlign: 'center', fontSize: '32px' }}>
          <p>User ID</p>
          <h1 style={{ fontSize: '40px' }}>{userId}</h1>
          <p>State Token for {email}</p>
          <h1 style={{ fontSize: '40px' }}>{stateToken}</h1>
          <p>Authentication Transaction State</p>
          <h1>{authenticationState}</h1>
        </div>
      ) : (
        loginForm
      )}
      {renderUponStatus()}
    </>
  );
};

export default Login;
