import React from 'react';

const DisplayFactors = props => {
  const factors = props.factor;
  let text = null;
  const factor = factors.factorType;
  const vendorName = factors.vendorName;

  let onClickFunc = null;

  switch (props.authenticationState) {
    case 'MFA_ENROLL':
      onClickFunc = props.factorEnroll;
      break;

    case 'MFA_REQUIRED':
      if (factors.factorType === 'push') {
        onClickFunc = props.pushFactorVerify;
      } else {
        onClickFunc = props.verify;
      }
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
        onClickFunc(factors);
      }}
    >
      {text}
    </button>
  ) : null;
};

export default DisplayFactors;
