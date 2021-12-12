import React, { useState } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import MainHeader from './components/MainHeader/MainHeader.js';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';
import Welcome from './pages/Welcome/Welcome';

function App() {
  const [headerLinks, setHeaderLinks] = useState([
    'Welcome',
    'Login',
    'Register',
  ]);

  return (
    <div>
      <MainHeader links={headerLinks} />
      <main>
        <Switch>
          <Route path='/' exact>
            <Redirect to='/Welcome' />
          </Route>
          <Route path='/Welcome'>
            <Welcome />
          </Route>
          <Route path='/Login'>
            <Login />
          </Route>
          <Route path='/Register' exact>
            <Register />
          </Route>
          {/* <Route path='/products/:productId/:userId' exact>
            <ProductDetail />
          </Route> */}
        </Switch>
      </main>
    </div>
  );
}

export default App;
