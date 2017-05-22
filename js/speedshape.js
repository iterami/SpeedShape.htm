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
      'Time: ' + time_display + '/' + core_storage_data['time-limit'],
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
    time = time - .025;
    time_display = time.toFixed(1);

    if(time <= 0){
        window.clearInterval(canvas_interval);
    }
}

function randomize_shapes(){
    shapes.length = 0;

    if(core_storage_data['red'] > 0){
        var loop_counter = core_storage_data['red'] - 1;
        do{
            shapes.push({
              'color': '#f00',
              'height': core_random_integer({
                'max': 200,
              }) + 42,
              'score': -1,
              'width': core_random_integer({
                'max': 200,
              }) + 42,
              'x': core_random_integer({
                'max': canvas_width,
              }) - 21,
              'y': core_random_integer({
                'max': canvas_height,
              }) - 21,
            });
        }while(loop_counter--);
    }
    if(core_storage_data['white'] > 0){
        var loop_counter = core_storage_data['white'] - 1;
        do{
            shapes.push({
              'color': '#fff',
              'height': core_random_integer({
                'max': 99,
              }) + 20,
              'score': 1,
              'width': core_random_integer({
                'max': 99,
              }) + 20,
              'x': core_random_integer({
                'max': canvas_width,
              }) - 9,
              'y': core_random_integer({
                'max': canvas_height,
              }) - 9,
            });
        }while(loop_counter--);
    }

    shapes_length = shapes.length;

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
    shapes_length = 0;

    // Main menu mode.
    if(canvas_mode === 0){
        document.body.innerHTML = '<div><div><a onclick=canvas_setmode({mode:1,newgame:true})>Start New Game</a></div></div>'
          + '<div class=right><div><input disabled value=ESC>Main Menu<br>'
          + '<input id=restart-key maxlength=1>Restart</div><hr>'
          + '<div><input id=audio-volume max=1 min=0 step=0.01 type=range>Audio<br>'
          + '<input id=ms-per-frame>ms/Frame<br>'
          + '<input id=red>Red<br>'
          + '<input id=time-limit>Time Limit<br>'
          + '<input id=white>White<br>'
          + '<a onclick=core_storage_reset()>Reset Settings</a></div></div>';
        core_storage_update();

    // New game mode.
    }else{
        if(newgame){
            core_storage_save();

        }else{
            randomize_shapes();
        }

        score = 0;
        time = core_storage_data['time-limit'];
    }
}

var mouse_x = 0;
var mouse_y = 0;
var score = 0;
var shapes = [];
var shapes_length = 0;
var time = 0;
var time_display = '';

window.onload = function(){
    core_storage_init({
      'data': {
        'audio-volume': 1,
        'ms-per-frame': 100,
        'red': 10,
        'restart-key': 'H',
        'time-limit': 30,
        'white': 1,
      },
      'prefix': 'SpeedShape.htm-',
    });
    audio_init();
    audio_create({
      'id': 'boop',
      'properties': {
        'duration': .1,
        'volume': .1,
      },
    });
    canvas_init();

    window.onkeydown = function(e){
        if(canvas_mode <= 0){
            return;
        }

        var key = e.keyCode || e.which;

        // core_storage_data['restart-key']: restart the current game.
        if(String.fromCharCode(key) === core_storage_data['restart-key']){
            canvas_setmode({
              'mode': 1,
            });

        // ESC: return to main menu.
        }else if(key === 27){
            canvas_setmode();
        }
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
            shape = shapes_length - shape - 1;

            if(mouse_x <= shapes[shape]['x']
              || mouse_x >= shapes[shape]['x'] + shapes[shape]['width']
              || mouse_y <= shapes[shape]['y']
              || mouse_y >= shapes[shape]['y'] + shapes[shape]['height']){
                continue;
            }

            audio_start({
              'id': 'boop',
              'volume-multiplier': core_storage_data['audio-volume'],
            });

            score += shapes[shape]['score'];
            randomize_shapes();
            break;
        }
    };
};
