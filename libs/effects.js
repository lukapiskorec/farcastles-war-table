//////EFFECTS//////



// parse and extract farcastles data from the ndjson file
function parse_fc_data() {

    // break data string on newlines, parse each one via JSON.parse(…) and save the result in an array
    fc_data = fc_data_string.split('\n').map(s => JSON.parse(s));

    // data elements that include the word "health" - "Player 293084 attacked south for 3 damage. Castle health is now 24869."
    fc_data_health = fc_data.filter(element => element.text.includes("health"))
    // data elements that include the word "south"
    fc_data_south = fc_data_health.filter(element => element.text.includes("south"))
    // data elements that include the word "north"
    fc_data_north = fc_data_health.filter(element => element.text.includes("north"))

    // reverses the lists so they run in chronological order
    fc_data_health.reverse();
    fc_data_south.reverse();
    fc_data_north.reverse();

    console.log("Total data entries: ", fc_data.length);
    console.log("Data entries south: ", fc_data_south.length);
    console.log("Data entries north: ", fc_data_north.length);
    console.log("Other data entries: ", fc_data.length - fc_data_north.length - fc_data_south.length);

    console.log(fc_data_south);
    //console.log(fc_data_north);

}




// group farcastles entries by hour
function group_entries_by_hour() {

    // calculate total time difference for south entries
    let south_total_time_ms = new Date(fc_data_south[fc_data_south.length - 1].timestamp).getTime() - new Date(fc_data_south[0].timestamp).getTime();
    // calculate total time difference for north entries
    let north_total_time_ms = new Date(fc_data_north[fc_data_north.length - 1].timestamp).getTime() - new Date(fc_data_north[0].timestamp).getTime();

    let south_total_hours = floor(south_total_time_ms / ms_in_h);
    let north_total_hours = floor(north_total_time_ms / ms_in_h);

    // creating an array filled with []
    south_hour_grouped = Array.from(Array(south_total_hours + 1), () => []);
    north_hour_grouped = Array.from(Array(north_total_hours + 1), () => []);


    // go through all south entries and group them by hour
    for (let i = 0; i < fc_data_south.length; i++) {
        let ms_diff = new Date(fc_data_south[i].timestamp).getTime() - new Date(fc_data_south[0].timestamp).getTime();
        let hour_nr = floor(ms_diff / ms_in_h);
        south_hour_grouped[hour_nr].push(fc_data_south[i]); // add entry to the subarray group according to the hour the attack happened
    }

    // go through all north entries and group them by hour
    for (let i = 0; i < fc_data_north.length; i++) {
        let ms_diff = new Date(fc_data_north[i].timestamp).getTime() - new Date(fc_data_north[0].timestamp).getTime();
        let hour_nr = floor(ms_diff / ms_in_h);
        north_hour_grouped[hour_nr].push(fc_data_north[i]); // add entry to the subarray group according to the hour the attack happened
    }

    console.log(south_hour_grouped);
    //console.log(north_hour_grouped);

}



// calculate grid cell and other dimensions so to fit into the screen
function calculate_dimensions() {
    let dim_scale = round((height * 0.9) / grid_n_height, 2);
    grid_cell_dim = [dim_scale, dim_scale];
    console.log("dimension scale", dim_scale);
}




// calculates the progress of battle to display (progress ranges from 0 to 1)
function calculate_progress() {
    progress = mouseY / height;
}




// display castle damage per hour as a grid of cells
function display_damage_per_hour(castle_type, hour_grouped, palette, grid_offset_x, grid_offset_y) {

    // we start with full health and zero total damage
    let total_damage = 0;
    let last_health = 25000; 

    let stop_drawing_damage = false; // will trigger when total_damage reaches 25000

    // iterate through all hours
    for (let i = 0; i < hour_grouped.length * progress; i++) {

        // each hour will have a different color from the palette
        fill(palette[i % palette.length]);
        
        // iterate through all entries within an hour
        for (let n = 0; n < hour_grouped[i].length; n++) {

            // extract inflicted damage
            let entry_words = hour_grouped[i][n].text.split(" "); // example ['Player', '376209', 'attacked', 'south', 'for', '10', 'damage.', 'Castle', 'health', 'is', 'now', '561.']
            let recorded_damage = parseInt(entry_words[5]);
            
            let health_string = entry_words[11];
            let health = parseInt(health_string.slice(0, health_string.length - 1));

            //console.log("castle health", health);

            let damage = last_health - health; // for some reason we are getting wrong results when using damage information directly so we have to do it like this
            last_health = health; // will be used in the next iteration

            //console.log("recorded damage", recorded_damage);
            //console.log("damage", damage);
            //console.log("last_health", last_health);

            // draw damage squares
            for (let d = 0; d < damage; d++) {

                let cell_x = (total_damage % grid_n_width) * grid_cell_dim[0] + grid_offset_x;
                let cell_y = floor(total_damage / grid_n_width) * grid_cell_dim[1] + grid_offset_y;

                // random jitter of cells to remove artifacts
                cell_x += random(-jitter_temp, jitter_temp);
                cell_y += random(-jitter_temp, jitter_temp);

                rect(cell_x, cell_y, grid_cell_dim[0] * dim_extra_scale, grid_cell_dim[1] * dim_extra_scale);

                total_damage++; // increment total damage for the castle one point at a time

                // trigger cascading break when we reach total_damage of 25000
                if (total_damage == 25000) {
                    stop_drawing_damage = true;
                    break;
                }
            }

            // trigger cascading break
            if (stop_drawing_damage) {break;}

        }

        // trigger cascading break
        if (stop_drawing_damage) {break;}

    }

    
    // draw leftover castle cells
    if (!stop_drawing_damage) {

        let leftover_damage = 25000 - total_damage; // 25000 - total_damage
        //fill(color("#111111"));


        for (let i = 0; i < leftover_damage; i++) {

            let cell_x = (total_damage % grid_n_width) * grid_cell_dim[0] + grid_offset_x;
            let cell_y = floor(total_damage / grid_n_width) * grid_cell_dim[1] + grid_offset_y;

            cell_x += random(-jitter_temp, jitter_temp);
            cell_y += random(-jitter_temp, jitter_temp);

            //let gray_tone = 50 * noise(cell_x * 0.01, cell_y);
            let gray_tone;
            let noise_sample = noise(cell_x * 0.01, cell_y);
            if (noise_sample > 0.70) {gray_tone = 255;}
            else if (noise_sample > 0.55) {gray_tone = 127;}
            else {gray_tone = 0;}

            if (castle_type == "south") {gray_tone = 255 - gray_tone}; // invert colors for the south castle

            fill(gray_tone);


            rect(cell_x, cell_y, grid_cell_dim[0] * dim_extra_scale, grid_cell_dim[1] * dim_extra_scale);

            total_damage++; // increment total damage for the castle one point at a time

        }
    }

    //console.log("total_damage", total_damage);
    //console.log("final castle health", last_health);
    

}





// display legend for castle damage per hour
function display_damage_legend(palette, legend_offset_x, legend_offset_y) {

    for (let i = 0; i < palette.length; i++) {

        // each hour will have a different color from the palette
        fill(palette[palette.length - i - 1]);

        let cell_x = legend_offset_x;
        let cell_y = height - legend_offset_y - 4 * i * grid_cell_dim[1];

        rect(cell_x, cell_y, grid_cell_dim[0] * 4, grid_cell_dim[1] * 4);

    }

}





