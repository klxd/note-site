import React, {Component} from 'react';
import './Game2048.css';
class Game2048 extends Component {
  constructor() {
    super();
    this.init();
  }

  componentWillMount() {
    document.addEventListener("keydown", this.onKeyDown.bind(this));
    document.addEventListener("touchstart", function (event) {
      this.touchStartX = event.changedTouches[0].pageX;
      this.touchStartY = event.changedTouches[0].pageY;
    }.bind(this));
    document.addEventListener("touchend", this.onTouchEnd);
  }

  onTouchEnd = (event) => {
    this.touchEndX = event.changedTouches[0].pageX;
    this.touchEndY = event.changedTouches[0].pageY;
    let x = this.touchEndX - this.touchStartX;
    let y = this.touchEndY - this.touchStartY;
    let direction = null;
    if (Math.abs(x) > Math.abs(y)) {
      direction = x > 0 ? 'ArrowRight' : 'ArrowLeft';
    } else {
      direction = y > 0 ? 'ArrowDown' : 'ArrowUp';
    }

    this.onMove(direction);
  };

  onKeyDown = (keyBoardEvent) => {
    this.onMove(keyBoardEvent.code)
  };

  onMove = (direction) => {
    if (this.movePanel(direction)) {
      this.getNewNum();
      this.setState({});
    }
  };

  init = () => {
    this.score = 0;
    this.arr = [];
    for (let i = 0; i < 4; i++) {
      this.arr.push([0, 0, 0, 0]);
    }
    this.getNewNum();
    this.getNewNum();
  };

  getNewNum = () => {
    let position = this.getRandomEmpty();
    if (position >= 0) {
      this.arr[Math.floor(position / 4)][position % 4] = Game2048.getNextCellNumber();
    }
  };

  getRandomEmpty() {
    let emptyPosition = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.arr[i][j] === 0) {
          emptyPosition.push(i * 4 + j);
        }
      }
    }
    if (emptyPosition.length === 0) {
      return -1;
    } else {
      return emptyPosition[Math.floor(Math.random() * emptyPosition.length)];
    }
  }

  static getNextCellNumber() {
    return Math.random() > 0.1 ? 2 : 4;
  }

  movePanel = (direction) => {
    let degree = 0;
    let isChange = false;
    switch (direction) {
      case 'ArrowLeft':
        break;
      case 'ArrowRight':
        degree = 180;
        break;
      case 'ArrowUp':
        degree = 90;
        break;
      case 'ArrowDown':
        degree = 270;
        break;
      default:
        return isChange;
    }
    this.rotate(degree);
    isChange = this.merge();
    this.rotate(360 - degree);
    return isChange;
  };

  merge = () => {
    let isChange = false;
    for (let i = 0; i < 4; i++) {
      let newRow = [];
      for (let j = 0; j < 4; j++) {
        if (this.arr[i][j] !== 0) {
          newRow.push(this.arr[i][j]);
          if (j > 0 && this.arr[i][j - 1] === 0) {
            isChange = true;
          }
        }
      }
      for (let j = 0; j < newRow.length - 1; j++) {
        if (newRow[j] === newRow[j + 1]) {
          newRow[j] *= 2;
          newRow.splice(j + 1, 1);
          isChange = true;
        }
      }
      while (newRow.length < 4) {
        newRow.push(0);
      }
      this.arr[i] = newRow;
    }
    return isChange;
  };

  rotate = (degree) => {
    if (degree % 360 === 0) {
      return;
    }
    for (let i = 0; i < degree / 90; i++) {
      this.rotate90();
    }
  };

  rotate90 = () => {
    let newArray = [];
    for (let col = 3; col >= 0; col--) {
      let newRow = [];
      for (let row = 0; row < 4; row++) {
        newRow.push(this.arr[row][col]);
      }
      newArray.push(newRow);
    }
    this.arr = newArray;
  };

  onRestart = () => {
    this.init();
    this.setState({});
  };

  render() {

    return (
      <div>
        <button onClick={this.onRestart}>
          Restart
        </button>
        <div className="grid-container">
          {this.arr.map((row, index) => <div key={index} className="grid-row">
              {row.map((num, index) => <div key={index} className="grid-cell">{num === 0 ? '' : num}</div>)}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Game2048;