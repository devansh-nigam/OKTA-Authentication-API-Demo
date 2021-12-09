import React from 'react';
import styles from './Card.module.css';

const Card = props => {
  return (
    <div className={[styles.card]}>
      <div className={styles.logo}></div>
      {props.children}
    </div>
  );
};

export default Card;
