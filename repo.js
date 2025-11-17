'use strict';

function create_shape(type, loop_counter){
    const max = core_storage_data[type + '_size_max'];
    const bonus = core_storage_data[type + '_size_bonus'];
    entity_create({
      'id': type + '_' + loop_counter,
      'properties': {
        'color': type === 'positive'
          ? '#206620'
          : '#663366',
        'height': core_random_integer(max) + bonus,
        'width': core_random_integer(max) + bonus,
        'x': core_random_integer(canvas_properties.width) - bonus / 2,
        'y': core_random_integer(canvas_properties.height - 30) - bonus / 2 + 30,
      },
    });
}

function load_data(id){
    randomize_shapes();
    score = 0;
    time = core_storage_data.time_limit;
}

function randomize_shapes(){
    entity_remove_all();

    for(let i = 0; i < core_storage_data.negative_count; i++){
        create_shape('negative', i);
    }
    for(let i = 0; i < core_storage_data.positive_count; i++){
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
            'fillStyle': entity.color,
          });
          canvas.fillRect(
            entity.x,
            entity.y,
            entity.width,
            entity.height
          );
      },
    });
}

function repo_escape(){
    if(!entity_entities.negative_0
      && !entity_entities.positive_0
      && !core_menu_open){
        start();
    }
}

function repo_init(){
    core_repo_init({
      'beforeunload': {
        'todo': function(event){
            if(score > 0){
                core_escape(true);
                event.preventDefault();
            }
        },
      },
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
                core_pointer.x, core_pointer.y,
                1, 1
              ).data[0];
              if(pixel === 0){
                  return;
              }

              score += pixel === 102
                ? core_storage_data.negative_score
                : core_storage_data.positive_score;
              audio_start('boop');
              randomize_shapes();
          },
        },
      },
      'storage': {
        'negative_count': 10,
        'negative_score': -1,
        'negative_size_bonus': 42,
        'negative_size_max': 200,
        'positive_count': 1,
        'positive_score': 1,
        'positive_size_bonus': 20,
        'positive_size_max': 99,
        'time_limit': 30,
      },
      'storage_menu': '<table><tr><td><input class=mini id=negative_count min=0 step=1 type=number><td># of Negative'
        + '<tr><td><input class=mini id=negative_score step=any type=number><td>Negative Score'
        + '<tr><td><input class=mini id=negative_size_bonus step=any type=number><td>Negative Size Bonus'
        + '<tr><td><input class=mini id=negative_size_max step=any type=number><td>Negative Size Max'
        + '<tr><td><input class=mini id=positive_count min=0 step=1 type=number><td># of Positive'
        + '<tr><td><input class=mini id=positive_score step=any type=number><td>Positive Score'
        + '<tr><td><input class=mini id=positive_size_bonus step=any type=number><td>Positive Size Bonus'
        + '<tr><td><input class=mini id=positive_size_max step=any type=number><td>Positive Size Max'
        + '<tr><td><input class=mini id=time_limit step=any type=number><td>Time Limit</table>',
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
            'decimals_min': 1,
            'number': time,
          });
          core_ui_update({
            'ids': {
              'score': score,
              'time': time_display + '/' + core_storage_data.time_limit,
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
