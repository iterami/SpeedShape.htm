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

                  dscore = core_entities[entity]['score'];

                  if(dscore > 0){
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
      'ui': 'Score: <span id=ui-score></span><br>Time: <span id=ui-time></span>',
    });
    canvas_init();
}

var score = 0;
var time = 0;
var time_display = '';
