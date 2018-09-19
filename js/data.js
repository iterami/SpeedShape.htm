'use strict';

function load_data(id){
    randomize_shapes();
    score = 0;
    time = core_storage_data['time-limit'];
}

function randomize_shapes(){
    core_entity_remove_all();

    if(core_storage_data['negative'] > 0){
        let loop_counter = core_storage_data['negative'] - 1;
        do{
            core_entity_create({
              'id': 'negative-' + loop_counter,
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
                  'max': canvas_properties['width'],
                }) - 21,
                'y': core_random_integer({
                  'max': canvas_properties['height'],
                }) - 21,
              },
            });
        }while(loop_counter--);
    }
    if(core_storage_data['positive'] > 0){
        let loop_counter = core_storage_data['positive'] - 1;
        do{
            core_entity_create({
              'id': 'positive-' + loop_counter,
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
                  'max': canvas_properties['width'],
                }) - 9,
                'y': core_random_integer({
                  'max': canvas_properties['height'],
                }) - 9,
              },
            });
        }while(loop_counter--);
    }

    if(time <= 0){
        canvas_draw();
    }
}
