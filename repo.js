'use strict';

function create_shape(type, loop_counter){
    const max = core_storage_data[type + '-size-max'];
    const bonus = core_storage_data[type + '-size-bonus'];
    entity_create({
      'id': type + '-' + loop_counter,
      'properties': {
        'color': type === 'positive'
          ? '#663366'
          : '#206620',
        'height': core_random_integer({'max': max,}) + bonus,
        'width': core_random_integer({'max': max,}) + bonus,
        'x': core_random_integer({'max': canvas_properties['width'] - 60,}) - bonus / 2 + 30,
        'y': core_random_integer({'max': canvas_properties['height'] - 60,}) - bonus / 2 + 30,
      },
    });
}

function load_data(id){
    randomize_shapes();
    score = 0;
    time = core_storage_data['time-limit'];
}

function randomize_shapes(){
    entity_remove_all();

    for(let i = 0; i < core_storage_data['negative-count']; i++){
        create_shape('negative', i);
    }
    for(let i = 0; i < core_storage_data['positive-count']; i++){
        create_shape('positive', i);
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
      'pointerbinds': {
        'pointerdown': {
          'preventDefault': true,
          'todo': function(){
              if(time <= 0){
                  return;
              }

              const pixel = canvas.getImageData(
                core_pointer['x'], core_pointer['y'],
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
      'ui': 'Score: <span id=score></span> | Time: <span id=time></span>',
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
