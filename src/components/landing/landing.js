import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import autoBind from '../../utils';
import * as roomActions from '../../actions/room-actions';
import * as authActions from '../../actions/auth';
import AuthForm from '../auth-form/auth-form';

class Landing extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      socket: this.props.socket,
      joinRoom: false,
      roomCode: '',
      authFormDisplay: false,
    };

    autoBind.call(this, Landing);
  }

  static contextTypes = {
    router: PropTypes.object,
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleLogin(user) {
    return this.props.pDoLogin(user)
      .then(() => {
        this.setState({ authFormDisplay: false });
        if (this.props.token) {
          this.props.setRoom({
            isHost: true,
            username: this.props.room.username,
          });
          this.context.router.history.push('/WaitingRoom');
        }
      })
      .catch(console.error); // eslint-disable-line
  }

  handleSignup(user) {
    return this.props.pDoSignup(user)
      .then(() => {
        this.setState({ authFormDisplay: false });
        if (this.props.token) {
          this.props.setRoom({
            isHost: true,
            username: this.props.room.username,
          });
          this.context.router.history.push('/WaitingRoom');
        }
      })
      .catch(console.error); // eslint-disable-line
  }

  handleRedirectToWaitingRoom = () => {
    this.context.router.history.push('/WaitingRoom');
  }

  handleCreateRoom(event) {
    if (this.props.token) {
      event.preventDefault();
      this.props.setRoom({
        isHost: true,
        username: this.props.room.username,
      });
      this.handleRedirectToWaitingRoom();
    } else if (!this.props.token) {
      this.setState({ authFormDisplay: true, joinRoom: false }); // eslint-disable-line
    }
  }

  handleJoinClick(event) {
    event.preventDefault();
    this.setState({ joinRoom: true, authFormDisplay: false });
  }

  handleJoinRoom(event) {
    event.preventDefault();
    this.props.socket.emit('JOIN_ROOM', this.state.roomCode.toUpperCase(), this.state.username);

    this.props.socket.on('JOIN_ROOM_ERROR', (message) => {
      console.log('JOIN ROOM ERROR', message);
    });

    this.props.socket.on('JOINED_ROOM', () => {
      this.props.setRoom({
        code: this.state.roomCode.toUpperCase(),
        isHost: false,
        username: this.state.username,
      });
      this.handleRedirectToWaitingRoom();
    });
  }

  render() {
    console.log('LANDING.JS this.props:', this.props);
    const joinRoomJSX = <div>
      <form id="roomcode-form" onSubmit={this.handleJoinRoom}>
        <h3>Choose a Username</h3>
        <input
          name="username"
          placeholder='username'
          id="username"
          onChange={this.handleChange} />
        <h3>Enter Room Code</h3>
        <input
          name="roomCode"
          placeholder='room code'
          id="roomcode-input"
          onChange={this.handleChange} />
        <br />
        <button type="submit">Join Room</button>
      </form>
    </div>;

    const authFormJSX = <div>
      <h3> Sign Up </h3>
      <AuthForm onComplete={this.handleSignup} />
      <h3> Login </h3>
      <AuthForm type='login' onComplete={this.handleLogin} />
    </div>;

    return (
      <div className='landing'>
        <button type='button' className='host' onClick={this.handleCreateRoom}>HOST GAME</button>
        <button type='button' className='join' onClick={this.handleJoinClick}>JOIN GAME</button>

        {this.state.joinRoom ? joinRoomJSX : undefined}

        {this.state.authFormDisplay ? authFormJSX : undefined}

      </div>
    );
  }
}

Landing.propTypes = {
  socket: PropTypes.object,
  onComplete: PropTypes.func,
  setRoom: PropTypes.func,
  token: PropTypes.string,
  pDoLogin: PropTypes.func,
  pDoSignup: PropTypes.func,
  room: PropTypes.object,
};

// connect invokes mapStateToProps with all the data inside the Store. 
// So 'state' here means the whole state of the Store.

const mapStateToProps = (state) => {
  console.log( 'MAPSTATETOPROPS state', state);
  return {
    socket: state.socket,
    room: state.room,
    token: state.auth,
  };
};

const mapDispatchToProps = dispatch => ({
  setRoom: room => dispatch(roomActions.roomSet(room)),
  pDoSignup: user => dispatch(authActions.signupRequest(user)),
  pDoLogin: user => dispatch(authActions.loginRequest(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
