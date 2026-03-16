'use strict';

function create_shape(type, id){
    const max = core_storage_data[type + '_size_max'];
    const bonus = core_storage_data[type + '_size_bonus'];
    entity_create({
      'id': type + '_' + id,
      'properties': {
        'color': core_storage_data[type + '_color'],
        'height': core_random_integer(max) + bonus,
        'width': core_random_integer(max) + bonus,
        'x': core_random_integer(canvas_properties.width) - bonus / 2,
        'y': core_random_integer(canvas_properties.height - 30) - bonus / 2 + 30,
      },
    });
}

function decisecond(){
    if(time > 0){
        time = core_round({
          'decimals': 1,
          'number': time - .1,
        });

        core_ui_update({
          'ids': {
            'time': core_number_format({
              'decimals_min': 1,
              'number': time,
            }),
          },
        });
    }

    if(time <= 0){
        core_interval_lock('interval');
    }
}

function draw_shape(entity){
    canvas_setproperties({
      'fillStyle': entity.color,
    });
    canvas.fillRect(
      entity.x,
      entity.y,
      entity.width,
      entity.height
    );
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
      'todo': draw_shape,
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
            if(score !== 0){
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
      'info': '<button class=medium id=start type=button>Start New Game</button>',
      'menu': true,
      'pointerbinds': {
        'pointerdown': {
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
              core_ui_update({
                'ids': {
                  'score': score,
                },
              });
              audio_start('boop');
              randomize_shapes();
          },
        },
      },
      'storage': {
        'negative_color': '#663366',
        'negative_count': 10,
        'negative_score': -1,
        'negative_size_bonus': 42,
        'negative_size_max': 200,
        'positive_color': '#206620',
        'positive_count': 1,
        'positive_score': 1,
        'positive_size_bonus': 20,
        'positive_size_max': 99,
        'time_limit': 30,
      },
      'storage_menu': '<table><tr><td><input class=mini id=time_limit step=any type=number><td>Time Limit'
        + '<tr><td><input id=positive_color type=color><td>Positive Color'
        + '<tr><td><input class=mini id=positive_count min=0 step=1 type=number><td># of Positive'
        + '<tr><td><input class=mini id=positive_score step=any type=number><td>Positive Score'
        + '<tr><td><input class=mini id=positive_size_max min=0 step=any type=number><td>Positive Size Max'
        + '<tr><td><input class=mini id=positive_size_bonus min=0 step=any type=number><td>Positive Size Bonus'
        + '<tr><td><input id=negative_color type=color><td>Negative Color'
        + '<tr><td><input class=mini id=negative_count min=0 step=1 type=number><td># of Negative'
        + '<tr><td><input class=mini id=negative_score step=any type=number><td>Negative Score'
        + '<tr><td><input class=mini id=negative_size_max min=0 step=any type=number><td>Negative Size Max'
        + '<tr><td><input class=mini id=negative_size_bonus min=0 step=any type=number><td>Negative Size Bonus</table>',
      'title': 'SpeedShape.htm',
      'ui': 'Score: <span id=score></span> | Time: <span id=time></span>',
    });
    canvas_init({
      'cursor': 'pointer',
      'interval': false,
    });
}

function repo_load(id){
    score = 0;
    time = core_storage_data.time_limit;

    core_ui_update({
      'ids': {
        'score': score,
        'time': time,
      },
    });

    randomize_shapes();
    core_interval_modify({
      'id': 'interval',
      'interval': 100,
      'todo': decisecond,
    });
}

function start(){
    if(score !== 0
      && !globalThis.confirm('Start new game?')){
        return;
    }

    canvas_setmode();
}
