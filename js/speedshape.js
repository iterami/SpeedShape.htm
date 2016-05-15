'use strict';

function draw_logic(){
    // Draw shapes.
    for(var shape in shapes){
        buffer.fillStyle = shapes[shape]['color'];
        buffer.fillRect(
          shapes[shape]['x'],
          shapes[shape]['y'],
          shapes[shape]['width'],
          shapes[shape]['height']
        );
    }

    // Draw time remaining.
    buffer.fillStyle = '#fff';
    buffer.fillText(
      'Time: ' + time + '/' + settings['time-limit'],
      5,
      25
    );

    // Draw score.
    buffer.fillText(
      'Score: ' + score,
      5,
      55
    );
}

function logic(){
    time = (time - .1).toFixed(1);

    if(time <= 0){
        window.clearInterval(interval);
    }
}

function randomize_shapes(){
    shapes.length = 0;

    if(settings['reds'] > 0){
        var loop_counter = settings['reds'] - 1;
        do{
            shapes.push({
              'color': '#f00',
              'height': Math.floor(Math.random() * 200) + 42,
              'score': -1,
              'width': Math.floor(Math.random() * 200) + 42,
              'x': Math.floor(Math.random() * width) - 21,
              'y': Math.floor(Math.random() * height) - 21,
            });
        }while(loop_counter--);
    }
    if(settings['whites'] > 0){
        var loop_counter = settings['whites'] - 1;
        do{
            shapes.push({
              'color': '#fff',
              'height': Math.floor(Math.random() * 99) + 20,
              'score': 1,
              'width': Math.floor(Math.random() * 99) + 20,
              'x': Math.floor(Math.random() * width) - 9,
              'y': Math.floor(Math.random() * height) - 9,
            });
        }while(loop_counter--);
    }

    if(time <= 0){
        draw();
    }
}

function resize_logic(){
    if(time > 0){
        randomize_shapes();

    }else{
        draw();
    }

    buffer.font = '23pt sans-serif';
}

function setmode_logic(newgame){
    shapes.length = 0;

    // Main menu mode.
    if(mode === 0){
        document.body.innerHTML = '<div><div><a onclick="setmode(1, true)">Start New Game</a></div></div>'
          + '<div class=right><div><input disabled value=ESC>Main Menu<br>'
          + '<input id=restart-key maxlength=1>Restart</div><hr>'
          + '<div><input id=audio-volume max=1 min=0 step=0.01 type=range>Audio<br>'
          + '<input id=ms-per-frame>ms/Frame<br>'
          + '<input id=reds>Red<br>'
          + '<input id=time-limit>Time Limit<br>'
          + '<input id=whites>Whites<br>'
          + '<a onclick=reset()>Reset Settings</a></div></div>';
        update_settings();

    // New game mode.
    }else{
        if(newgame){
            save();

        }else{
            randomize_shapes();
        }

        score = 0;
        time = settings['time-limit'];
    }
}

var mouse_x = 0;
var mouse_y = 0;
var score = 0;
var shapes = [];
var time = 0;

window.onkeydown = function(e){
    if(mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // settings['restart-key']: restart the current game.
    if(String.fromCharCode(key) === settings['restart-key']){
        setmode(
          1,
          false
        );

    // ESC: return to main menu.
    }else if(key === 27){
        setmode(
          0,
          false
        );
    }
};

window.onload = function(){
    init_settings(
      'SpeedShape.htm-',
      {
        'audio-volume': 1,
        'ms-per-frame': 100,
        'reds': 10,
        'restart-key': 'H',
        'time-limit': 30,
        'whites': 1,
      }
    );
    init_canvas();
};

window.onmousedown =
  window.ontouchstart = function(e){
    if(mode <= 0
      || time <= 0){
        return;
    }

    e.preventDefault();

    mouse_x = e.pageX;
    mouse_y = e.pageY;

    for(var shape in shapes){
        if(mouse_x <= shapes[shape]['x']
          || mouse_x >= shapes[shape]['x'] + shapes[shape]['width']
          || mouse_y <= shapes[shape]['y']
          || mouse_y >= shapes[shape]['y'] + shapes[shape]['height']){
            continue;
        }

        score += 1;
        randomize_shapes();
        break;
    }
};
