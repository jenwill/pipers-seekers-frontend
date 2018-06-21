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
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleLogin(user) {
    return this.props.pDoLogin(user)
      .then(() => {
        this.setState({ authFormDisplay: false });
        this.context.router.history.push('/');
      })
      .catch(console.error); // eslint-disable-line
  }

  handleSignup(user) {
    return this.props.pDoSignup(user)
      .then(() => {
        this.setState({ authFormDisplay: false });
        this.context.router.history.push('/');
      })
      .catch(console.error); // eslint-disable-line
  }

  handleRedirectToWaitingRoom = () => {
    this.context.router.history.push('/WaitingRoom');
  }

  handleCreateRoom(event) {
    console.log('TOKEN', this.props.token);
    if (this.props.token) {
      event.preventDefault();
      this.props.setRoom({
        isHost: true,
        username: this.props.room.username,
      });
      this.handleRedirectToWaitingRoom();
    } else if (!this.props.token) {
      this.setState({ authFormDisplay: true }); // eslint-disable-line
    }
  }

  handleJoinClick(event) {
    event.preventDefault();
    this.setState({ joinRoom: true });
  }
  
  handleJoinRoom(event) {
    event.preventDefault();
    this.props.socket.emit('JOIN_ROOM', this.state.roomCode.toUpperCase(), this.state.username);
    
    this.props.socket.on('JOIN_ROOM_ERROR', (message) => {
      console.log('JOIN ROOM ERROR', message);
    });

    this.props.socket.on('JOINED_ROOM', () => {
      this.props.setRoom({
        roomCode: this.state.roomCode,
        isHost: false,
        username: this.state.username,
      });
      this.handleRedirectToWaitingRoom();
    }); 
  }

  render() {
    console.log('PROPS IN LANDING', this.props);

    const joinRoomJSX = <div>
          <form id="roomcode-form" onSubmit={this.handleJoinRoom}>
          <h2> Username </h2>
          <input name="username" id="username" onChange={this.handleChange}/>
          <input name="roomCode" id="roomcode-input" onChange={this.handleChange}/>
          <button type="submit">Join Room</button>
        </form>
      </div>;

    const authFormJSX = <div>
      <h1> SIGN UP </h1> 
        <AuthForm onComplete={this.handleSignup}/>
      <h1> LOGIN </h1>
        <AuthForm type='login' onComplete={this.handleLogin}/>
      </div>;

    return (
      <div className='landing'>
        <h1> THIS IS THE LANDING PAGE </h1>
        <button type='button' className='host' onClick={this.handleCreateRoom}>HOST GAME</button>
        <button type='button' className='join' onClick= {this.handleJoinClick}>JOIN GAME</button>

        {this.state.joinRoom ? joinRoomJSX : undefined }

        {this.state.authFormDisplay ? authFormJSX : undefined }

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

const mapStateToProps = state => ({
  socket: state.socket,
  room: state.room,
  token: state.auth,
});

const mapDispatchToProps = dispatch => ({
  setRoom: room => dispatch(roomActions.roomSet(room)),
  pDoSignup: user => dispatch(authActions.signupRequest(user)),
  pDoLogin: user => dispatch(authActions.loginRequest(user)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Landing);
