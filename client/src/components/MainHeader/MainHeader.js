import React from 'react';
import { NavLink } from 'react-router-dom';
import classes from './MainHeader.module.css';

const MainHeader = props => {
  const links = props.links;

  return (
    <header className={classes.header}>
      <nav>
        <ul>
          {links.map(link => {
            return (
              <li>
                <NavLink activeClassName={classes.active} to={link}>
                  {link}
                </NavLink>
              </li>
            );
          })}
          {/* <li>
            <NavLink activeClassName={classes.active} to='/welcome'>
              Welcome
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName={classes.active} to='/login'>
              Login
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName={classes.active} to='/register'>
              Register
            </NavLink>
          </li> */}
        </ul>
      </nav>
    </header>
  );
};

export default MainHeader;
