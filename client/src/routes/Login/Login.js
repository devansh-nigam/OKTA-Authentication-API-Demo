import React from 'react';
import Navbar from './../Navigation/Navbar';

const loginUser = event => {
  event.preventDefault();
};

function Login() {
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
          />
          <br />
          <input
            type='password'
            placeholder='Password'
            style={{ fontSize: '32px' }}
          />
          <br />
          <button type='submit' style={{ fontSize: '32px' }}>
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
