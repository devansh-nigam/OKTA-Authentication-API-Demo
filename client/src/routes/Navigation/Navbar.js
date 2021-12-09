import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  return (
    <nav
      className={styles.navbar}
      style={{
        display: 'flex',
        justifyContent: 'space-around',
      }}
    >
      <Link to='/'>Dashboard</Link>
      <Link to='/register'>Register</Link>
      <Link to='/login'>Login</Link>
    </nav>
  );
}

export default Navbar;
