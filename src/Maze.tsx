import React from 'react';
import ScriptTag from 'react-script-tag';
import App from './App';
//import $ from "jquery";
import { Alert } from 'reactstrap';
import ReactDOMServer from 'react-dom/server';
import ReactDOM from 'react-dom';
import { useForm, SubmitHandler } from "react-hook-form";


export class Rand {
    static randomInt(x) {
      return Math.floor(Math.random() * x);
    }
    static pickRand(al) {
      return al[this.randomInt(al.length)];
    }
}

//words and audio files 
export class AudioTextController {
  static wrong_words: string[] = ["te", "qaick", "browm", "sox", "jumed", "oer", "sentineel"];
  static correct_words: string[] = ["the", "quick", "brown", "fox", "jumped", "over", "sentinel"]
  static audio_files: string[] = ["test.mp3", "test.mp3", "test.mp3", "test.mp3", "test.mp3", "test.mp3", "test.mp3"]

  //return a random value of both audio and word
  static getWord() {
    let array_size = this.wrong_words.length;
    let item_id = Rand.randomInt(array_size - 1);
    return [this.wrong_words[item_id], this.correct_words[item_id], this.audio_files[item_id]]
  }
}

  //cell for maze 
  export class Cell {
    visited: boolean;
    up: boolean;
    right: boolean;
    down: boolean;
    left: boolean;
    x: any;
    y: any;
    constructor(x, y) {
      this.visited = false;
      this.up = true;
      this.right = true;
      this.down = true;
      this.left = true;
      this.x = x;
      this.y = y;
    }
  }


  
  /* Generate the maze using recursive backtracking.
   * Returns a 2D array of Cells
   * https://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_backtracker
   */
  export class MazeGenerator {
    width: any;
    height: any;
    board = Array();
    nextCell: any;
    cell: any;
    constructor(width, height, start, end) {
      this.width = width;
      this.height = height;
      this.board = [];
  
      // generate cells with walls everywhere
      for (let x = 0; x < this.width; x++) {
        this.board.push([]);
        for (let y = 0; y < this.height; y++) {
          this.board[x].push(new Cell(x, y));
        }
      }
  
      let cell = this.randomCell();
      //let nextCell = null;
  
      cell.visited = true;
      let visitedStack = [cell];
  
      while (visitedStack.length > 0) {
        if (this.isDeadEnd(cell.x, cell.y)) {
          cell = visitedStack.pop();
        } else {
          this.nextCell = this.randomNeighbor(cell.x, cell.y);
          this.nextCell.visited = true;
          this.breakWall(cell, this.nextCell);
          visitedStack.push(cell);
          cell = this.nextCell;
        }
      }
    }
  
    getNeighbors(x, y) {
      var n = Array();
  
      if (y != 0) {
        n.push(this.board[x][y - 1]);
      }
      if (y != this.height - 1) {
        n.push(this.board[x][y + 1]);
      }
      if (x != 0) {
        n.push(this.board[x - 1][y]);
      }
      if (x != this.width - 1) {
        n.push(this.board[x + 1][y]);
      }
  
      return n;
    }
  
    availableNeighbors(x, y) {
      var list = Array();
      var neighbors = this.getNeighbors(x, y);
      for (let i = 0; i < neighbors.length; i++) {
        if (!neighbors[i].visited) list.push(neighbors[i]);
      }
      return list;
    }
  
    randomNeighbor(x, y) {
      return Rand.pickRand(this.availableNeighbors(x, y));
    }
  
    randomCell() {
      return this.board[Rand.randomInt(this.width)][Rand.randomInt(this.height)];
    }
  
    breakWall(c1, c2) {
      if (c1.x == c2.x) {
        if (c1.y < c2.y) {
          c1.down = false;
          c2.up = false;
        }
        if (c1.y > c2.y) {
          c1.up = false;
          c2.down = false;
        }
      } else if (c1.y == c2.y) {
        if (c1.x < c2.x) {
          c1.right = false;
          c2.left = false;
        }
        if (c1.x > c2.x) {
          c1.left = false;
          c2.right = false;
        }
      }
    }
  
    isDeadEnd(x, y) {
      var neighbors = this.getNeighbors(x, y);
      for (let i = 0; i < neighbors.length; i++) {
        if (!neighbors[i].visited) return false;
      }
      return true;
    }
  }
  
  //checkpoint bools to determine if the user has went through the checkpoints
  var key1 = false;
  var key2 = false;
  var key3 = false;


  /* older verison 
    
  const Example = () => {
    let word_info = AudioTextController.getWord();
    return (
      <div>
        
        <form>
        <label>Incorrect Word: {word_info[0]}</label><br/>
        <input type="text" placeholder="Enter Correct Word" id="userWord" name="user_input_word"/><br/>
        </form>


      </div>
    );
  };

  */

  /* to submit user's input of correct words */

