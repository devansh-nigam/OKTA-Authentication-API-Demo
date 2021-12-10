import React, { useState, useRef } from 'react';
import Navbar from './../Navigation/Navbar';
import axios from 'axios';

const Login = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [stateToken, setStateToken] = useState('');

  const [authenticationState, setAuthenticationState] = useState('');

  const [email, setEmail] = useState('');

  const [userId, setUserId] = useState('');

  const mfaFactors = [];

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
        .post('http://localhost:1337/loginUser/', body, config)
        .then(result => {
          const data = result.data;
          if (data.stateToken) {
            setIsLoggedIn(true);
            setStateToken(data.stateToken);
            setAuthenticationState(data.status);
            setEmail(data.email);
            setUserId(data.userId);
            data.mfaFactors.map(factor => {
              console.log(factor);
              // mfaFactors.push(Object.entries(factor));
              mfaFactors.push({
                factorType: factor.factorType,
                vendorName: factor.vendorName,
              });
            });
            console.log(mfaFactors);
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
          <h1>{mfaFactors}</h1>
          {mfaFactors.forEach(factor => {
            for (let key in factor) {
              console.log(key, factor[key]);
              // <button style={{ fontSize: '32px' }}>{factor[key]}</button>
            }
          })}
        </div>
      ) : (
        loginForm
      )}
    </>
  );
};

export default Login;
