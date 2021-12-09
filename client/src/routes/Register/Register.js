import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from './../Navigation/Navbar';

function Register() {
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
          />
          <br />
          <input
            type='password'
            placeholder='Password'
            style={{ fontSize: '32px' }}
          />
          <br />
          <button type='submit' style={{ fontSize: '32px' }}>
            Register
          </button>
        </form>
      </div>
    </>
  );
}

export default Register;
