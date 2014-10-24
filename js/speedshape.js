function decisecond(){
    time = (time - .1).toFixed(1);

    if(time <= 0){
        clearInterval(interval);
    }

    draw();
}

function draw(){
    buffer.clearRect(
      0,
      0,
      width,
      height
    );

    // Draw red shapes.
    var loop_counter = reds.length - 1;
    if(loop_counter >= 0){
        buffer.fillStyle = '#f00';
        do{
            buffer.fillRect(
              reds[loop_counter][0],
              reds[loop_counter][1],
              reds[loop_counter][2],
              reds[loop_counter][3]
            );
        }while(loop_counter--);
    }

    // Draw white shape.
    buffer.fillStyle = '#fff';
    buffer.fillRect(
      white[0],
      white[1],
      white[2],
      white[3]
    );

    // Draw time remaining.
    buffer.font = '23pt sans-serif';
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
}

function play_audio(id){
    if(settings['audio-volume'] > 0){
        document.getElementById(id).currentTime = 0;
        document.getElementById(id).play();
    }
}

function randomize_shapes(){
    if(settings['reds'] > 0){
        reds.length = 0;
        var loop_counter = settings['reds'] - 1;
        do{
            reds.push([
              Math.floor(Math.random() * width) - 21,
              Math.floor(Math.random() * height) - 21,
              Math.floor(Math.random() * 200) + 42,
              Math.floor(Math.random() * 200) + 42,
            ]);
        }while(loop_counter--);
    }

    white = [
      Math.floor(Math.random() * width) - 9,
      Math.floor(Math.random() * height) - 9,
      Math.floor(Math.random() * 99) + 20,
      Math.floor(Math.random() * 99) + 20,
    ];

    if(time <= 0){
        draw();
    }
}

function reset(){
    if(!confirm('Reset settings?')){
        return;
    }

    document.getElementById('audio-volume').value = 1;
    document.getElementById('reds').value = 10;
    document.getElementById('restart-key').value = 'H';
    document.getElementById('time-limit').value = 30;

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

function save(){
    // Save audio-volume setting.
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

    // Save reds setting.
    if(document.getElementById('reds').value == 10
      || isNaN(document.getElementById('reds').value)
      || document.getElementById('reds').value < 0){
        window.localStorage.removeItem('SpeedShape.htm-reds');
        settings['reds'] = 10;

    }else{
        settings['reds'] = parseFloat(document.getElementById('reds').value);
        window.localStorage.setItem(
          'SpeedShape.htm-reds',
          settings['reds']
        );
    }

    // Save restart-key setting.
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

    // Save time-limit setting.
    if(document.getElementById('time-limit').value == 30
      || isNaN(document.getElementById('time-limit').value)
      || document.getElementById('time-limit').value < 1){
        window.localStorage.removeItem('SpeedShape.htm-time-limit');
        settings['time-limit'] = 30;

    }else{
        settings['time-limit'] = parseFloat(document.getElementById('time-limit').value);
        window.localStorage.setItem(
          'SpeedShape.htm-time-limit',
          settings['time-limit']
        );
    }
}

function setmode(newmode, newgame){
    clearInterval(interval);
    mode = newmode;

    reds.length = 0;

    // New game mode.
    if(mode > 0){
        if(newgame){
            save();
        }

        score = 0;
        time = settings['time-limit'];

        if(newgame){
            document.getElementById('page').innerHTML = '<canvas id=canvas oncontextmenu="return false"></canvas>';
            buffer = document.getElementById('buffer').getContext('2d');
            canvas = document.getElementById('canvas').getContext('2d');
            resize();

        }else{
            randomize_shapes();
        }

        interval = setInterval(
          'decisecond()',
          100
        );

    // Main menu mode.
    }else{
        buffer = 0;
        canvas = 0;

        document.getElementById('page').innerHTML = '<div style=display:inline-block;text-align:left;vertical-align:top><div class=c><b>SpeedShape.htm</b></div><hr><div class=c><ul><li><a onclick="setmode(1, 1)">Start New Game</a></ul></div></div><div style="border-left:8px solid #222;display:inline-block;text-align:left"><div class=c><input disabled style=border:0 value=ESC>Main Menu<br><input id=restart-key maxlength=1 value='
          + settings['restart-key'] + '>Restart</div><hr><div class=c><input id=audio-volume max=1 min=0 step=.01 type=range value='
          + settings['audio-volume'] + '>Audio<br><input id=reds value='
          + settings['reds'] + '>Red<br><input id=time-limit value='
          + settings['time-limit'] + '>Time Limit<br><a onclick=reset()>Reset Settings</a></div></div>';
    }
}

var buffer = 0;
var canvas = 0;
var height = 0;
var interval = 0;
var j = 0;
var mode = 0;
var mouse_x = 0;
var mouse_y = 0;
var reds = [];
var score = 0;
var settings = {
  'audio-volume': window.localStorage.getItem('SpeedShape.htm-audio-volume') === null
    ? 1
    : parseFloat(window.localStorage.getItem('SpeedShape.htm-audio-volume')),
  'reds': window.localStorage.getItem('SpeedShape.htm-reds') === null
    ? 10
    : parseInt(window.localStorage.getItem('SpeedShape.htm-reds')),
  'restart-key': window.localStorage.getItem('SpeedShape.htm-restart-key') === null
    ? 'H'
    : window.localStorage.getItem('SpeedShape.htm-restart-key'),
  'time-limit': window.localStorage.getItem('SpeedShape.htm-time-limit') === null
    ? 30
    : parseInt(window.localStorage.getItem('SpeedShape.htm-time-limit')),
};
var time = 0;
var white = [];
var width = 0;

setmode(0,0);

window.onkeydown = function(e){
    if(mode <= 0){
        return;
    }

    var key = window.event ? event : e;
    key = key.charCode ? key.charCode : key.keyCode;

    // settings['restart-key']: restart the current game.
    if(String.fromCharCode(key) === settings['restart-key']){
        setmode(1, 0);

    // ESC: return to main menu.
    }else if(key === 27){
        setmode(0, 0);
    }
};

window.onmousedown = function(e){
    if(mode <= 0
      || time <= 0){
        return;
    }

    e.preventDefault();

    mouse_x = e.pageX;
    mouse_y = e.pageY;

    if(mouse_x > white[0]
      && mouse_x < white[0] + white[2]
      && mouse_y > white[1]
      && mouse_y < white[1] + white[3]){
        score += 1;
        randomize_shapes();

    }else{
        var loop_counter = reds.length-1;
        if(loop_counter >= 0){
            do{
                if(mouse_x > reds[loop_counter][0]
                  && mouse_x < reds[loop_counter][0] + reds[loop_counter][2]
                  && mouse_y > reds[loop_counter][1]
                  && mouse_y < reds[loop_counter][1] + reds[loop_counter][3]){
                    score -= 1;
                    randomize_shapes();
                    break;
                }
            }while(loop_counter--);
        }
    }
};

window.onresize = resize;
