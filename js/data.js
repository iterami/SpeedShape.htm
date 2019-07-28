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
                'color': core_storage_data['color-negative'],
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
                'color': core_storage_data['color-positive'],
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
