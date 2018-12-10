import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import * as authActions from '../../actions/auth';

class Header extends React.Component {
  // constructor is only necessary to allow console log. 
  // delete constructor when console log is deleted.
  constructor(props) {
    super(props);
    console.log('Header props: ', props);
  }
  render() {
    return (
      <header className='header'>
        <h1>PIPER&#8217;S SEEKERS</h1>
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
