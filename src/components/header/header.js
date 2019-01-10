import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as authActions from '../../actions/auth';

class Header extends React.Component {
  render() {
    return (
      <header className='header'>
        <h1>PIPERS SEEKERS</h1>
        <h2>A Search Game</h2>
        <nav>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/about'>About</Link>
          </li>

        </nav>
      </header>
    );
  }
}

Header.propTypes = {
};

const mapStateToProps = state => ({
  loggedIn: !!state.token,
});

const mapDispatchToProps = dispatch => ({
  doLogout: () => dispatch(authActions.logout()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Header);
