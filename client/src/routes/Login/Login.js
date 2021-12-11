import React, { useState, useRef } from 'react';
import Navbar from './../Navigation/Navbar';
import axios from 'axios';

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [stateToken, setStateToken] = useState('');

  const [authenticationState, setAuthenticationState] = useState('');

  const [email, setEmail] = useState('');

  const [userId, setUserId] = useState('');

  const [mfaFactors, setMfaFactors] = useState([]);

  const emailRef = useRef();
  const passwordRef = useRef();

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
          style={{ fontSize: '32px' }}
          ref={emailRef}
        />
        <br />
        <input
          type='password'
          placeholder='Password'
          style={{ fontSize: '32px' }}
          ref={passwordRef}
        />
        <br />
        <button type='submit' style={{ fontSize: '32px' }}>
          Login
        </button>
      </form>
    </div>
  );

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
        console.log('in client logging result.data', result.data);
      });
  };

  const mfaOptions = factors => {
    let text = null;
    const factor = factors.factorType;
    const vendorName = factors.vendorName;

    let onClickFunc = null;

    switch (authenticationState) {
      case 'MFA_ENROLL':
        onClickFunc = enrollMFA;
        break;

      case 'MFA_REQUIRED':
        onClickFunc = keepCallingVerifyMFA;
        break;
    }

    switch (factor) {
      case 'email':
        text = 'Email';
        break;

      case 'sms':
        text = 'SMS';
        break;

      case 'token:software:totp':
        if (vendorName === 'GOOGLE') {
          text = 'Google Authenticator';
        } else if (vendorName === 'OKTA') {
          text = 'OKTA Verify';
        }
        break;

      case 'push':
        text = `OKTA push ${vendorName}`;
        break;
    }
    return text ? (
      <button
        style={{ alignSelf: 'center', margin: '15px', fontSize: '20px' }}
        onClick={() => {
          onClickFunc(factors);
        }}
      >
        {text}
      </button>
    ) : null;
  };

  let verificationInterval = null;

  const keepCallingVerifyMFA = factors => {
    verificationInterval = setInterval(requireMFA, 3000, factors);
  };

  const requireMFA = async factors => {
    const body = JSON.stringify({
      stateToken: stateToken,
      factorId: factors.factorId,
    });
    console.log(factors);
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    await axios
      .post('http://localhost:1337/auth/primary/verifyMFA', body, config)
      .then(result => {
        console.log('verification response', result.data);
        if (result.data.status === 'SUCCESS') {
          console.log(`VERIFICATION COMPLETE, LOGGED IN `);
          clearInterval(verificationInterval);
        }
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
                return mfaOptions(factor);
              })}
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
                return mfaOptions(factor);
              })}
            </div>
            <h1>-------------------------</h1>
          </div>
        );
        break;
    }
    return view;
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
            setIsLoggedIn(true);
            setStateToken(data.stateToken);
            setAuthenticationState(data.status);
            setEmail(data.email);
            setUserId(data.userId);
            const temp = [];
            data.mfaFactors.map(factor => {
              temp.push({
                factorId: factor.id,
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
      <Navbar />
      {isLoggedIn ? (
        <div style={{ textAlign: 'center', fontSize: '32px' }}>
          <h1>State Token for {email}</h1>
          <p>{stateToken}</p>
          <h1>Authentication Transaction State {authenticationState}</h1>
          <h1>User ID : {userId}</h1>
          {/* {mfaFactors.forEach(factor => {
            for (let key in factor) {
              console.log(key, factor[key]);
              // <button style={{ fontSize: '32px' }}>{factor[key]}</button>
            }
          })} */}
          {renderUponStatus()}
        </div>
      ) : (
        loginForm
      )}
    </>
  );
};

export default Login;
