import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import DisplayFactors from '../../../components/DisplayFactors/DisplayFactors';
import LoginForm from '../../../components/LoginForm/LoginForm';

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

  // useEffect(() => {
  //   renderUponStatus();
  // }, [isLoggedIn, authenticationState]);

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
          <p>------------------User ID-----------------</p>
          <h1 style={{ fontSize: '40px' }}>{userId}</h1>
          <p>------------------------------------------</p>
          <p>State Token for {email}</p>
          <h1 style={{ fontSize: '40px' }}>{stateToken}</h1>
          <p>------Authentication Transaction State----</p>
          <h1>{authenticationState}</h1>
          <p>------------------------------------------</p>
        </div>
      ) : (
        <LoginForm
          loginFunc={loginUser}
          emailRef={emailRef}
          passRef={passwordRef}
        />
      )}
    </>
  );
};

export default Login;
