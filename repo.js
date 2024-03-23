'use strict';

function load_data(id){
    randomize_shapes();
    score = 0;
    time = core_storage_data['time-limit'];
}

function randomize_shapes(){
    entity_remove_all();

    if(core_storage_data['negative-count'] > 0){
        let loop_counter = core_storage_data['negative-count'] - 1;
        do{
            entity_create({
              'id': 'negative-' + loop_counter,
              'properties': {
                'color': '#663366',
                'height': core_random_integer({
                  'max': core_storage_data['negative-size-max'],
                }) + core_storage_data['negative-size-bonus'],
                'score': -1,
                'width': core_random_integer({
                  'max': core_storage_data['negative-size-max'],
                }) + core_storage_data['negative-size-bonus'],
                'x': core_random_integer({
                  'max': canvas_properties['width'],
                }) - core_storage_data['negative-size-bonus'] / 2,
                'y': core_random_integer({
                  'max': canvas_properties['height'],
                }) - core_storage_data['negative-size-bonus'] / 2,
              },
            });
        }while(loop_counter--);
    }
    if(core_storage_data['positive-count'] > 0){
        let loop_counter = core_storage_data['positive-count'] - 1;
        do{
            entity_create({
              'id': 'positive-' + loop_counter,
              'properties': {
                'color': '#206620',
                'height': core_random_integer({
                  'max': core_storage_data['positive-size-max'],
                }) + core_storage_data['positive-size-bonus'],
                'score': 1,
                'width': core_random_integer({
                  'max': core_storage_data['positive-size-max'],
                }) + core_storage_data['positive-size-bonus'],
                'x': core_random_integer({
                  'max': canvas_properties['width'],
                }) - core_storage_data['positive-size-bonus'] / 2,
                'y': core_random_integer({
                  'max': canvas_properties['height'],
                }) - core_storage_data['positive-size-bonus'] / 2,
              },
            });
        }while(loop_counter--);
    }

    if(time <= 0){
        canvas_draw();
    }
}


function repo_drawlogic(){
    entity_group_modify({
      'groups': [
        'canvas',
      ],
      'todo': function(entity){
          canvas_setproperties({
            'fillStyle': entity_entities[entity]['color'],
          });
          canvas.fillRect(
            entity_entities[entity]['x'],
            entity_entities[entity]['y'],
            entity_entities[entity]['width'],
            entity_entities[entity]['height']
          );
      },
    });
}

function repo_logic(){
    if(time <= 0){
        core_interval_pause_all();
        return;
    }

    time = time - .025;
    time_display = core_number_format({
      'decimals-min': 1,
      'number': core_round({
        'decimals': 1,
        'number': time,
      }),
    });

    core_ui_update({
      'ids': {
        'score': score,
        'time': time_display + '/' + core_storage_data['time-limit'],
      },
    });
}

function repo_escape(){
    if(!entity_entities['negative-0']
      && !entity_entities['positive-0']
      && !core_menu_open){
        core_repo_reset();
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'start': {
          'onclick': core_repo_reset,
        },
      },
      'globals': {
        'score': 0,
        'time': 0,
        'time_display': .1,
      },
      'info': '<button id=start type=button>Start New Game</button>',
      'menu': true,
      'mousebinds': {
        'mousedown': {
          'preventDefault': true,
          'todo': function(event){
              if(time <= 0){
                  return;
              }

              let dscore = 0;

              entity_group_modify({
                'groups': [
                  'canvas',
                ],
                'todo': function(entity){
                    if(core_mouse['x'] <= entity_entities[entity]['x']
                      || core_mouse['x'] >= entity_entities[entity]['x'] + entity_entities[entity]['width']
                      || core_mouse['y'] <= entity_entities[entity]['y']
                      || core_mouse['y'] >= entity_entities[entity]['y'] + entity_entities[entity]['height']){
                        return;
                    }

                    if(dscore <= 0){
                        dscore = entity_entities[entity]['score'];
                    }
                },
              });

              if(dscore !== 0){
                  score += dscore;

                  audio_start('boop');

                  randomize_shapes();
              }
          },
        },
      },
      'reset': canvas_setmode,
      'storage': {
        'negative-count': 10,
        'negative-size-bonus': 42,
        'negative-size-max': 200,
        'positive-count': 1,
        'positive-size-bonus': 20,
        'positive-size-max': 99,
        'time-limit': 30,
      },
      'storage-menu': '<table><tr><td><input class=mini id=negative-count min=0 step=any type=number><td># of Negative'
        + '<tr><td><input class=mini id=negative-size-bonus step=any type=number><td>Negative Size Bonus'
        + '<tr><td><input class=mini id=negative-size-max step=any type=number><td>Negative Size Max'
        + '<tr><td><input class=mini id=positive-count min=0 step=any type=number><td># of Positive'
        + '<tr><td><input class=mini id=positive-size-bonus step=any type=number><td>Positive Size Bonus'
        + '<tr><td><input class=mini id=positive-size-max step=any type=number><td>Positive Size Max'
        + '<tr><td><input class=mini id=time-limit step=any type=number><td>Time Limit</table>',
      'title': 'SpeedShape.htm',
      'ui': 'Score: <span id=score></span><br>Time: <span id=time></span>',
    });
    canvas_init({
      'cursor': 'pointer',
    });
}
