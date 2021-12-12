import React from 'react';
import { Route } from 'react-router-dom';

const Welcome = () => {
  return (
    <div>
      <h1>OKTA Authentication API Demo</h1>
      <Route path='/welcome/new-user'>
        <p>Welcome new-user</p>
      </Route>
    </div>
  );
};

export default Welcome;
