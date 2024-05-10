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

  // break data string on newlines, parse each one via JSON.parse(…) and save the result in an array
  fc_data = fc_data_string.split('\n').map(s => JSON.parse(s));

  console.log("Total data entries: ", fc_data.length);



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



  console.log(fc_data_south);
  console.log(fc_data_north);



  /*

  for (entry of fc_data_south) {
    console.log(entry.text);
  }

  for (entry of fc_data_north) {
    console.log(entry.text);
  }
  */


  /*
  let idx = 100;

  console.log(fc_data_south[idx].timestamp);
  console.log(fc_data_south[idx].text);

  let timestamp = new Date(fc_data_south[idx].timestamp);
  let minutes = timestamp.getMinutes();

  console.log("Minutes: ", minutes);

  // time difference between two entries in milliseconds
  let ms_diff = new Date(fc_data_south[idx].timestamp).getTime() - new Date(fc_data_south[idx+1].timestamp).getTime();

  console.log("Time difference in ms: ", ms_diff);


  //console.log(fc_data_south[idx].text.split("now ")[1].slice(0, fc_data_south[idx].text.length - 1));

  let damage_string = fc_data_south[idx].text.split("now ")[1];
  damage_string = damage_string.slice(0, damage_string.length - 1);
  let damage = parseInt(damage_string) + 1; // convert to integer
  console.log(damage);

  */



  let time_division = 100000;

  let south_total_time_ms = new Date(fc_data_south[fc_data_south.length - 1].timestamp).getTime() - new Date(fc_data_south[0].timestamp).getTime();
  let south_date_entries_nr = floor(south_total_time_ms / time_division);

  let north_total_time_ms = new Date(fc_data_north[fc_data_north.length - 1].timestamp).getTime() - new Date(fc_data_north[0].timestamp).getTime();
  let north_date_entries_nr = floor(north_total_time_ms / time_division);


  // creating an array filled with zeros
  south_date_sorted = Array(south_date_entries_nr).fill(0);
  north_date_sorted = Array(north_date_entries_nr).fill(0);

  // go through all south entries
  for (let i = 0; i < fc_data_south.length; i++) {
    let ms_diff = new Date(fc_data_south[i].timestamp).getTime() - new Date(fc_data_south[0].timestamp).getTime();
    let idx_timed = floor(ms_diff / time_division);
    south_date_sorted[idx_timed] = fc_data_south[i];
  }

  // go through all north entries
  for (let i = 0; i < fc_data_north.length; i++) {
    let ms_diff = new Date(fc_data_north[i].timestamp).getTime() - new Date(fc_data_north[0].timestamp).getTime();
    let idx_timed = floor(ms_diff / time_division);
    north_date_sorted[idx_timed] = fc_data_north[i];
  }

  //console.log("South entries", south_date_entries_nr);
  //console.log("North entries", north_date_entries_nr);



  let ms_in_h = 3600000; // miliseconds in an hour
  let south_total_hours = floor(south_total_time_ms / ms_in_h);
  let north_total_hours = floor(north_total_time_ms / ms_in_h);

  // creating an array filled with []
  south_hour_grouped = Array.from(Array(south_total_hours + 1), () => []);
  north_hour_grouped = Array.from(Array(north_total_hours + 1), () => []);

  //console.log(south_hour_grouped);


  // go through all south entries
  for (let i = 0; i < fc_data_south.length; i++) {
    let ms_diff = new Date(fc_data_south[i].timestamp).getTime() - new Date(fc_data_south[0].timestamp).getTime();
    let hour_nr = floor(ms_diff / ms_in_h);
    south_hour_grouped[hour_nr].push(fc_data_south[i]); // add entry to the subarray group according to the hour the attack happened
  }

  console.log(south_hour_grouped);




  // DISPLAY CASTLE DAMAGE PER HOUR

  // iterate through all hours
  for (let i = 0; i < south_hour_grouped.length; i++) {

    if (south_hour_grouped[i].length > max_attacks_in_hour) { max_attacks_in_hour = south_hour_grouped[i].length } // calculate max attacks in any hour - needed for the mapping of color palettes

    // iterate through all entries within an hour
    for (let n = 0; n < south_hour_grouped[i].length; n++) {

      //console.log("Hour nr.", i, ":", south_hour_grouped[i][n].text);

      // extract inflicted damage
      let entry_words = south_hour_grouped[i][n].text.split(" "); // example ['Player', '376209', 'attacked', 'south', 'for', '10', 'damage.', 'Castle', 'health', 'is', 'now', '561.']
      let damage = parseInt(entry_words[5]);

    }


  }


  //console.log(pigments);
  //console.log(palette);



  // sort palette colors according to lightness
  //test_palette.sort(function(a, b){return lightness(a) - lightness(b)});

  // sort palette colors according to hue
  test_palette.sort(function (a, b) { return hue(a) - hue(b) });

  //test_palette = getShiftedArray(test_palette, 21);

  color_high = color(test_palette[gene_rand_int(0, test_palette.length)]);
  color_low = color(test_palette[gene_rand_int(0, test_palette.length)]);

  console.log("Number of palettes", palettes_hue_sorted.length)
  console.log("Colors in the palette", test_palette.length)

  console.log(test_palette)


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



  // display damage of the south castle per hour
  display_south_damage_per_hour();

  // display legend for damage of the south castle per hour
  display_south_damage_legend()



  /*

  // DISPLAY DAMAGE - DATE ORDERED

  let idx = frameCount % south_date_sorted.length; // min(south_date_sorted.length, north_date_sorted.length)


  if (south_date_sorted[idx].text != undefined) {

    // extract castle damage
    let damage_string = south_date_sorted[idx].text.split("now ")[1];
    damage_string = damage_string.slice(0, damage_string.length - 1);
    let south_castle_damage = parseInt(damage_string) + 1; // convert to integer
    
    // display castle damage
    text(south_castle_damage.toString(), width / 2, height / 2);

  }


  if (north_date_sorted[idx].text != undefined) {

    // extract castle damage
    let damage_string = north_date_sorted[idx].text.split("now ")[1];
    damage_string = damage_string.slice(0, damage_string.length - 1);
    let north_castle_damage = parseInt(damage_string) + 1; // convert to integer
    
    // display castle damage
    text(north_castle_damage.toString(), width / 2, height / 2 - 150);

  }

  // display text
  text("South Castle", width / 2, height / 2 - 50);
  text("North Castle", width / 2, height / 2 - 200);

  */



  /*

  // DISPLAY DAMAGE

  let idx = frameCount % fc_data_south.length;

  // extract castle damage
  let damage_string = fc_data_south[idx].text.split("now ")[1];
  damage_string = damage_string.slice(0, damage_string.length - 1);
  let south_castle_damage = parseInt(damage_string) + 1; // convert to integer

  // display castle damage
  text(south_castle_damage.toString(), width / 2, height / 2);


  // time difference between two entries in milliseconds
  let ms_diff = new Date(fc_data_south[idx+1].timestamp).getTime() - new Date(fc_data_south[idx].timestamp).getTime();

  // display time difference damage
  text(ms_diff.toString(), width / 2, height / 2 - 50);

  */






}






