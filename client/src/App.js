import React from 'react';
import styles from './App.module.css';
import Card from './components/Card/Card';
import TextInput from './components/TextInput/TextInput';
import Button from './components/Button/Button';

function App() {
  return (
    <div className={styles.App}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
        }}
      >
        <Card>
          <div style={{ marginTop: '20px' }}>
            <form>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <TextInput type='email' name='Email' />
                <TextInput type='password' name='Password' />
                <Button type='submit' title='Submit' />
              </div>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default App;
