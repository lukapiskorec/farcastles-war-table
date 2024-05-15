/*

                        F A R C A S T L E S

                          W a r  T a b l e

           { p r o t o c e l l : l a b s }  |  2 0 2 4

*/



function preload() {

  MonoMEK = loadFont('assets/MEK-Mono.otf');
  fc_data_json = loadJSON("./data/farcastles_fc_data_rounds_1-22.json");

  // load ndjson data - every line is a separate string in a list
  // comment OUT in production
  //fc_data_ndjson_strings = loadStrings("./data/240515_farcastles_fc_data_timestamped.ndjson", () => { console.log("Farcaster data loaded ✅") });

}



function setup() {

  canvas = createCanvas(windowWidth, windowHeight);

  frameRate(10);
  //rectMode(CENTER);
  textFont(MonoMEK);

  // convert ndjson to json and filter only necessary properties
  // comment OUT in production - run this separately, then later parse just json directly to speed up loading time
  //format_ndjson_to_json();

  // parse and extract farcastles data from the nson file
  parse_fc_data();
  // group farcastles entries by hour
  group_entries_by_hour();
  // extract attackers from all entries
  extract_attackers();
  // calculate grid cell and other dimensions so to fit into the screen
  calculate_dimensions();
  
}




function draw() {
  
  // animate color palettes
  //test_palette = getShiftedArray(test_palette, 1);

  background(color("#f3f3f3"));

  // calculates the progress of battle to display (progress ranges from 0 to 1)
  calculate_progress();

  // display castle damage per hour as a grid of cells
  display_damage_per_hour("south", south_hour_grouped, palette_south, width / 2 - grid_n_width * grid_cell_dim[0] - gap_between_castles / 2, height * upper_layout_height);
  display_damage_per_hour("north", north_hour_grouped, palette_north, width / 2 + gap_between_castles / 2, height * upper_layout_height);

  // display legend for castle damage per hour
  display_damage_legend(palette_south, gap_between_castles / 2, height * lower_layout_height);
  display_damage_legend(palette_north, width - gap_between_castles / 2, height * lower_layout_height);

  // display text titles on the screen
  display_titles();
  
  // buttons for changing the round
  display_round_buttons();

  //noLoop();
  
}


