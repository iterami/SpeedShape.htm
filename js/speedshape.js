'use strict';

function draw(){
    buffer.clearRect(
      0,
      0,
      width,
      height
    );

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
    buffer.font = '23pt sans-serif';
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

    canvas.clearRect(
      0,
      0,
      width,
      height
    );
    canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );

    animationFrame = window.requestAnimationFrame(draw);
}

function logic(){
    time = (time - .1).toFixed(1);

    if(time <= 0){
        window.clearInterval(interval);
    }
}

function play_audio(id){
    if(settings['audio-volume'] <= 0){
        return;
    }

    document.getElementById(id).currentTime = 0;
    document.getElementById(id).play();
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

function reset(){
    if(!window.confirm('Reset settings?')){
        return;
    }

    document.getElementById('audio-volume').value = 1;
    document.getElementById('reds').value = 10;
    document.getElementById('restart-key').value = 'H';
    document.getElementById('time-limit').value = 30;
    document.getElementById('whites').value = 1;

    save();
}

function resize(){
    if(mode <= 0){
        return;
    }

    height = window.innerHeight;
    document.getElementById('buffer').height = height;
    document.getElementById('canvas').height = height;

    width = window.innerWidth;
    document.getElementById('buffer').width = width;
    document.getElementById('canvas').width = width;

    if(time > 0){
        randomize_shapes();

    }else{
        draw();
    }
}

// Save settings into window.localStorage if they differ from default.
function save(){
    if(document.getElementById('audio-volume').value == 1){
        window.localStorage.removeItem('SpeedShape.htm-audio-volume');
        settings['audio-volume'] = 1;

    }else{
        settings['audio-volume'] = parseFloat(document.getElementById('audio-volume').value);
        window.localStorage.setItem(
          'SpeedShape.htm-audio-volume',
          settings['audio-volume']
        );
    }

    var ids = {
      'reds': 10,
      'time-limit': 30,
      'whites': 1,
    };
    for(var id in ids){
        if(document.getElementById(id).value == ids[id]
          || isNaN(document.getElementById(id).value)){
            window.localStorage.removeItem('SpeedShape.htm-' + id);
            settings[id] = ids[id];

        }else{
            settings[id] = parseFloat(document.getElementById(id).value);
            window.localStorage.setItem(
              'SpeedShape.htm-' + id,
              settings[id]
            );
        }
    }

    if(document.getElementById('restart-key').value === 'H'){
        window.localStorage.removeItem('SpeedShape.htm-restart-key');
        settings['restart-key'] = 'H';

    }else{
        settings['restart-key'] = document.getElementById('restart-key').value;
        window.localStorage.setItem(
          'SpeedShape.htm-restart-key',
          settings['restart-key']
        );
    }
}

function setmode(newmode, newgame){
    window.cancelAnimationFrame(animationFrame);
    window.clearInterval(interval);

    shapes.length = 0;

    mode = newmode;

    // New game mode.
    if(mode > 0){
        if(newgame){
            save();
        }

        score = 0;
        time = settings['time-limit'];

        if(newgame){
            document.getElementById('page').innerHTML =
              '<canvas id=canvas oncontextmenu="return false"></canvas><canvas id=buffer></canvas>';

            var contextAttributes = {
              'alpha': false,
            };
            buffer = document.getElementById('buffer').getContext(
              '2d',
              contextAttributes
            );
            canvas = document.getElementById('canvas').getContext(
              '2d',
              contextAttributes
            );

            resize();

        }else{
            randomize_shapes();
        }

        animationFrame = window.requestAnimationFrame(draw);
        interval = window.setInterval(
          'logic()',
          100
        );

        return;
    }

    // Main menu mode.
    buffer = 0;
    canvas = 0;

    document.getElementById('page').innerHTML = '<div style=display:inline-block;text-align:left;vertical-align:top><div><a onclick="setmode(1, true)">Start New Game</a></div></div><div style="border-left:8px solid #222;display:inline-block;text-align:left"><div><input disabled value=ESC>Main Menu<br><input id=restart-key maxlength=1 value='
      + settings['restart-key'] + '>Restart</div><hr><div><input id=audio-volume max=1 min=0 step=.01 type=range value='
      + settings['audio-volume'] + '>Audio<br><input id=reds value='
      + settings['reds'] + '>Red<br><input id=time-limit value='
      + settings['time-limit'] + '>Time Limit<br><input id=whites value='
      + settings['whites'] + '>Whites<br><a onclick=reset()>Reset Settings</a></div></div>';
}

var animationFrame = 0;
var buffer = 0;
var canvas = 0;
var height = 0;
var interval = 0;
var mode = 0;
var mouse_x = 0;
var mouse_y = 0;
var score = 0;
var settings = {
  'audio-volume': window.localStorage.getItem('SpeedShape.htm-audio-volume') != null
    ? parseFloat(window.localStorage.getItem('SpeedShape.htm-audio-volume'))
    : 1,
  'reds': window.localStorage.getItem('SpeedShape.htm-reds') != null
    ? parseInt(window.localStorage.getItem('SpeedShape.htm-reds'))
    : 10,
  'restart-key': window.localStorage.getItem('SpeedShape.htm-restart-key') || 'H',
  'time-limit': parseInt(window.localStorage.getItem('SpeedShape.htm-time-limit')) || 30,
  'whites': window.localStorage.getItem('SpeedShape.htm-whites') != null
    ? parseInt(window.localStorage.getItem('SpeedShape.htm-whites'))
    : 1,
};
var shapes = [];
var time = 0;
var width = 0;

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

window.onload = function(e){
    setmode(
      0,
      false
    );
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

window.onresize = resize;
