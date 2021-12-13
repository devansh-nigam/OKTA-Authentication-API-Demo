import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DisplayFactors from '../../../components/DisplayFactors/DisplayFactors';
import LoginForm from '../../../components/LoginForm/LoginForm';
import MFA_REQUIRED from './../../../components/MFA_REQUIRED/MFA_REQUIRED';

const Login = () => {
  const [primaryAuthState, setPrimaryAuthState] = useState(false);

  const [stateToken, setStateToken] = useState('');

  const [authenticationState, setAuthenticationState] = useState('');

  const [email, setEmail] = useState('');

  const [userId, setUserId] = useState('');

  const [mfaRequireFactors, setMfaRequireFactors] = useState(null);

  const [sessionToken, setSessionToken] = useState('');

  // const [mfaFactors, setMfaFactors] = useState([]);

  // const [factorType, setFactorType] = useState('');

  // const [factorId, setFactorId] = useState('');

  // const [qrCode, setQrCode] = useState('');

  // const [provider, setProvider] = useState('');

  // useEffect(() => {
  //   renderUponStatus();
  // }, [authenticationState]);

  const emailRef = useRef();
  const passwordRef = useRef();

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

            setEmail(data.email);
            setUserId(data.userId);
            console.log(data.factors);
            if (data.status === 'MFA_REQUIRED') {
              //then the factor received would be the one user had enrolled when he logged in the first time
              setMfaRequireFactors(data.factors);
              //data.factors is an array of objects so its easy to render it on screen.
            } else if (data.status === 'MFA_ENROLL') {
              //this is the first time login of the user, the factors would be all the options provided by the organisation that can be
              //setup as a second authentication layer
              //includes (1) Email (2) SMS TOTP (3) GOOGLE Auth (4) OKTA Verify (5) OKTA Push
            }
            setAuthenticationState(data.status);
            // const temp = [];
            // data.mfaFactors.map(factor => {
            //   console.log(factor);
            //   temp.push({
            //     factorId: factor.id, //at this stage, only those factors are shown which were previoulsy enrolled in MFA list
            //     factorType: factor.factorType,
            //     vendorName: factor.vendorName,
            //   });
            // });
            // setMfaFactors(temp);
          }

          emailRef.current.value = '';
          passwordRef.current.value = '';
        })
        .catch(err => {
          console.log(err.message);
        });
    }
  }

  const renderBasedOnAuthenticationState = () => {
    let view = null;

    switch (authenticationState) {
      case 'MFA_REQUIRED':
        view = (
          <MFA_REQUIRED
            alreadyEnrolledFactors={mfaRequireFactors}
            stateToken={stateToken}
            setAuthenticationState={setAuthenticationState}
            setSessionToken={setSessionToken}
          />
        );
        break;

      case 'SUCCESS':
        view = (
          <div style={{ textAlign: 'center', fontSize: '32px' }}>
            <h1>{authenticationState}</h1>
            <p>------------------------------------------</p>
            <h2>You've been successfully authenticated!</h2>
            <h1>Session Token for {email}</h1>
            <h3>{sessionToken}</h3>
            <p>(stateToken will no longer be valid)</p>
          </div>
        );
        break;
    }

    return view;
  };

  return (
    <>
      {primaryAuthState ? (
        <div style={{ textAlign: 'center', fontSize: '32px' }}>
          <p>------------------User ID-----------------</p>
          <h1 style={{ fontSize: '40px' }}>{userId}</h1>
          <p>------------------------------------------</p>
          <p>State Token for {email}</p>
          <h1 style={{ fontSize: '40px' }}>{stateToken}</h1>
          <p>------Authentication Transaction State----</p>
          {/* <h1>{authenticationState}</h1>
          <p>------------------------------------------</p> */}
        </div>
      ) : (
        <LoginForm
          loginFunc={loginUser}
          emailRef={emailRef}
          passRef={passwordRef}
        />
      )}
      <div style={{ marginBottom: '80px' }}>
        {renderBasedOnAuthenticationState()}
      </div>
    </>
  );
};

export default Login;
