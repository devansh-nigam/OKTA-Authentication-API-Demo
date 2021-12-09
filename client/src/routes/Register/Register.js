import React, { useRef } from 'react';
import Navbar from './../Navigation/Navbar';

const Register = () => {
  const firstNameRef = useRef();
  const lastNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  //the first point where our frontend is gonna communicate with our backend
  async function registerUser(event) {
    event.preventDefault();
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const firstName = firstNameRef.current.value;
    const lastName = lastNameRef.current.value;

    if (email && password && firstName && lastName) {
      await fetch('http://localhost:1337/createUser/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: {
            firstName: firstName,
            lastName: lastName,
            email: email,
            login: email,
          },
          credentials: {
            password: { value: password },
          },
        }),
      })
        .then(result => {
          console.log(result.json());
          emailRef.current.value = '';
          passwordRef.current.value = '';
          firstNameRef.current.value = '';
          lastNameRef.current.value = '';
        })
        .catch(err => {
          console.log(err.message);
        });

      //   const data = await response.json();
      //   console.log(data);
    }
  }

  return (
    <>
      <Navbar />
      <div
        style={{
          width: '40%',
          margin: '0 auto',
        }}
      >
        <form
          onSubmit={registerUser}
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignContent: 'center',
          }}
        >
          <input
            type='text'
            name='firstName'
            placeholder='First Name'
            style={{ fontSize: '32px' }}
            ref={firstNameRef}
          />
          <br />
          <input
            type='text'
            name='lastName'
            placeholder='Last Name'
            style={{ fontSize: '32px' }}
            ref={lastNameRef}
          />
          <br />
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
            Register
          </button>
        </form>
      </div>
    </>
  );
};

export default Register;
