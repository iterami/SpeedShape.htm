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
}

function logic(){
    time = time - .025;
    time_display = time.toFixed(1);

    if(time <= 0){
        window.clearInterval(canvas_interval);
    }

    core_ui_update({
      'ids': {
        'score': score,
        'time': time_display + '/' + core_storage_data['time-limit'],
      },
    });
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

function repo_init(){
    core_repo_init({
      'audios': {
        'boop': {
          'duration': .1,
        },
      },
      'info': '<input onclick=canvas_setmode({newgame:true}) type=button value="Start New Game">',
      'keybinds': {
        72: {
          'todo': canvas_setmode,
        },
      },
      'menu': true,
      'mousebinds': {
        'mousedown': {
          'preventDefault': true,
          'todo': function(event){
              if(time <= 0){
                  return;
              }

              for(var shape in shapes){
                  shape = shapes_length - shape - 1;

                  if(core_mouse['x'] <= shapes[shape]['x']
                    || core_mouse['x'] >= shapes[shape]['x'] + shapes[shape]['width']
                    || core_mouse['y'] <= shapes[shape]['y']
                    || core_mouse['y'] >= shapes[shape]['y'] + shapes[shape]['height']){
                      continue;
                  }

                  core_audio_start({
                    'id': 'boop',
                  });

                  score += shapes[shape]['score'];
                  randomize_shapes();
                  break;
              }
          },
        },
      },
      'storage': {
        'ms-per-frame': 100,
        'red': 10,
        'time-limit': 30,
        'white': 1,
      },
      'storage-menu': '<table><tr><td><input id=ms-per-frame><td>ms/Frame<tr><td><input id=red><td>Red<tr><td><input id=time-limit><td>Time Limit<tr><td><input id=white><td>White</table>',
      'title': 'SpeedShape.htm',
      'ui': '<input id=ui-score>Score<br><input id=ui-time>Time',
    });
    canvas_init();
}

function resize_logic(){
    if(time > 0){
        randomize_shapes();

    }else{
        canvas_draw();
    }
}

var score = 0;
var shapes = [];
var shapes_length = 0;
var time = 0;
var time_display = '';
