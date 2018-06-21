import React from 'react';
import { connect } from 'react-redux';
import autoBind from '../../utils/index';
import crowdImage from '../../../assets/backgrounds/curran-unsplash.jpg';
// import streetImage from '../../../assets/backgrounds/flobrant-unsplash.jpg';
// import puzzleImage from '../../../assets/backgrounds/gauster-unsplash.jpg';
// import greenHillsImage from '../../../assets/backgrounds/testa-unsplash.jpg';


const CANVAS_WIDTH = 560;
const CANVAS_HEIGHT = 560;

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      socket: this.props.socket,
    };
    autoBind.call(this, Game);
  }

  componentDidMount() {
    const { canvas } = this.refs; // eslint-disable-line
    const ctx = canvas.getContext('2d');
    const NUMBER_OF_STARS = 7;
    const STAR_OUTER_RADIUS = 30;
    const STAR_INNER_RADIUS = 15;
    const STAR_STROKE_COLOR = '#ccc';
    const STAR_STROKE_WIDTH = 3;
    let xCoord = 0;
    let yCoord = 0;

    const drawStar = (
      xPos,
      yPos,
      starPoints,
    ) => {
      let rotation = (Math.PI / 2) * 3;
      let x = xPos;
      let y = yPos;
      const interval = Math.PI / starPoints;

      ctx.beginPath();
      ctx.moveTo(xPos, yPos - STAR_OUTER_RADIUS);
      for (let i = 0; i < starPoints; i++) {
        x = xPos + (Math.cos(rotation) * STAR_OUTER_RADIUS);
        y = yPos + (Math.sin(rotation) * STAR_OUTER_RADIUS);
        ctx.lineTo(x, y);
        rotation += interval;

        x = xPos + (Math.cos(rotation) * STAR_INNER_RADIUS);
        y = yPos + (Math.sin(rotation) * STAR_INNER_RADIUS);
        ctx.lineTo(x, y);
        rotation += interval;
      }
      ctx.lineTo(xPos, yPos - STAR_OUTER_RADIUS);
      ctx.closePath();
      ctx.lineWidth = STAR_STROKE_WIDTH;
      ctx.strokeStyle = STAR_STROKE_COLOR;
      ctx.stroke();
    };

    for (let i = 0; i < NUMBER_OF_STARS; i++) {
      xCoord = Math.random() * (CANVAS_WIDTH - (3 * STAR_OUTER_RADIUS));
      yCoord = Math.random() * (CANVAS_HEIGHT - (3 * STAR_OUTER_RADIUS));

      ctx.strokeStyle = '#fff';
      drawStar(xCoord, yCoord, 7);
    }
  }

  handleClick(event) {
    event.preventDefault();
    const {canvas} = this.refs; // eslint-disable-line
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const coordinates = `X coords: ${x}, Y coords: ${y}`;

    if (this.props.socket) {
      this.props.socket.emit('SEND_MESSAGE', `PLAYER ${this.props.socket.id} CLICKED AT ${coordinates}`);
    }
  }

  render() {
    if (this.props.socket) {
      this.props.socket.on('RECEIVE_MESSAGE', (data) => {
        console.log(data);
      });
    }
    const canvasStyle = {
      backgroundImage: `url(${crowdImage})`,
      backgroundSize: 'cover',
    };
    return (
      <div className='game'>
        <canvas
          style={canvasStyle}
          ref='canvas' // eslint-disable-line
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={this.handleClick}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  socket: state.socket,
});

export default connect(mapStateToProps, null)(Game);