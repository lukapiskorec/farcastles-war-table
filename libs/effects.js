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

    //console.log(fc_data_south);
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

    //console.log(south_hour_grouped);
    //console.log(north_hour_grouped);

}




// display castle damage per hour as a grid of cells
function display_damage_per_hour(hour_grouped, palette, grid_offset_x, grid_offset_y) {

    let total_damage = 0;

    // iterate through all hours
    for (let i = 0; i < hour_grouped.length; i++) {

        // each hour will have a different color from the palette
        fill(palette[i % palette.length]);
        
        // iterate through all entries within an hour
        for (let n = 0; n < hour_grouped[i].length; n++) {

            // extract inflicted damage
            let entry_words = hour_grouped[i][n].text.split(" "); // example ['Player', '376209', 'attacked', 'south', 'for', '10', 'damage.', 'Castle', 'health', 'is', 'now', '561.']
            let damage = parseInt(entry_words[5]);

            // draw damage squares
            for (let d = 0; d < damage; d++) {

                let cell_x = (total_damage % grid_n_width) * grid_cell_dim[0] + grid_offset_x;
                let cell_y = floor(total_damage / grid_n_width) * grid_cell_dim[1] + grid_offset_y;

                rect(cell_x, cell_y, grid_cell_dim[0], grid_cell_dim[1]);

                total_damage++; // increment total damage for the castle one point at a time
            }

        }

    }


    // draw leftover castle cells

    let leftover_damage = 25000 - total_damage;
    fill(color("#111111"));

    for (let i = 0; i < leftover_damage; i++) {

        let cell_x = (total_damage % grid_n_width) * grid_cell_dim[0] + grid_offset_x;
        let cell_y = floor(total_damage / grid_n_width) * grid_cell_dim[1] + grid_offset_y;

        rect(cell_x, cell_y, grid_cell_dim[0], grid_cell_dim[1]);

        total_damage++; // increment total damage for the castle one point at a time

    }


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



