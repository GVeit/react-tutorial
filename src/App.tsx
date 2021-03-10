import React from 'react';
import { Rand, Cell, MazeGenerator, MazeGameState, MazeGame, MazeUi } from './Maze'



class App extends React.Component {
    static timer: any;
    static center: any;
    static steps: number;
    static mazeGame: any = null;
 


    render() {

        //const rand = new Rand();
        //const cell = new Cell(10, 10);
        //const mazegenerator = new MazeGenerator(10, 10, 1, 1);
        
        

        //$(document).ready(function () {
        let canvasElement = document.getElementById('maze');

        App.mazeGame = new MazeGame(canvasElement, [10, 10] );
        
        /*

        $("form").on('submit', function () {
            let dimensions = [$('#w').val(), $('#h').val()];
            //let dimensions = [1200, 700];
            App.mazeGame = new MazeGame(canvasElement, { dimensions });
            startTick();
            $('#options, #end-game').hide();
            return false;
        });

        $('body').on('keypress', '#h, #options', function (e) {
            return (e.which != 8 && e.which != 0 && (e.which < 48 || e.which > 57)) ? false : true;
        })

        $(window).on('click', function(e){
            if (!$(e.target).is("#options") && $(e.target).parents('#options').length == 0)
            $('#options').hide();
        });

        $('a[href="#options"]').on('click', function(){
            center($('#options').show());
            return false;
        });
        });

        $(window).on('keydown', function (e) {
        let keyCode = e.keyCode || e.which;
        let keyCodes = {
            74: "left",
            73: "up",
            76: "right",
            75: "down"
            };
        */
        if (keyCodes[keyCode] !== null && keyCodes[keyCode] !== undefined) {
            // send IJKL to game
            App.mazeGame.move(keyCodes[keyCode]);
            e.stopImmediatePropagation();
            return false;
        } else if (keyCode === 27) {
            // close options on escape
            return false;
        }
        });


        function center(e) {
        //!!!e.css('top', $("#maze").offset().top + $("#maze").height() / 2 - e.outerHeight() / 2)
        }

        function startTick() {
        if (App.timer) {
            clearInterval(App.timer);
        }
        App.timer = setInterval(tick, 100);
        }

        function tick() {
        App.mazeGame.ui.drawTimer();
        }

        function pass_function(){
        alert('42');
        }
        

        return (
            <>
            <div className="grid-container">
                <canvas id="maze">Sorry your browser doesn't support the canvas element. Try upgrading your browser.</canvas>
                <div id="messageArea"></div>
                <div className="a">
                    <div id="time"></div>
                    <div id="steps"></div>
                    <h1><span> <a href="#options"></a></span></h1>
                </div>

                <div className="options">
                    <form>
                    <label htmlFor="w">Width</label>
                    <label htmlFor="h">Height</label>
                    <input id="w" type="number" min="2" step="1" defaultValue="7" />
                    by
                    <input id="h" type="number" min="2" step="1" defaultValue="7" />
                    <button type="submit">Generate New Maze</button>
                    </form>
                </div>
            </div>
            </>
        );
    }

    componentDidMount() {
        
    }
  
    componentWillUnmount() {

    }


}

export default App;