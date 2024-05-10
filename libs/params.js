//////PARAMS//////

let MonoMEK, canvas;
let fc_data_string, fc_data, fc_data_health, fc_data_south, fc_data_north;
let south_date_sorted, north_date_sorted, south_hour_grouped, north_hour_grouped;

let max_attacks_in_hour = 0;
let ms_in_h = 3600000; // miliseconds in an hour

let color_high, color_low;



let grid_n_width = 100;
let grid_n_height = 250;
let grid_cell_dim = [5, 5];








// read the ndjson file

fetch("./data/farcastles_fc_data_round_19.ndjson")
    .then((res) => res.text())
    .then((text) => {
        console.log("Farcaster data loaded ✅");
        fc_data_string = text;
    })
    .catch((e) => console.error(e));






// palettes sorted according to hue
// used this function - palette.sort(function (a, b) { return hue(a) - hue(b) });
let palettes_hue_sorted = [
 
    [
        '#f34333', '#e84818', '#ff855f', '#ee5626', '#ffbb33', '#daa211', '#ffbf0b', '#fdd666', '#fccc0c', '#f2cd22', '#ffe550', '#e7e7d7',
        '#f5f5d5', '#7cc1c1', '#1b94bb', '#4d9db9', '#2277a7', '#3bb3ff', '#2a72ae', '#266396', '#4888c8', '#e22e82', '#e51335', '#ff2244'
    ], // blue / red / yellow

    [
        '#de3e1e', '#f77757', '#fccc66', '#ede8dd', '#fff1d1', '#eee7d7', '#f6af06', '#ffbf0b', '#f0cc0c', '#eed333', '#f2e222', '#f2f2e2',
        '#668833', '#889979', '#33936d', '#019166', '#007555', '#0e4a4e', '#06add6', '#5484a8', '#445e7e', '#f8c8de', '#ee3e6e', '#ef6e7e'
    ], // red / teal / green / yellow

    [
        '#db4545', '#ffbcbc', '#ff4f44', '#d83818', '#ebe0ce', '#fff8e8', '#e5fde5', '#a6d6d6', '#d0e0e0', '#088191', '#144b5b', '#5ec5ee',
        '#1a88c1', '#005aa5', '#3a6a93', '#77aee7', '#004999', '#557baa', '#044499', '#242d44', '#2e3855', '#f999a9', '#f55b66', '#e11e21'
    ], // blue / red / white

    [
        '#fff8f8', '#fece3c', '#f8e288', '#ffd525', '#f2d552', '#b4c8ac', '#9fc999', '#b0e3c4', '#bfffdd', '#a3e3dd', '#070c0c', '#1d5256',
        '#00bbfb', '#2280b1', '#62aad6', '#005995', '#1d5581', '#002044', '#2277d7', '#1c6dd6', '#004fbe', '#244888', '#1a3daa', '#2c2c44'
    ], // blue / teal / yellow

    [
        '#f9e9d9', '#ebe0ce', '#ddd4c4', '#cec09c', '#b5ab6d', '#b5be5e', '#788c33', '#445522', '#505e3e', '#374727', '#2a3322', '#244e04',
        '#88d899', '#c0cdc8', '#1a966a', '#1d5e6a', '#144b5b', '#444b4e', '#7d9aa7', '#10244a', '#20335c', '#1c2244', '#2a2c41', '#1d1e33'

    ], // green / blue / white

    [
        '#e2e2e2', '#fe9e9e', '#fccebb', '#f9c66c', '#ece3d3', '#f9f0df', '#dadaaa', '#7cc7ac', '#3fb3aa', '#6cc6dd', '#c5e5f5', '#7799aa',
        '#1f336f', '#434394', '#553773', '#8d00d8', '#d722b7', '#8b3b7b', '#750555', '#990f5f', '#550533', '#fd5d9d', '#ff3f7f', '#e40422'
    ], // purple / teal / yellow

    [
        '#511919', '#191919', '#fcc1c1', '#ff5333', '#d83818', '#e74422', '#fab6a7', '#ff855f', '#f9966a', '#ece3d3', '#f9f0df', '#ede8dd',
        '#fbb515', '#f9ce6a', '#fee17c', '#ffcc00', '#d7116c', '#900f3f', '#ff336f', '#c70033', '#960422', '#e4042e', '#ff2244', '#e11e21'
    ], // red / yellow / white

    [
        '#db4545', '#ffbcbc', '#fff8f8', '#e2e2e2', '#fe9e9e', '#511919', '#191919', '#fcc1c1', '#ff4f44', '#f34333', '#ff5333', '#de3e1e',
        '#d83818', '#d83818', '#e74422', '#fab6a7', '#f77757', '#e84818', '#ff855f', '#ff855f', '#ee5626', '#fccebb', '#f9966a', '#f9e9d9'
    ], // red
    
    [
        '#ebe0ce', '#ebe0ce', '#f9c66c', '#ece3d3', '#ece3d3', '#ddd4c4', '#f9f0df', '#f9f0df', '#ffbb33', '#fccc66', '#ede8dd', '#ede8dd',
        '#fff1d1', '#eee7d7', '#fff8e8', '#fbb515', '#f9ce6a', '#f6af06', '#cec09c', '#daa211', '#ffbf0b', '#ffbf0b', '#fdd666', '#fece3c'
    ], // yellow / white
    
    [
        '#fee17c', '#fccc0c', '#ffcc00', '#f8e288', '#ffd525', '#f2d552', '#f2cd22', '#f0cc0c', '#ffe550', '#eed333', '#b5ab6d', '#f2e222',
        '#e7e7d7', '#f5f5d5', '#f2f2e2', '#dadaaa', '#b5be5e', '#788c33', '#445522', '#668833', '#505e3e', '#374727', '#2a3322', '#889979'
    ], // yellow / green
    
    [
        '#244e04', '#b4c8ac', '#9fc999', '#e5fde5', '#88d899', '#b0e3c4', '#bfffdd', '#33936d', '#c0cdc8', '#7cc7ac', '#1a966a', '#019166',
        '#007555', '#a3e3dd', '#3fb3aa', '#7cc1c1', '#a6d6d6', '#d0e0e0', '#070c0c', '#0e4a4e', '#1d5256', '#088191', '#1d5e6a', '#06add6'
    ], // green / teal
    
    [
        '#6cc6dd', '#144b5b', '#144b5b', '#1b94bb', '#00bbfb', '#4d9db9', '#5ec5ee', '#444b4e', '#7d9aa7', '#c5e5f5', '#7799aa', '#1a88c1',
        '#2280b1', '#2277a7', '#62aad6', '#3bb3ff', '#005995', '#5484a8', '#1d5581', '#2a72ae', '#005aa5', '#266396', '#3a6a93', '#4888c8'
    ], // blue
    
    [
        '#77aee7', '#004999', '#002044', '#2277d7', '#445e7e', '#557baa', '#1c6dd6', '#044499', '#004fbe', '#244888', '#10244a', '#20335c',
        '#242d44', '#2e3855', '#1f336f', '#1a3daa', '#1c2244', '#2a2c41', '#1d1e33', '#2c2c44', '#434394', '#553773', '#8d00d8', '#d722b7'
    ], // blue / purple
    
    [
        '#8b3b7b', '#750555', '#990f5f', '#550533', '#e22e82', '#d7116c', '#f8c8de', '#fd5d9d', '#900f3f', '#ff3f7f', '#ff336f', '#ee3e6e',
        '#c70033', '#960422', '#e4042e', '#f999a9', '#e51335', '#ff2244', '#ff2244', '#e40422', '#ef6e7e', '#f55b66', '#e11e21', '#e11e21'
    ], // purple / red
    
];




let palette_south = palettes_hue_sorted[gene_rand_int(0, palettes_hue_sorted.length)];
let palette_north = palettes_hue_sorted[gene_rand_int(0, palettes_hue_sorted.length)];

//palette_south = getShiftedArray(test_palette, 0);
//palette_north = getShiftedArray(palette_north, 0);

//console.log(palette_south);
//console.log(palette_north);
