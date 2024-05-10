/*

                        F A R C A S T L E S

                          W a r  T a b l e

           { p r o t o c e l l : l a b s }  |  2 0 2 4

*/



function preload() {

  MonoMEK = loadFont('assets/MEK-Mono.otf');

}



function setup() {

  canvas = createCanvas(windowWidth, windowHeight);

  frameRate(10);
  rectMode(CENTER);
  textFont(MonoMEK);


  // parse and extract farcastles data from the ndjson file
  parse_fc_data();
  // group farcastles entries by hour
  group_entries_by_hour();

}




function draw() {

  // animate color palettes
  //test_palette = getShiftedArray(test_palette, 1);

  background(color("#f3f3f3"));


  // set text properties
  textSize(20);
  textAlign(LEFT);
  stroke(255, 255, 255)
  noStroke();



  // display castle damage per hour as a grid of cells
  display_damage_per_hour(south_hour_grouped, palette_south, 50, 15);
  display_damage_per_hour(north_hour_grouped, palette_north, 600, 15);

  // display legend for castle damage per hour
  display_damage_legend(palette_south, 25, 50);
  display_damage_legend(palette_north, 575, 50);


}


