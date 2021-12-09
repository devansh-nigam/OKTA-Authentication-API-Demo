import React from 'react';
import styles from './App.module.css';
import Navbar from './routes/Navigation/Navbar';

function App() {
  return (
    <div className={styles.App}>
      <Navbar />
      <div
        style={{
          textAlign: 'center',
          backgroundColor: 'orange',
          height: '100%',
        }}
      >
        <h1>Dashboard</h1>
      </div>
    </div>
  );
}

export default App;
