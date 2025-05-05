'use strict';

function load_data(id){
    randomize_shapes();
    score = 0;
    time = core_storage_data['time-limit'];
}

function randomize_shapes(){
    entity_remove_all();

    if(core_storage_data['negative-count'] > 0){
        let loop_counter = Math.floor(core_storage_data['negative-count']) - 1;
        do{
            entity_create({
              'id': 'negative-' + loop_counter,
              'properties': {
                'color': '#663366',
                'height': core_random_integer({
                  'max': core_storage_data['negative-size-max'],
                }) + core_storage_data['negative-size-bonus'],
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
        let loop_counter = Math.floor(core_storage_data['positive-count']) - 1;
        do{
            entity_create({
              'id': 'positive-' + loop_counter,
              'properties': {
                'color': '#206620',
                'height': core_random_integer({
                  'max': core_storage_data['positive-size-max'],
                }) + core_storage_data['positive-size-bonus'],
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

    canvas_draw();
}

function repo_drawlogic(){
    entity_group_modify({
      'groups': [
        'canvas',
      ],
      'todo': function(entity){
          canvas_setproperties({
            'fillStyle': entity['color'],
          });
          canvas.fillRect(
            entity['x'],
            entity['y'],
            entity['width'],
            entity['height']
          );
      },
    });
}

function repo_escape(){
    if(!entity_entities['negative-0']
      && !entity_entities['positive-0']
      && !core_menu_open){
        start();
    }
}

function repo_init(){
    core_repo_init({
      'events': {
        'start': {
          'onclick': start,
        },
      },
      'globals': {
        'score': 0,
        'time': 0,
      },
      'info': '<button id=start type=button>Start New Game</button>',
      'menu': true,
      'mousebinds': {
        'mousedown': {
          'preventDefault': true,
          'todo': function(){
              if(!core_mouse['down-0']
                || core_mouse['down-2']
                || time <= 0){
                  return;
              }

              const pixel = canvas.getImageData(
                core_mouse['x'], core_mouse['y'],
                1, 1
              ).data[0];
              if(pixel === 0){
                  return;
              }

              score += pixel === 102
                ? core_storage_data['negative-score']
                : core_storage_data['positive-score'];
              audio_start('boop');
              randomize_shapes();
          },
        },
      },
      'storage': {
        'negative-count': 10,
        'negative-score': -1,
        'negative-size-bonus': 42,
        'negative-size-max': 200,
        'positive-count': 1,
        'positive-score': 1,
        'positive-size-bonus': 20,
        'positive-size-max': 99,
        'time-limit': 30,
      },
      'storage-menu': '<table><tr><td><input class=mini id=negative-count min=0 step=1 type=number><td># of Negative'
        + '<tr><td><input class=mini id=negative-score step=any type=number><td>Negative Score'
        + '<tr><td><input class=mini id=negative-size-bonus step=any type=number><td>Negative Size Bonus'
        + '<tr><td><input class=mini id=negative-size-max step=any type=number><td>Negative Size Max'
        + '<tr><td><input class=mini id=positive-count min=0 step=1 type=number><td># of Positive'
        + '<tr><td><input class=mini id=positive-score step=any type=number><td>Positive Score'
        + '<tr><td><input class=mini id=positive-size-bonus step=any type=number><td>Positive Size Bonus'
        + '<tr><td><input class=mini id=positive-size-max step=any type=number><td>Positive Size Max'
        + '<tr><td><input class=mini id=time-limit step=any type=number><td>Time Limit</table>',
      'title': 'SpeedShape.htm',
      'ui': 'Score: <span id=score></span><br>Time: <span id=time></span>',
    });
    canvas_init({
      'cursor': 'pointer',
      'interval': false,
    });

    core_interval_modify({
      'id': 'interval',
      'interval': 100,
      'todo': function(){
          if(time <= 0){
              core_interval_pause_all();
              return;
          }

          time = core_round({
            'decimals': 1,
            'number': time - .1,
          });

          const time_display = core_number_format({
            'decimals-min': 1,
            'number': time,
          });
          core_ui_update({
            'ids': {
              'score': score,
              'time': time_display + '/' + core_storage_data['time-limit'],
            },
          });
      },
    });
}

function start(){
    if(score !== 0
      && !globalThis.confirm('Start new game?')){
        return;
    }
    canvas_setmode();
}
