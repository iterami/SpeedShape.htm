function decisecond(){
    time = (time - .1).toFixed(1);

    if(time <= 0){
        clearInterval(interval);
    }

    draw();
}

function draw(){
    if(settings[4]){// Clear?
        buffer.clearRect(
          0,
          0,
          width,
          height
        );
    }

    i = reds.length - 1;
    if(i >= 0){
        buffer.fillStyle = '#f00';
        do{
            buffer.fillRect(
              reds[i][0],
              reds[i][1],
              reds[i][2],
              reds[i][3]
            );
        }while(i--);
    }

    buffer.fillStyle = '#fff';
    buffer.fillRect(
      white[0],
      white[1],
      white[2],
      white[3]
    );

    buffer.font = '23pt sans-serif';
    buffer.fillText(
      'Time: ' + time + '/' + settings[2],
      5,
      25
    );
    buffer.fillText(
      'Score: ' + score,
      5,
      55
    );

    if(settings[4]){// Clear?
        canvas.clearRect(
          0,
          0,
          width,
          height
        );
    }
    canvas.drawImage(
      document.getElementById('buffer'),
      0,
      0
    );
}

function play_audio(i){
    if(settings[0] > 0){// Audio Volume
        document.getElementById(i).currentTime = 0;
        document.getElementById(i).play();
    }
}

function randomize_shapes(){
    if(settings[1] > 0){// Number of Reds
        reds.length = 0;
        i = settings[1] - 1;
        do{
            reds.push([
              random_number(width) - 21,
              random_number(height) - 21,
              random_number(200) + 42,
              random_number(200) + 42
            ]);
        }while(i--);
    }

    white = [
      random_number(width) - 9,
      random_number(height) - 9,
      random_number(99) + 20,
      random_number(99) + 20
    ];

    if(time <= 0){
        draw();
    }
}

function random_number(i){
    return Math.floor(Math.random() * i);
}

function reset(){
    if(confirm('Reset settings?')){
        document.getElementById('audio-volume').value = 1;
        document.getElementById('clear').checked = 1;
        document.getElementById('reds').value = 10;
        document.getElementById('restart-key').value = 'H';
        document.getElementById('time-limit').value = 30;
        save();
    }
}

function resize(){
    if(mode > 0){
        width = window.innerWidth;
        document.getElementById('buffer').width = width;
        document.getElementById('canvas').width = width;

        height = window.innerHeight;
        document.getElementById('buffer').height = height;
        document.getElementById('canvas').height = height;

        if(time > 0){
            randomize_shapes();

        }else{
            draw();
        }
    }
}

function save(){
    if(document.getElementById('restart-key').value === 'H'){
        window.localStorage.removeItem('speedshape-3');
        settings[3] = 'H';// Restart Key?

    }else{
        settings[3] = document.getElementById('restart-key').value;
        window.localStorage.setItem(
          'speedshape-3',
          settings[3]
        );
    }

    i = 2;
    do{
        j = [
          'audio-volume',
          'reds',
          'time-limit'
        ][i];
        if(isNaN(document.getElementById(j).value)
          || document.getElementById(j).value === [1, 10, 30][i]
          || document.getElementById(j).value < [0, 0, 1][i]){
            window.localStorage.removeItem('speedshape-' + i);
            settings[i] = [
              1,
              10,
              30
            ][i];
            document.getElementById(j).value = settings[i];

        }else{
            settings[i] = parseFloat(document.getElementById(j).value);
            window.localStorage.setItem(
              'speedshape-' + i,
              settings[i]
            );
        }
    }while(i--);

    settings[4] = document.getElementById('clear').checked;// Clear?
    if(settings[4]){
        window.localStorage.removeItem('speedshape-4');

    }else{
        window.localStorage.setItem(
          'speedshape-4',
          0
        );
    }
}

function setmode(newmode, newgame){
    clearInterval(interval);
    mode = newmode;

    // new game mode
    if(mode > 0){
        if(newgame){
            save();
        }

        score = 0;
        time = settings[2];

        if(newgame){
            document.getElementById('page').innerHTML = '<canvas id=canvas oncontextmenu="return false"></canvas>';
            buffer = document.getElementById('buffer').getContext('2d');
            canvas = document.getElementById('canvas').getContext('2d');
            resize();

        }else{
            randomize_shapes();
        }

        interval = setInterval('decisecond()', 100);

    // main menu mode
    }else{
        buffer = 0;
        canvas = 0;

        document.getElementById('page').innerHTML = '<div style=display:inline-block;text-align:left;vertical-align:top><div class=c><b>Speedshape</b></div><hr><div class=c><ul><li><a onclick="setmode(1, 1)">Start New Game</a></ul></div></div><div style="border-left:8px solid #222;display:inline-block;text-align:left"><div class=c><input disabled style=border:0 value=ESC>Main Menu<br><input id=restart-key maxlength=1 value='
          + settings[3] + '>Restart</div><hr><div class=c><input id=audio-volume max=1 min=0 step=.01 type=range value='
          + settings[0] + '>Audio<br><label><input '
          + (settings[4] ? 'checked ' : '') + 'id=clear type=checkbox>Clear</label><br><input id=reds value='
          + settings[1] + '>Red<br><input id=time-limit value='
          + settings[2] + '>Time Limit<br><a onclick=reset()>Reset Settings</a></div></div>';
    }
}

var buffer = 0;
var canvas = 0;
var height = 0;
var i = 0;
var interval = 0;
var j = 0;
var mode = 0;
var mouse_x = 0;
var mouse_y = 0;
var reds = [];
var score = 0;
var settings = [
  window.localStorage.getItem('speedshape-0') === null
    ? 1
    : parseFloat(window.localStorage.getItem('speedshape-0')),// Audio Volume
  window.localStorage.getItem('speedshape-1') === null
    ? 10
    : parseInt(window.localStorage.getItem('speedshape-1')),// Number of Reds
  window.localStorage.getItem('speedshape-2') === null
    ? 30
    : parseInt(window.localStorage.getItem('speedshape-2')),// Time Limit
  window.localStorage.getItem('speedshape-3') === null
    ?
    'H'
    : window.localStorage.getItem('speedshape-3'),// Reset Key
  window.localStorage.getItem('speedshape-4') === null// Clear?
];
var time = 0;
var white = [];
var width = 0;

setmode(0,0);

window.onkeydown = function(e){
    if(mode>0){
        i = window.event ? event : e;
        i = i.charCode ? i.charCode : i.keyCode;

        if(String.fromCharCode(i) === settings[3]){// Reset Key?
            setmode(1, 0);

        }else if(i === 27){// ESC
            setmode(0, 0);
        }
    }
};

window.onmousedown = function(e){
    if(mode > 0 && time > 0){
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
            i = reds.length-1;
            if(i >= 0){
                do{
                    if(mouse_x > reds[i][0]
                      && mouse_x < reds[i][0] + reds[i][2]
                      && mouse_y > reds[i][1]
                      && mouse_y < reds[i][1] + reds[i][3]){
                        score -= 1;
                        randomize_shapes();
                        break;
                    }
                }while(i--);
            }
        }
    }
};

window.onresize = resize;
