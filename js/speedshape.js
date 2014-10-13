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
    if(settings[0] > 0){// Audio Volume
        document.getElementById(id).currentTime = 0;
        document.getElementById(id).play();
    }
}

function randomize_shapes(){
    if(settings[1] > 0){// Number of Reds
        reds.length = 0;
        var loop_counter = settings[1] - 1;
        do{
            reds.push([
              Math.floor(Math.random() * width) - 21,
              Math.floor(Math.random() * height) - 21,
              Math.floor(Math.random() * 200) + 42,
              Math.floor(Math.random() * 200) + 42
            ]);
        }while(loop_counter--);
    }

    white = [
      Math.floor(Math.random() * width) - 9,
      Math.floor(Math.random() * height) - 9,
      Math.floor(Math.random() * 99) + 20,
      Math.floor(Math.random() * 99) + 20
    ];

    if(time <= 0){
        draw();
    }
}

function reset(){
    if(confirm('Reset settings?')){
        document.getElementById('audio-volume').value = 1;
        document.getElementById('reds').value = 10;
        document.getElementById('restart-key').value = 'H';
        document.getElementById('time-limit').value = 30;
        save();
    }
}

function resize(){
    if(mode > 0){
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

    var loop_counter = 2;
    do{
        j = [
          'audio-volume',
          'reds',
          'time-limit'
        ][loop_counter];
        if(isNaN(document.getElementById(j).value)
          || document.getElementById(j).value === [1, 10, 30][loop_counter]
          || document.getElementById(j).value < [0, 0, 1][loop_counter]){
            window.localStorage.removeItem('speedshape-' + loop_counter);
            settings[loop_counter] = [
              1,
              10,
              30
            ][loop_counter];
            document.getElementById(j).value = settings[loop_counter];

        }else{
            settings[loop_counter] = parseFloat(document.getElementById(j).value);
            window.localStorage.setItem(
              'speedshape-' + loop_counter,
              settings[loop_counter]
            );
        }
    }while(loop_counter--);
}

function setmode(newmode, newgame){
    clearInterval(interval);
    mode = newmode;

    reds.length = 0;

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

        interval = setInterval(
          'decisecond()',
          100
        );

    // main menu mode
    }else{
        buffer = 0;
        canvas = 0;

        document.getElementById('page').innerHTML = '<div style=display:inline-block;text-align:left;vertical-align:top><div class=c><b>Speedshape.htm</b></div><hr><div class=c><ul><li><a onclick="setmode(1, 1)">Start New Game</a></ul></div></div><div style="border-left:8px solid #222;display:inline-block;text-align:left"><div class=c><input disabled style=border:0 value=ESC>Main Menu<br><input id=restart-key maxlength=1 value='
          + settings[3] + '>Restart</div><hr><div class=c><input id=audio-volume max=1 min=0 step=.01 type=range value='
          + settings[0] + '>Audio<br><input id=reds value='
          + settings[1] + '>Red<br><input id=time-limit value='
          + settings[2] + '>Time Limit<br><a onclick=reset()>Reset Settings</a></div></div>';
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
    ? 'H'
    : window.localStorage.getItem('speedshape-3'),// Reset Key
];
var time = 0;
var white = [];
var width = 0;

setmode(0,0);

window.onkeydown = function(e){
    if(mode>0){
        var key = window.event ? event : e;
        key = key.charCode ? key.charCode : key.keyCode;

        if(String.fromCharCode(key) === settings[3]){// Reset Key?
            setmode(1, 0);

        }else if(key === 27){// ESC
            setmode(0, 0);
        }
    }
};

window.onmousedown = function(e){
    if(mode > 0
      && time > 0){
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
    }
};

window.onresize = resize;
