'use strict';

function draw_logic(){
    // Draw shapes.
    for(var entity in core_entities){
        canvas_buffer.fillStyle = core_entities[entity]['color'];
        canvas_buffer.fillRect(
          core_entities[entity]['x'],
          core_entities[entity]['y'],
          core_entities[entity]['width'],
          core_entities[entity]['height']
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
    core_entity_remove_all();

    if(core_storage_data['negative'] > 0){
        var loop_counter = core_storage_data['negative'] - 1;
        do{
            core_entity_create({
              'properties': {
                'color': core_storage_data['color-negative'],
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
              },
            });
        }while(loop_counter--);
    }
    if(core_storage_data['positive'] > 0){
        var loop_counter = core_storage_data['positive'] - 1;
        do{
            core_entity_create({
              'properties': {
                'color': core_storage_data['color-positive'],
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
              },
            });
        }while(loop_counter--);
    }

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

              var dscore = 0;

              for(var entity in core_entities){
                  if(core_mouse['x'] <= core_entities[entity]['x']
                    || core_mouse['x'] >= core_entities[entity]['x'] + core_entities[entity]['width']
                    || core_mouse['y'] <= core_entities[entity]['y']
                    || core_mouse['y'] >= core_entities[entity]['y'] + core_entities[entity]['height']){
                      continue;
                  }

                  if(dscore <= 0){
                      dscore = core_entities[entity]['score'];

                  }else{
                      break;
                  }
              }

              if(dscore !== 0){
                  score += dscore;

                  core_audio_start({
                    'id': 'boop',
                  });

                  randomize_shapes();
              }
          },
        },
      },
      'storage': {
        'ms-per-frame': 100,
        'negative': 10,
        'positive': 1,
        'time-limit': 30,
      },
      'storage-menu': '<table><tr><td><input id=ms-per-frame><td>ms/Frame<tr><td><input id=negative><td># of Negative<tr><td><input id=time-limit><td>Time Limit<tr><td><input id=positive><td># of Positive</table>',
      'title': 'SpeedShape.htm',
      'ui': '<input id=ui-score>Score<br><input id=ui-time>Time',
    });
    canvas_init();
}

var score = 0;
var time = 0;
var time_display = '';
