import React from 'react';

const TextInput = props => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        marginTop: '20px',
        marginRight: '50px',
        marginLeft: '50px',
      }}
    >
      <label
        for={props.name}
        style={{
          color: 'white',
          alignSelf: 'flex-start',
          fontWeight: 'bold',
        }}
      >
        {props.name}
      </label>
      <input
        type={props.type}
        placeholder={props.placeholderText}
        style={{
          height: '40px',
          fontSize: '22px',
          borderRadius: '6px',
          padding: '10px',
        }}
        name={props.name}
      />
    </div>
  );
};

export default TextInput;
