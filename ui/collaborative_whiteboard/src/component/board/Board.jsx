import React from 'react';
import './style.css';
import io from 'socket.io-client';
import { func } from 'prop-types';


class Board extends React.Component{

    timeout;
    socket = io.connect('http://localhost:5000');

    constructor(props){
        super(props);

        // receive the data from the server
        this.socket.on('canvas-data', function(data){
            var image = new Image();
            var canvas = document.querySelector('#board');
            var ctx = canvas.getContext('2d');

            // new image will draw on the canvas
            image.onload = function(){
                ctx.drawImage(image, 0, 0);
            };

            image.src = data;
        })

    }

    //just worked as window.onload() 
    componentDidMount(){
        this.drawOnCanvas();
    }

    //func to draw on the canvas
    drawOnCanvas(){
        var canvas = document.querySelector('#board');
        var ctx = canvas.getContext('2d');
    
        var sketch = document.querySelector('#sketch');
        var sketch_style = getComputedStyle(sketch);
        canvas.width = parseInt(sketch_style.getPropertyValue('width'));
        canvas.height = parseInt(sketch_style.getPropertyValue('height'));
    
        var mouse = {x: 0, y: 0};
        var last_mouse = {x: 0, y: 0};
    
        /* Mouse Capturing Work */
        canvas.addEventListener('mousemove', function(e) {
            last_mouse.x = mouse.x;
            last_mouse.y = mouse.y;
    
            mouse.x = e.pageX - this.offsetLeft;
            mouse.y = e.pageY - this.offsetTop;
        }, false);
    
    
        /* Drawing on Paint App */
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.strokeStyle = 'blue';
    
        canvas.addEventListener('mousedown', function(e) {
            canvas.addEventListener('mousemove', onPaint, false);
        }, false);
    
        canvas.addEventListener('mouseup', function() {
            canvas.removeEventListener('mousemove', onPaint, false);
        }, false);

        
        var root = this; 
    
        var onPaint = function() {
            ctx.beginPath();
            ctx.moveTo(last_mouse.x, last_mouse.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.closePath();
            ctx.stroke();

            
            // used to ensure the single time function call
            if (root.timeout != undefined) clearTimeout(root.timeout);
            
            // used to send data to server after timeout
            root.timeout = setTimeout(function(){
                var dataURL = canvas.toDataURL();
                console.log(dataURL);
                var base64ImageData = dataURL;
                
                // emit the encoded-image to the server
                root.socket.emit('canvas-data', base64ImageData);
            }, 10)    
        };
    }

    render(){
        return(
           // <h1>Hello!</h1>
          <div className="sketch" id="sketch"> 
            <canvas className="board" id="board"></canvas>
          </div>
        )
    }


}

export default Board