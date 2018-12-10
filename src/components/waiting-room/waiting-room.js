import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as roomActions from '../../actions/room-actions';
import * as hostActions from '../../actions/host-actions';
import * as socketActions from '../../actions/socket-actions';
import autoBind from '../../utils';

class WaitingRoom extends Component {
  constructor(props) {
    super(props);
    this.socket = this.props.socket;
    this.isHost = this.props.room.isHost;

    this.state = {
      playerCount: 0,
      roomCode: null,
      playerNames: [],
      numPlayers: 0,
      numStars: 10,
      time: 20,
      backgroundImageNumber: 1,
    };
    autoBind.call(this, WaitingRoom);
  }
  

  static contextTypes = {
    router: PropTypes.object,
  };

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleStartGame() {
    this.props.socket.emit('SET_HOSTVARS', this.props.room.code, this.state.numStars, this.state.time, this.state.backgroundImageNumber);
    this.props.socket.emit('HOST_REDIRECT', this.props.room.code);
  }

  handleInit() {
    this.props.socket.emit('SET_HOSTVARS', this.state.numStars, this.state.time, this.state.backgroundImageNumber);
  }

  componentDidMount() {
    if (this.isHost) {
      this.socket.emit('CREATE_ROOM', this.props.room.username);

      this.socket.on('SEND_ROOM', (data) => {
        const parsedData = JSON.parse(data);
        const { roomCode, roomHost } = parsedData;

        this.props.setRoom({
          code: roomCode,
          isHost: this.isHost,
          roomHost,
          username: this.props.room.username,
        });

        this.setState({ roomCode });
        this.props.setSocket(this.socket);
      });
    }

    this.socket.on('TRACK_PLAYERS', (num, list) => {
      this.setState({
        numPlayers: num,
        playerNames: list,
      });
    });


    this.props.socket.on('REDIRECT', () => {
      this.context.router.history.push('/game');
    });

    this.socket.on('GET_HOSTVARS', (data) => {
      const parsedData = JSON.parse(data);
      const { numStars, time, backgroundImageNumber } = parsedData;

      this.props.setHost({
        numStars,
        time,
        backgroundImageNumber,
      });
    });
  }

  componentDidUpdate() {
    console.log('COMPONENT DID UPDATE');
  }

  componentWillUnmount() {
    console.log('COMPONENT WILL UNMOUNT');
  }

  render() {
    console.log('WAITING-ROOM.JS this.props:', this.props);
    const hostVarsJSX = <div>
          <form id="roomcode-form" onSubmit={this.handleJoinRoom}>
          <h3> # of Stars </h3>
          <input name="numStars" id="numStars" placeholder='10' onChange={this.handleChange}/>
          <h3> Time (seconds) </h3>
          <input name="time" id="time" placeholder='20' onChange={this.handleChange}/>
          <h3> Background Image (enter a number 1-4) </h3>
          <input name="backgroundImageNumber" id="backgroundImageNumber" placeholder='1' onChange={this.handleChange}/>

      <button type='button' className='start' onClick= {this.handleStartGame}> START GAME </button>
      </form>

    </div>;
    return (
            <div>

            <h1> Room Code </h1>
            <h2>{this.props.room.code}</h2>

            <h1> Number of Players </h1>
            <h2> {this.state.numPlayers} </h2>

            <h1> Player Names </h1>
            <h2> {this.state.playerNames.join(', ')} </h2>


              {this.isHost ? hostVarsJSX : undefined }
            </div>
    );
  }
}

WaitingRoom.propTypes = {
  socket: PropTypes.object,
  setRoom: PropTypes.func,
  setHost: PropTypes.func,
  setSocket: PropTypes.func,
  room: PropTypes.object,
  host: PropTypes.object,
};

const mapStateToProps = state => ({
  room: state.room,
  socket: state.socket,
  host: state.host,
});

const mapDispatchToProps = dispatch => ({
  setRoom: room => dispatch(roomActions.roomSet(room)),
  setHost: host => dispatch(hostActions.hostSet(host)),
  setSocket: socket => dispatch(socketActions.socketSet(socket)),
});

export default connect(mapStateToProps, mapDispatchToProps)(WaitingRoom);
