





// display damage of the south castle per hour
function display_south_damage_per_hour() {

    let south_total_damage = 0;

    // iterate through all hours
    for (let i = 0; i < south_hour_grouped.length; i++) {

        // each hour will have a different color from the palette
        fill(test_palette[i % test_palette.length]);

        // iterate through all entries within an hour
        for (let n = 0; n < south_hour_grouped[i].length; n++) {

            // extract inflicted damage
            let entry_words = south_hour_grouped[i][n].text.split(" "); // example ['Player', '376209', 'attacked', 'south', 'for', '10', 'damage.', 'Castle', 'health', 'is', 'now', '561.']
            let damage = parseInt(entry_words[5]);

            // map number of attacks in hour to color palettes
            //let palette_idx = floor(map(south_hour_grouped[i].length, 0, max_attacks_in_hour, test_palette.length - 1, 0)); 
            //fill(test_palette[palette_idx]);

            // choose two end colors and interpolate palette gradient between them
            //fill(lerpColor(color_high, color_low, south_hour_grouped[i].length / max_attacks_in_hour));

            // draw damage squares
            for (let d = 0; d < damage; d++) {

                let cell_x = (south_total_damage % grid_n_width) * grid_cell_dim[0] + grid_offset_south_x;
                let cell_y = floor(south_total_damage / grid_n_width) * grid_cell_dim[1] + grid_offset_south_y;

                rect(cell_x, cell_y, grid_cell_dim[0], grid_cell_dim[1]);

                south_total_damage++; // increment total damage for the castle one point at a time
            }

        }

    }

}





// display legend for damage of the south castle per hour
function display_south_damage_legend() {

    for (let i = 0; i < test_palette.length; i++) {

        // each hour will have a different color from the palette
        fill(test_palette[test_palette.length - i - 1]);
        
        let cell_x = legend_offset_south_x;
        let cell_y = height - legend_offset_south_y - 4 * i * grid_cell_dim[1];

        rect(cell_x, cell_y, grid_cell_dim[0] * 4, grid_cell_dim[1] * 4);

    }


}



