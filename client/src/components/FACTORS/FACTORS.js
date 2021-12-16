import axios from 'axios';
import React, { useState } from 'react';

const FACTORS = props => {
  const [enrolledFactors, setEnrolledFactors] = useState([]);
  const userId = useState(props.userId)[0];
  const sessionToken = useState(props.sessionToken)[0];

  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const ListFactorsToEnroll = async props => {
    const body = JSON.stringify({
      userId: userId,
    });

    await axios
      .post('http://localhost:1337/listFactors', body, config)
      .then(result => {
        console.log(result.data);
        setEnrolledFactors(result.data);
      })
      .catch(err => {
        console.log('FACTOR LIST FAILED');
      });
    return enrolledFactors.map(factor => {
      return <h3>Hey ${factor.factorType}</h3>;
    });
  };

  return (
    <div>
      <h1>Welcome to FACTORS</h1>
      <ListFactorsToEnroll />
    </div>
  );
};

export default FACTORS;
