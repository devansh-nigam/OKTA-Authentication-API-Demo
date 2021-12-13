import React from 'react';

const LoginForm = props => {
  return (
    <div
      style={{
        width: '40%',
        margin: '0 auto',
      }}
    >
      <form
        onSubmit={props.loginFunc}
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
          ref={props.emailRef}
        />
        <br />
        <input
          type='password'
          placeholder='Password'
          style={{ fontSize: '32px', fontFamily: 'Roboto' }}
          ref={props.passRef}
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
};

export default LoginForm;
