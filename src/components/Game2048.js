import React, {Component} from 'react';
import Button from './Button';
import '../less/component/Game2048.less';

class Game2048 extends Component {
  constructor() {
    super();
    this.init();
    this.state = {arr: this.arr};
  }

  static LEFT = 1;
  static RIGHT = 2;
  static UP = 3;
  static DOWN = 4;

  componentWillMount() {
    if (typeof document !== `undefined`) {
      document.addEventListener("keydown", this.onKeyDown.bind(this));
      document.addEventListener("touchstart", function (event) {
        this.touchStartX = event.changedTouches[0].pageX;
        this.touchStartY = event.changedTouches[0].pageY;
      }.bind(this));
      document.addEventListener("touchend", this.onTouchEnd);
    }
  }

  onTouchEnd = (event) => {
    this.touchEndX = event.changedTouches[0].pageX;
    this.touchEndY = event.changedTouches[0].pageY;
    let x = this.touchEndX - this.touchStartX;
    let y = this.touchEndY - this.touchStartY;
    let direction;
    if (Math.abs(x) > Math.abs(y)) {
      direction = x > 0 ? Game2048.RIGHT : Game2048.LEFT;
    } else {
      direction = y > 0 ? Game2048.DOWN : Game2048.UP;
    }
    this.onMove(direction);
  };

  onKeyDown = (keyBoardEvent) => {
    let direction;
    switch (keyBoardEvent.code) {
      case 'ArrowLeft':
        direction = Game2048.LEFT;
        break;
      case 'ArrowRight':
        direction = Game2048.RIGHT;
        break;
      case 'ArrowUp':
        direction = Game2048.UP;
        break;
      case 'ArrowDown':
        direction = Game2048.DOWN;
        break;
      default:
        return;
    }
    this.onMove(direction)
  };

  /**
   * @param {number} direction
   */
  onMove = (direction) => {
    let isChanged;
    let newArr = Game2048.copyArray(this.arr);
    [isChanged, newArr] = Game2048.tryMovePanel(newArr, direction);
    if (isChanged) {
      let position = Game2048.setNewNum(newArr);
      let isGameOver = Game2048.isGameOver(newArr);
      this.preArr = this.arr;
      this.arr = newArr;
      this.setState({
        arr: this.arr,
        isGameOver: isGameOver,
        newCellPosition: position
      });
    }
  };

  onRestart = () => {
    this.init();
    this.setState({arr: this.arr, isGameOver: false});
  };

  onRevert = () => {
    this.arr = this.preArr;
    this.preArr = null;
    this.setState({arr: this.arr, isGameOver: false});
  };

  init = () => {
    this.preArr = null;
    this.arr = [];
    for (let i = 0; i < 4; i++) {
      this.arr.push([0, 0, 0, 0]);
    }
    Game2048.setNewNum(this.arr);
    Game2048.setNewNum(this.arr);
  };

  static setNewNum = (arr) => {
    let position = Game2048.randomEmptyCell(arr);
    if (position >= 0) {
      arr[Math.floor(position / 4)][position % 4] = Game2048.generateNewCellNumber();
    }
    return position;
  };

  /**
   * @return {number} index of empty cell (0-based), return -1 when no empty cell
   */
  static randomEmptyCell(arr) {
    let emptyPosition = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (arr[i][j] === 0) {
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

  /**
   * @return {number} number for new cell, 2(90%) and 4(10%)
   */
  static generateNewCellNumber() {
    return Math.random() > 0.1 ? 2 : 4;
  }

  static copyArray = (arr) => {
    let newArr = [];
    for (let i = 0; i < arr.length; i++) {
      let newRow = [];
      for (let j = 0; j < arr[i].length; j++) {
        newRow.push(arr[i][j]);
      }
      newArr.push(newRow);
    }
    return newArr;
  };

  static isGameOver(arr) {
    for (let i = 1; i <= 4; i++) {
      let [isChanged,] = Game2048.tryMovePanel(arr, i);
      if (isChanged) {
        return false;
      }
    }
    return true;
  }

  /**
   * @param {Array} arr
   * @param {number} direction
   * @return {Array} [whether the origin array is changed, the new array]
   */
  static tryMovePanel = (arr, direction) => {
    let degree = 0;
    let isChange = false;
    switch (direction) {
      case Game2048.LEFT:
        break;
      case Game2048.RIGHT:
        degree = 180;
        break;
      case Game2048.UP:
        degree = 90;
        break;
      case Game2048.DOWN:
        degree = 270;
        break;
      default:
        return [isChange];
    }
    let newArr = Game2048.rotate(arr, degree);
    [isChange, newArr] = Game2048.merge(newArr);
    newArr = Game2048.rotate(newArr, 360 - degree);
    return [isChange, newArr];
  };

  static merge = (arr) => {
    let isChange = false;
    for (let i = 0; i < 4; i++) {
      let newRow = [];
      for (let j = 0; j < 4; j++) {
        if (arr[i][j] !== 0) {
          newRow.push(arr[i][j]);
          if (j > 0 && arr[i][j - 1] === 0) {
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
      arr[i] = newRow;
    }
    return [isChange, arr];
  };

  static rotate = (arr, degree) => {
    let newArr = Game2048.copyArray(arr);
    for (let i = 0; i < (degree % 360) / 90; i++) {
      newArr = Game2048.rotate90(newArr);
    }
    return newArr;
  };

  static rotate90 = (arr) => {
    let newArray = [];
    for (let col = 3; col >= 0; col--) {
      let newRow = [];
      for (let row = 0; row < 4; row++) {
        newRow.push(arr[row][col]);
      }
      newArray.push(newRow);
    }
    return newArray;
  };


  render() {
    return (
      <div className="game-2048">
        <div className="header-container">
          <div className="header-text">2048</div>
          <div className="button-container">
            <Button onClick={this.onRestart} label="New Game"/>
            <Button onClick={this.onRevert} label="Revert" disabled={this.preArr === null}/>
          </div>
        </div>
        <div className="grid-container">
          {this.state.isGameOver ? <div className="game-over-message">Game Over!</div> : null}
          {this.state.arr.map((row, rowIndex) =>
            <div key={rowIndex} className="grid-row">
              {row.map((num, columnIndex) => {
                  let newClass = (rowIndex * 4 + columnIndex) === this.state.newCellPosition ? 'tile-new ' : '';
                  let numClass = 'tile-' + (num > 2048 ? 'super' : num);
                  return (<div key={columnIndex} className={'grid-cell ' + newClass + numClass}>
                    {num === 0 ? '' : num}
                  </div>)
                }
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default Game2048;