/*
  class WordForm extends React.Component<any, any> {
    constructor(props) {
      super(props);
      this.state = {value: '', wordInfo: AudioTextController.getWord()};
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    handleChange(event) {    
      console.log("handleChange changed");
      this.setState({value: event.target.value});
    }

    handleSubmit(event) {
      alert('A word was submitted: ' + this.state['value']);
      event.preventDefault();
    }
  
    render() {
      return (

        <form onSubmit={this.handleSubmit}>
          <p>{this.state['wordInfo'][0]}</p>
          <label>
            Enter Correct Word:
            <input type="text" value={this.state['value']} onChange={this.handleChange} />        
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }

  
*/
  


// new verison with react hook 

 type FormValues = {
  val: string;
};

let test_check_value = "correct"

let info_test_current = "Please enter something to compare to \"" + test_check_value + "\""
let info_test_wrong = "You did not enter \"" + test_check_value + "\""
let info_test_correct = "You did enter \"" + test_check_value + "\""



  const { register, handleSubmit } = useForm<FormValues>();
  const onSubmit: SubmitHandler<FormValues> = data => {
    let info_area = document.getElementById("infoArea");
    if(data['val'] === test_check_value && info_area) {
      info_area.textContent = info_test_correct;
    } else if(info_area) {
      info_area.textContent = info_test_wrong;
    }
    console.log(data['val'] === test_check_value);
  

  return (
    <div>
      <div id="infoArea">{info_test_current}</div>
      <br></br>
      <form onSubmit={handleSubmit(onSubmit)}>
        <input name="val" ref={register} />

        <input type="submit" />
      </form>
    </div>
  );
}
/////////////

  export class MazeGameState {
    width: any;
    height: any;
    currentPos: any;
    path: any[];
    startTime: any;
    gameInProgress: boolean;
    start: any;
    end: { x: number; y: number; };
    checkpoint1: { x: number; y: number; };
    checkpoint2: { x: number; y: number; };
    checkpoint3: { x: number; y: number; };
    board = Array();
    constructor(mazeDimensions, startPosition) {
      const [ width, height ] = mazeDimensions;
  
      this.width = width;
      this.height = height;
      this.currentPos = startPosition;
      this.path = [this.currentPos];
      this.startTime = null;
      this.gameInProgress = false;
  
      this.start = startPosition;
      
      this.end = {
        x: this.width - 1,
        y: this.height - 1
      };
  
      //checkpoints 

      this.checkpoint1 = {
        x: Math.floor(Math.random() * (this.width - 2)),
        y: Math.floor(Math.random() * (this.height - 2))
      }
  
  
      this.checkpoint2 = {
        x: Math.floor(Math.random() * (this.width - 2)),
        y: Math.floor(Math.random() * (this.height - 2))
      }
  
      this.checkpoint3 = {
        x: Math.floor(Math.random() * (this.width - 2)),
        y: Math.floor(Math.random() * (this.height - 2))
      }
  
  
  
      this.board = new MazeGenerator(this.width, this.height, this.start, this.end).board;
    }

    
    getCell(x, y) {
      return this.board[x][y];
    };
  
    isStartCell(cell) {
      if (this.start.x === cell.x && this.start.y === cell.y) return true;
      return false;
    }
  
    isCheckpointCell(cell){
      if (this.checkpoint1.x === cell.x && this.checkpoint1.y === cell.y) {
        console.log("At the checkpoint1");
        console.log("1 x :" + this.checkpoint1.x + " y :" + this.checkpoint1.y);
        if(key1 === false){
          //alert("At the Checkpoint 1");
          const messageArea = document.getElementById("messageArea");
          //messageArea.innerHTML = ReactDOMServer.renderToStaticMarkup(Example());
          //  const nameForm = new WordForm(null);
          //  ReactDOM.render(nameForm.render(), messageArea);
          key1 = true;
        }
        return;
      }
      else if (this.checkpoint2.x === cell.x && this.checkpoint2.y === cell.y) {
        console.log("At the checkpoint2");
        console.log("2 x :" + this.checkpoint2.x + " y :" + this.checkpoint2.y);
        if(key2 === false){
          //alert("At the checkpoint 2");
          const messageArea = document.getElementById("messageArea");
          //messageArea.innerHTML = ReactDOMServer.renderToStaticMarkup(Example());
          //  const nameForm = new WordForm(null);
          //  ReactDOM.render(nameForm.render(), messageArea);
          key2 = true;
        }
        return;
      }
      else if (this.checkpoint3.x === cell.x && this.checkpoint3.y === cell.y) {
        console.log("At the checkpoint3");
        console.log("3 x :" + this.checkpoint3.x + " y :" + this.checkpoint3.y);
        if(key3 === false){
          //alert("At the checkpoint 3");
          const messageArea = document.getElementById("messageArea");
          //messageArea.innerHTML = ReactDOMServer.renderToStaticMarkup(Example());
          //  const nameForm = new WordForm(null);
          //  ReactDOM.render(nameForm.render(), messageArea);
          key3 = true;
        }
        return;
      }
      console.log("Not checkpoint");
      const messageArea = document.getElementById("messageArea") as HTMLDivElement;
      messageArea.innerHTML = "";
      return false;
    }
  
    isEndCell(cell) {
      if (this.end.x === cell.x && this.end.y === cell.y) return true;
      return false;
    }
  
    isCellInBounds(x, y) {
      if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
        return true;
      }
      return false;
    }
  
    get numSteps() {
      // subtract one to account for the current positon being part of the path
      return this.path.length - 1;
    }
  
    get playTime() {
      if (this.startTime) {
        return (new Date()).getTime() - this.startTime.getTime();
      }
    }
  }
  
  export class MazeGame {
    offsets: { left: { x: number; y: number; }; up: { x: number; y: number; }; right: { x: number; y: number; }; down: { x: number; y: number; }; };
    options: any;
    state: MazeGameState;
    ui: MazeUi;
    constructor(canvas, options) {
      let defaultOptions = {
        ui: {},
        startPosition: { x: 0, y: 0 },
        checkpointPosition: { x: 2, y: 2},
        dimensions: [7, 7]
      }
  
      this.offsets = {
        "left"  : { x: -1, y: 0 },
        "up"  : { x: 0, y:  -1 },
        "right" : { x: 1, y: 0 },
        "down"  : { x: 0, y: 1 }
      };
  
      //this.options = $.extend({}, defaultOptions, options);
  
      this.state = new MazeGameState(this.options.dimensions, this.options.startPosition);
      this.ui = new MazeUi(this.state, options.ui, canvas);
      this.ui.center();
  
      this.start();
    }
  
    start() {
      this.state.gameInProgress = true;
      this.state.startTime = new Date();
    }
  
    move(direction) {
      var newPos = {
        x: this.state.currentPos.x + this.offsets[direction].x,
        y: this.state.currentPos.y + this.offsets[direction].y
      };
      if (this.state.gameInProgress && this.state.isCellInBounds(newPos.x, newPos.y)) {
        if (this.state.getCell(this.state.currentPos.x, this.state.currentPos.y)[direction] === false) {
          this.state.path.push(newPos);
          this.state.currentPos = newPos;
          this.ui.update()
          if (this.state.isEndCell(newPos)) {
            if(key1 === true && key2 === true && key3 === true){
              this.onGameEnd();
            }
            else{
              alert("Need to get all keys before exit the game");
            }
          }
          if (this.state.isCheckpointCell(newPos)) {
            console.log("On Checkpoint");
          }
        }
      }
    }
  
    onGameEnd() {
      this.state.gameInProgress = false;
      clearInterval(App.timer);
      //App.center($("#options").show());
      //reset all keys
      key1 = false;
      key2 = false;
      key3 = false;
    }
  }
  
  export class MazeUi {
    canvas: any;
    ctx: any;
    state: any;
    options: any;
    constructor(state, options, canvas) {
      this.canvas = canvas;
      this.ctx = this.canvas.getContext("2d");
      this.state = state;
  
      let defaultOptions = {
        colors: {
          walls: "#282929",
          curPosition: "#8e44ad",
          finish: "#63efff",
          checkpoint1: "#1abc9c",
          checkpoint2: "#e74c3c",
          checkpoint3: "#f39c12",
          visitedBlock: "#fff"
        },
        offset: {x: 0, y: 0}, // top left corner where the maze is actually drawn
        scale: 26,
        curIndicatorDiameter: 4,
        pathWidth: 8,
      }
  
      // TODO: don't use jQuery here
      //this.options = $.extend({}, defaultOptions, options);
    }
  
    update() {
      this.clear();
      this.drawPath();
      this.drawMaze();
      this.drawSteps()
      this.drawTimer()
    }
  

    
    center() {
      //let $body = $('body');
      //this.canvas.width = $body.width();
      //this.canvas.height = $body.height();
  
      this.options.offset.x = Math.floor((this.canvas.width / 2) - (this.state.width * this.options.scale / 2));
      this.options.offset.y = Math.floor((this.canvas.height / 2) - (this.state.height * this.options.scale / 2));
      //$("#a").width(this.state.width * this.options.scale + 3).css('padding-top', (this.canvas.height / 2) - (this.state.height * this.options.scale / 2));

      //if(typeof $ !== 'undefined') {
        //console.log("Undefined");
      //}
      //$("#a").width(this.state.width * this.options.scale + 3).css('padding-top', (this.canvas.height / 2) - (this.state.height * this.options.scale / 2) - $('h1').height());
      //$("#time, #steps").css('margin-top', this.state.height * this.options.scale);
      this.update();
    }
    
    clear() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  
    drawSteps() {
      //$("#steps").html(this.state.numSteps + " step" + (App.steps !== 1 ? "s" : ""));
    }
  
    drawTimer() {
      let playTimeSeconds = Math.floor((this.state.playTime || 0) / 1000)
      //$("#time").html(playTimeSeconds + " second" + (playTimeSeconds !== 1 ? "s" : ""));
    }
  
    drawPath() {
      this.ctx.lineWidth = this.options.pathWidth;
      this.ctx.strokeStyle = this.options.colors.visitedBlock;
      this.ctx.beginPath();
      this.ctx.moveTo(this.options.offset.x + 0.5 * this.options.scale, 0);
      for (let i = 0; i < this.state.path.length - 1; i++) {
        let pathPosition = this.state.path[i];
        this.ctx.lineTo(this.options.offset.x + (pathPosition.x + 0.5) * this.options.scale, this.options.offset.y + (pathPosition.y + 0.5) * this.options.scale);
      }
      this.ctx.lineTo(this.options.offset.x + (this.state.currentPos.x + 0.5) * this.options.scale, this.options.offset.y + (this.state.currentPos.y + 0.5) * this.options.scale);
      this.ctx.stroke();
      this.circle(this.state.currentPos.x, this.state.currentPos.y, this.options.colors.curPosition);
  
      
    }
  
    drawMaze() {
      this.circle(this.state.end.x, this.state.end.y, this.options.colors.finish);
  
      this.circle(this.state.checkpoint1.x, this.state.checkpoint1.y, this.options.colors.checkpoint1);
      console.log("1 x :" + this.state.checkpoint1.x + " y :" + this.state.checkpoint1.y);
      this.circle(this.state.checkpoint2.x, this.state.checkpoint2.y, this.options.colors.checkpoint2);
      console.log("2 x :" + this.state.checkpoint2.x + " y :" + this.state.checkpoint2.y);
      this.circle(this.state.checkpoint3.x, this.state.checkpoint3.y, this.options.colors.checkpoint3);
      console.log("3 x :" + this.state.checkpoint3.x + " y :" + this.state.checkpoint3.y);
  
      for (let x = 0; x < this.state.width; x++) {
        for (let y = 0; y < this.state.height; y++) {
          let cell = this.state.getCell(x, y);
          this.drawCell(cell);
        }
      }
    }
  
    drawCell(cell) {
      var originx = cell.x * this.options.scale;
      var originy = cell.y * this.options.scale;
      if (cell.up && !this.state.isStartCell(cell)) this.line(originx, originy, originx + this.options.scale, originy);
      if (cell.down && !this.state.isEndCell(cell)) this.line(originx, originy + this.options.scale, originx + this.options.scale, originy + this.options.scale);
      if (cell.right) this.line(originx + this.options.scale, originy, originx + this.options.scale, originy + this.options.scale);
      if (cell.left) this.line(originx, originy, originx, originy + this.options.scale);
    }
  
    line(x1, y1, x2, y2) {
      this.ctx.beginPath();
      this.ctx.strokeStyle = this.options.colors.walls;
      this.ctx.lineWidth = 2;
      this.ctx.moveTo(this.options.offset.x + x1 + 1, this.options.offset.y + y1 + 1);
      this.ctx.lineTo(this.options.offset.x + x2 + 1, this.options.offset.y + y2 + 1);
      this.ctx.stroke();
    }
  
    circle(x, y, color) {
      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(this.options.offset.x + (x + 0.5) * this.options.scale, this.options.offset.y + (y + 0.5) * this.options.scale, this.options.curIndicatorDiameter, 0, Math.PI*2, true);
      this.ctx.closePath();
      this.ctx.fill();
    }
  }

