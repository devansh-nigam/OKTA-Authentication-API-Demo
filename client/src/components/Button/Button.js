import React from 'react';

const Button = props => {
  return (
    <button
      style={{
        marginRight: '20px',
        marginLeft: '20px',
        height: '40px',
        fontSize: '18px',
        borderRadius: '6px',
        margin: '50px',
      }}
      type={props.type}
    >
      {props.title}
    </button>
  );
};

export default Button;
