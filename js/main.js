'use strict';

function draw_logic(){
    // Draw shapes.
    core_group_modify({
      'groups': [
        'canvas',
      ],
      'todo': function(entity){
          canvas_setproperties({
            'properties': {
              'fillStyle': core_entities[entity]['color'],
            },
          });
          canvas_buffer.fillRect(
            core_entities[entity]['x'],
            core_entities[entity]['y'],
            core_entities[entity]['width'],
            core_entities[entity]['height']
          );
      },
    });
}

function logic(){
    if(time <= 0){
        core_interval_pause_all();
        return;
    }

    time = time - .025;
    time_display = time.toFixed(1);

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
      'events': {
        'start': {
          'onclick': function(){
              canvas_setmode({
                'newgame': true,
              });
          },
        },
      },
      'globals': {
        'score': 0,
        'time': 0,
        'time_display': .1,
      },
      'info': '<input id=start type=button value="Start New Game">',
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

              let dscore = 0;

              core_group_modify({
                'groups': [
                  'canvas',
                ],
                'todo': function(entity){
                    if(core_mouse['x'] <= core_entities[entity]['x']
                      || core_mouse['x'] >= core_entities[entity]['x'] + core_entities[entity]['width']
                      || core_mouse['y'] <= core_entities[entity]['y']
                      || core_mouse['y'] >= core_entities[entity]['y'] + core_entities[entity]['height']){
                        return;
                    }

                    if(dscore <= 0){
                        dscore = core_entities[entity]['score'];
                    }
                },
              });

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
        'negative': 10,
        'positive': 1,
        'time-limit': 30,
      },
      'storage-menu': '<table><tr><td><input id=negative><td># of Negative<tr><td><input id=time-limit><td>Time Limit<tr><td><input id=positive><td># of Positive</table>',
      'title': 'SpeedShape.htm',
      'ui': 'Score: <span id=ui-score></span><br>Time: <span id=ui-time></span>',
    });
    canvas_init();
}
