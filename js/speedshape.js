'use strict';

function draw_logic(){
    // Draw shapes.
    for(var shape in shapes){
        canvas_buffer.fillStyle = shapes[shape]['color'];
        canvas_buffer.fillRect(
          shapes[shape]['x'],
          shapes[shape]['y'],
          shapes[shape]['width'],
          shapes[shape]['height']
        );
    }

    // Draw time remaining.
    canvas_buffer.fillStyle = '#fff';
    canvas_buffer.fillText(
      'Time: ' + time + '/' + settings_settings['time-limit'],
      5,
      25
    );

    // Draw score.
    canvas_buffer.fillText(
      'Score: ' + score,
      5,
      55
    );
}

function logic(){
    time = (time - .1).toFixed(1);

    if(time <= 0){
        window.clearInterval(canvas_interval);
    }
}

function randomize_shapes(){
    shapes.length = 0;

    if(settings_settings['red'] > 0){
        var loop_counter = settings_settings['red'] - 1;
        do{
            shapes.push({
              'color': '#f00',
              'height': random_integer(200) + 42,
              'score': -1,
              'width': random_integer(200) + 42,
              'x': random_integer(canvas_width) - 21,
              'y': random_integer(canvas_height) - 21,
            });
        }while(loop_counter--);
    }
    if(settings_settings['white'] > 0){
        var loop_counter = settings_settings['white'] - 1;
        do{
            shapes.push({
              'color': '#fff',
              'height': random_integer(99) + 20,
              'score': 1,
              'width': random_integer(99) + 20,
              'x': random_integer(canvas_width) - 9,
              'y': random_integer(canvas_height) - 9,
            });
        }while(loop_counter--);
    }

    if(time <= 0){
        canvas_draw();
    }
}

function resize_logic(){
    if(time > 0){
        randomize_shapes();

    }else{
        canvas_draw();
    }
}

function setmode_logic(newgame){
    shapes.length = 0;

    // Main menu mode.
    if(canvas_mode === 0){
        document.body.innerHTML = '<div><div><a onclick="canvas_setmode(1, true)">Start New Game</a></div></div>'
          + '<div class=right><div><input disabled value=ESC>Main Menu<br>'
          + '<input id=restart-key maxlength=1>Restart</div><hr>'
          + '<div><input id=audio-volume max=1 min=0 step=0.01 type=range>Audio<br>'
          + '<input id=ms-per-frame>ms/Frame<br>'
          + '<input id=red>Red<br>'
          + '<input id=time-limit>Time Limit<br>'
          + '<input id=white>White<br>'
          + '<a onclick=settings_reset()>Reset Settings</a></div></div>';
        settings_update();

    // New game mode.
    }else{
        if(newgame){
            settings_save();

        }else{
            randomize_shapes();
        }

        score = 0;
        time = settings_settings['time-limit'];
    }
}

var mouse_x = 0;
var mouse_y = 0;
var score = 0;
var shapes = [];
var time = 0;

window.onkeydown = function(e){
    if(canvas_mode <= 0){
        return;
    }

    var key = e.keyCode || e.which;

    // settings_settings['restart-key']: restart the current game.
    if(String.fromCharCode(key) === settings_settings['restart-key']){
        canvas_setmode(
          1,
          false
        );

    // ESC: return to main menu.
    }else if(key === 27){
        canvas_setmode(
          0,
          false
        );
    }
};

window.onload = function(){
    settings_init(
      'SpeedShape.htm-',
      {
        'audio-volume': 1,
        'ms-per-frame': 100,
        'red': 10,
        'restart-key': 'H',
        'time-limit': 30,
        'white': 1,
      }
    );
    audio_init();
    audio_create(
      'boop',
      {
        'duration': .1,
        'volume': .1,
      }
    );
    canvas_init();
};

window.onmousedown =
  window.ontouchstart = function(e){
    if(canvas_mode <= 0
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

        audio_start(
          'boop',
          settings_settings['audio-volume']
        );

        score += shapes[shape]['score'];
        randomize_shapes();
        break;
    }
};
