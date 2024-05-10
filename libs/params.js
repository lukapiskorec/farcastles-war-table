//////PARAMS//////

let MonoMEK, canvas;
let fc_data_string, fc_data, fc_data_health, fc_data_south, fc_data_north;
let south_date_sorted, north_date_sorted, south_hour_grouped, north_hour_grouped;

let max_attacks_in_hour = 0;

let color_high, color_low;



let grid_n_width = 100;
let grid_n_height = 250;
let grid_cell_dim = [5, 5];

let grid_offset_south_x = 50;
let grid_offset_south_y = 15;

let legend_offset_south_x = 25;
let legend_offset_south_y = 50;






// read the ndjson file

fetch("./data/farcastles_fc_data_round_19.ndjson")
    .then((res) => res.text())
    .then((text) => {
        console.log("Farcaster data loaded ✅");
        fc_data_string = text;
    })
    .catch((e) => console.error(e));






const palette_pigments = {

    "horizon, sunshine, grapefruit": {

        "Otti": ["#a3d3ff", "#ff855f", "#ffe550"], // light blue, light red, yellow - Otti Berger
        "Stölzl": ["#c44414", "#daa211", "#255080"], // red, yellow, blue - Gunta Stölzl
        "Albers": ["#e51335", "#2a72ae", "#fbb515"], // red, blue, yellow - Anni Albers
        "Brandt": ["#3bb3ff", "#ffbb33", "#ff2244"], // light blue, orange, red - Marianne Brandt
        "Koch-Otte": ["#ee5626", "#eebb22", "#4d9db9", "#7cc1c1"], // red, yellow, blue, light blue - Benita Koch-Otte
        "Arndt": ["#e22e82", "#efbf33", "#3555a5"], // red, yellow, blue - Gertrude Arndt
        "Siedhoff-Buscher": ["#ebb707", "#e84818", "#266396", "#eecece"], // yellow, red, blue, light lila - Alma Siedhoff-Buscher
        "Heymann": ["#ee2f2f", "#f2cd22", "#1b94bb", "#faaaba"], // red, yellow, blue, light pink - Margarete Heymann

    },

    "night, embers, citrus": {

        "van der Rohe": ["#f34333", "#fdd666", "#275777", "#090909"], // - Ludwig Mies van der Rohe
        "Breuer": ["#ffbf0b", "#ee3e6e", "#2277a7", "#090909"], // - Marcel Breuer
        "Gropius": ["#e51335", "#2a72ae", "#fbb515", "#090909"], //red, blue, yellow, black - Walter Gropius
        "Le Corbusier": ["#f24222", "#fccc0c", "#4888c8", "#090909"], // red, yellow, blue, black - Le Corbusier

    },

    "ivy, apatite, tourmaline": {

        "O'Keeffe": ["#0e4a4e", "#ff9777", "#5484a8"], // green, light red, blue - Georgia O'Keeffe
        "Dalí": ["#e54545", "#f77757", "#fccc66", "#fafa66", "#1ac1ca"], // - Salvador Dalí
        "Matisse": ["#06add6", "#066888", "#f0cc0c", "#dd1d1d"], // - Henri Matisse
        "Kandinsky": ["#ffbf0b", "#ee3e6e", "#2277a7", "#33936d"], // - Wassily Kandinsky
        "Chagall": ["#f6af06", "#1e66aa", "#019166", "#e74422"], // orange yellow, blue, green, red - Marc Chagall
        "Negreiros": ["#f8c8de", "#f2e222", "#28b2d2", "#668833", "#ef6e7e"], // light pink, yellow, blue, green, red - Almada Negreiros
        "Picasso": ["#f33373", "#eed333", "#445e7e", "#19a199"], // red, yellow, blue, teal - Pablo Picasso
        "Klee": ["#de3e1e", "#de9333", "#007555", "#889979", "#7aa7a7"], // red, yellow, green, olive green, light green - Paul Klee

    },

    "sodalite, glacier, rust": {

        "Planck": ["#d83818", "#224772", "#151a1a"], // red, blue, black - Max Planck
        "Thomson": ["#144b5b", "#088191", "#e5fde5", "#466994", "#f55b66"], // - Sir Joseph John Thomson
        "Einstein": ["#ebe0ce", "#c5c5bb", "#242d44", "#e4042e"], // light gray, gray, dark blue, red - Albert Einstein
        "Heisenberg": ["#e11e21", "#e7007e", "#005aa5", "#5ec5ee"], // red, pink, blue, light blue - Werner Heisenberg
        "Bohr": ["#f999a9", "#044499", "#1a88c1", "#77aee7", "#a6d6d6"], // light pink, blue, light blue, super light blue, light teal - Niels Bohr
        "Feynman": ["#004999", "#557baa", "#ff4f44", "#ffbcbc"], // deep blue, blue, red, light lila - Richard Feynman
        "Dirac": ["#db4545", "#3a6a93", "#2e3855", "#a3c6d3"], // red, blue, dark blue, light blue - Paul Dirac

    },

    "ocean, lapis, sulphur": {

        "Babbage": ["#1a3daa", "#244888", "#2277d7", "#62aad6", "#f2d552"], // - Charles Babbage
        "Lovelace": ["#dafaff", "#00bbfb", "#005995", "#002044"], // - Ada Lovelace
        "Leibniz": ["#a3e3dd", "#1c6dd6", "#2c2c44", "#ffd525"], // light teal, blue, dark gray, yellow - Gottfried Wilhelm Leibniz
        "Boole": ["#070c0c", "#1d5581", "#fece3c", "#f8e288", "#9fc999"], // - George Boole

    },

    "moss, cedar, algae": {

        "Zancan": ["#445522", "#788c33", "#b5be5e", "#242414"], // - Zancan
        "Muir": ["#cec09c", "#505e3e", "#374727", "#2a3322"], // light brown, light olive, dark green, dark olive - John Muir
        "Thoreau": ["#144b5b", "#1a966a", "#88d899", "#cadaba"], // - Henry David Thoreau

    },

    "ink, steel, salt": {

        "Hokusai": ["#7d9aa7", "#c0b8a8", "#ddd4c4", "#10244a", "#444b4e"], // - Katsushika Hokusai
        "Hiroshige": ["#20335c", "#1c2244", "#1d1f2d"], // blue, dark blue, black - Utagawa Hiroshige

    },

    "charcoal, papyrus, marble": {

        "Charcoal": ["#090909", "#1a1a1a", "#1d1d1d", "#222222", "#2c2c2c", "#3c3c3c"], // black, black, black, black, dark gray, gray
        "Adams": ["#2a2b2c", "#1e1e1e"], // dark gray, black - Ansel Adams
        "New York Times": ["#cac5b5", "#1e1e1e"], // gray, black

    },

    "murex, rhodochrosite, marshmallow": {

        "Minsky": ["#c5e5f5", "#fd5d9d", "#fccce0"], // - Marvin Minsky
        "Newell": ["#8d00d8", "#d722b7", "#f288c2", "#f9c66c", "#e2e2e2"], // - Allen Newell
        "Simon": ["#1f336f", "#553773", "#8b3b7b", "#f7447f"], // - Herbert A. Simon
        "McCarthy": ["#3fb3aa", "#7cc7ac", "#dadaaa", "#fe9e9e", "#ff3f7f"], // - John McCarthy
        "Solomonoff": ["#e77e99", "#6cc6dd", "#866686"], // light pink, light blue, light purple - Ray Solomonoff
        "Shannon": ["#665d8d", "#7799aa", "#d885a5", "#fccebb"], // purple, teal, pink, beige - Claude Shannon
        "von Neumann": ["#4a0020", "#550533", "#750555", "#990f5f"], // dark maroon, maroon, light maroon, maroon purple - John von Neumann
        "Turing": ["#e40422", "#e33388", "#434394", "#191919"], // red, pink, blue, black - Alan Turing

    },

    "furnace, ruby, soot": {

        "Kapoor": ["#900f3f", "#c70033", "#ff5333", "#ffcc00"], // maroon, red, orange, yellow - Anish Kapoor
        "Golid": ["#fece44", "#ff5333", "#ff99b9"], // yellow, red, light pink - Kjetil Golid
        "Busia": ["#e51335", "#090909"], // red, black - Kwame Bruce Busia
        "Judd": ["#ff2244", "#e74422", "#e11e21", "#faaf0f", "#fbb515", "#ff855f", "#191919"], // red, red, red, orange yellow, yellow, light red, black - Donald Judd
        "Malevich": ["#e51335", "#1d1d1d", "#fcc1c1"], // red, black, light pink - Kazimir Malevich

    }

}



const palette_arrays = [

    [

        ["#a3d3ff", "#fefaee", "#ff855f", "#ffe550"], // light blue, white, light red, yellow - Otti Berger
        ["#c44414", "#daa211", "#255080", "#e7e7d7"], // red, yellow, blue, white - Gunta Stölzl
        ["#f9f0df", "#e51335", "#2a72ae", "#fbb515"], // white, red, blue, yellow - Anni Albers
        ["#3bb3ff", "#feeddd", "#ffbb33", "#ff2244"], // light blue, white, orange, red - Marianne Brandt
        ["#ee5626", "#eebb22", "#4d9db9", "#f5f5d5", "#7cc1c1"], // red, yellow, blue, white, light blue - Benita Koch-Otte
        ["#e22e82", "#efbf33", "#3555a5", "#e7e7d7"], // red, yellow, blue, white - Gertrude Arndt
        ["#ebb707", "#e84818", "#266396", "#eecece", "#e4e4e4"], // yellow, red, blue, light lila, white - Alma Siedhoff-Buscher
        ["#ee2f2f", "#f2cd22", "#1b94bb", "#faaaba", "#feeede"], // red, yellow, blue, light pink, white - Margarete Heymann

    ],

    [

        ["#f34333", "#fdd666", "#275777", "#f3f3f3", "#090909"], // - Ludwig Mies van der Rohe
        ["#ffbf0b", "#ee3e6e", "#2277a7", "#f9f0df", "#090909"], // - Marcel Breuer
        ["#f9f0df", "#e51335", "#2a72ae", "#fbb515", "#090909"], // white, red, blue, yellow, black - Walter Gropius
        ["#f24222", "#fccc0c", "#4888c8", "#f9f0df", "#090909"], // red, yellow, blue, white, black - Le Corbusier

    ],

    [

        ["#0e4a4e", "#ff9777", "#ead2a2", "#5484a8"], // green, light red, beige, blue - Georgia O'Keeffe
        ["#e54545", "#f77757", "#fccc66", "#fafa66", "#1ac1ca"], // - Salvador Dalí
        ["#06add6", "#066888", "#f0cc0c", "#fff1d1", "#dd1d1d"], // - Henri Matisse
        ["#ffbf0b", "#ee3e6e", "#2277a7", "#33936d", "#f9f0df"], // - Wassily Kandinsky
        ["#f6af06", "#1e66aa", "#eee7d7", "#019166", "#e74422"], // orange yellow, blue, white, green, red - Marc Chagall
        ["#f8c8de", "#f2e222", "#28b2d2", "#668833", "#ef6e7e", "#f2f2e2"], // light pink, yellow, blue, green, red, white - Almada Negreiros
        ["#f33373", "#eed333", "#445e7e", "#19a199", "#ede8dd"], // red, yellow, blue, teal, white - Pablo Picasso
        ["#de3e1e", "#de9333", "#007555", "#eccdad", "#889979", "#7aa7a7"], // red, yellow, green, white, olive green, light green - Paul Klee

    ],

    [

        ["#f8f8e8", "#d83818", "#224772", "#151a1a"], // white, red, blue, black - Max Planck
        ["#144b5b", "#088191", "#e5fde5", "#466994", "#f55b66"], // - Sir Joseph John Thomson
        ["#ebe0ce", "#c5c5bb", "#242d44", "#e4042e"], // light gray, gray, dark blue, red - Albert Einstein
        ["#f9f9f0", "#e11e21", "#e7007e", "#005aa5", "#5ec5ee"], // white, red, pink, blue, light blue - Werner Heisenberg
        ["#f999a9", "#044499", "#1a88c1", "#77aee7", "#a6d6d6", "#f9f9f0"], // light pink, blue, light blue, super light blue, light teal, white - Niels Bohr
        ["#004999", "#557baa", "#ff4f44", "#ffbcbc", "#fff8e8"], // deep blue, blue, red, light lila, white - Richard Feynman
        ["#db4545", "#d0e0e0", "#3a6a93", "#2e3855", "#a3c6d3"], // red, white, blue, dark blue, light blue - Paul Dirac

    ],

    [

        ["#1a3daa", "#244888", "#2277d7", "#62aad6", "#f2d552"], // - Charles Babbage
        ["#dafaff", "#00bbfb", "#005995", "#002044"], // - Ada Lovelace
        ["#fff8f8", "#a3e3dd", "#1c6dd6", "#2c2c44", "#ffd525"], // white, light teal, blue, dark gray, yellow - Gottfried Wilhelm Leibniz
        ["#070c0c", "#1d5581", "#fece3c", "#f8e288", "#9fc999"], // - George Boole

    ],

    [

        ["#445522", "#788c33", "#b5be5e", "#242414", "#f2f2f2"], // - Zancan
        ["#cec09c", "#505e3e", "#374727", "#2a3322"], // light brown, light olive, dark green, dark olive - John Muir
        ["#144b5b", "#1a966a", "#88d899", "#cadaba", "#f9e9d9"], // - Henry David Thoreau

    ],

    [

        ["#7d9aa7", "#c0b8a8", "#ddd4c4", "#10244a", "#444b4e"], // - Katsushika Hokusai
        ["#ebe0ce", "#20335c", "#1c2244", "#1d1f2d"], // light gray, blue, dark blue, black - Utagawa Hiroshige

    ],

    [

        ["#090909", "#1a1a1a", "#1d1d1d", "#222222", "#2c2c2c", "#3c3c3c"], // black, black, black, black, dark gray, gray
        ["#cac5b5", "#ebe0ce", "#f9f0df", "#eee7d7", "#fff8f8", "#feeddd"], // gray, light gray, white, white, white
        ["#ebe0ce", "#2a2b2c", "#1e1e1e"], // light gray, dark gray, black - Ansel Adams
        ["#ebe0ce", "#cac5b5", "#1e1e1e"], // light gray, gray, black

    ],

    [

        ["#c5e5f5", "#fd5d9d", "#fccce0", "#feefef"], // - Marvin Minsky
        ["#8d00d8", "#d722b7", "#f288c2", "#f9c66c", "#e2e2e2"], // - Allen Newell
        ["#1f336f", "#553773", "#8b3b7b", "#f7447f", "#f9f0df"], // - Herbert A. Simon
        ["#3fb3aa", "#7cc7ac", "#dadaaa", "#fe9e9e", "#ff3f7f"], // - John McCarthy
        ["#e77e99", "#6cc6dd", "#866686", "#f9f9f0"], // light pink, light blue, light purple, white - Ray Solomonoff
        ["#665d8d", "#7799aa", "#d885a5", "#fccebb"], // purple, teal, pink, beige - Claude Shannon
        ["#4a0020", "#550533", "#750555", "#990f5f", "#f9f0df"], // dark maroon, maroon, light maroon, maroon purple, white - John von Neumann
        ["#e40422", "#e33388", "#434394", "#191919", "#ece3d3"], // red, pink, blue, black, white - Alan Turing

    ],

    [

        ["#900f3f", "#c70033", "#ff5333", "#ffcc00", "#f9f0df"], // maroon, red, orange, yellow, white - Anish Kapoor
        ["#fece44", "#ede8dd", "#ff5333", "#ff99b9"], // yellow, white, red, light pink - Kjetil Golid
        ["#f9f0df", "#e51335", "#090909"], // white, red, black - Kwame Bruce Busia
        ["#e51335", "#e4042e", "#d83818", "#ff2244", "#e74422", "#e11e21", "#faaf0f", "#fbb515", "#ff855f", "#191919"], // red, red, red, red, red, red, orange yellow, yellow, light red, black - Donald Judd
        ["#ece3d3", "#e51335", "#1d1d1d", "#fcc1c1"], // light gray, red, black, light pink - Kazimir Malevich

    ]

];





let palettes_hue_sorted = [

    [
        "#ff855f", "#ffe550", "#daa211", "#e7e7d7", "#e51335", "#2a72ae", "#3bb3ff", "#ffbb33", "#ff2244", "#ee5626", "#4d9db9", "#f5f5d5",
        "#7cc1c1", "#e22e82", "#e84818", "#266396", "#f2cd22", "#1b94bb", "#f34333", "#fdd666", "#ffbf0b", "#2277a7", "#fccc0c", "#4888c8"
    ], // blue / red / yellow

    [
        "#0e4a4e", "#5484a8", "#f77757", "#fccc66", "#06add6", "#f0cc0c", "#fff1d1", "#ffbf0b", "#ee3e6e", "#33936d", "#f6af06", "#eee7d7",
        "#019166", "#f8c8de", "#f2e222", "#668833", "#ef6e7e", "#f2f2e2", "#eed333", "#445e7e", "#ede8dd", "#de3e1e", "#007555", "#889979"
    ], // red / teal / green / yellow

    [
        "#d83818", "#144b5b", "#088191", "#e5fde5", "#f55b66", "#fff8e8", "#db4545", "#a6d6d6", "#004999", "#557baa", "#ff4f44", "#ffbcbc", 
        "#ebe0ce", "#242d44", "#e11e21", "#005aa5", "#5ec5ee", "#d0e0e0", "#3a6a93", "#2e3855", "#f999a9", "#044499", "#1a88c1", "#77aee7"
    ], // blue / red / white

    [
        "#1a3daa", "#244888", "#2277d7", "#62aad6", "#f2d552", "#bfffdd", "#00bbfb", "#005995", "#002044", "#b4c8ac", "#1d5256", "#9fc999",
        "#fff8f8", "#a3e3dd", "#1c6dd6", "#2c2c44", "#ffd525", "#070c0c", "#1d5581", "#004fbe", "#b0e3c4", "#fece3c", "#f8e288", "#2280b1"
    ], // blue / teal / yellow

    [
        "#445522", "#788c33", "#b5be5e", "#244e04", "#cec09c", "#505e3e", "#374727", "#2a3322", "#144b5b", "#1a966a", "#88d899", "#2a2c41",
        "#7d9aa7", "#ddd4c4", "#10244a", "#444b4e", "#ebe0ce", "#20335c", "#1c2244", "#1d1e33", "#1d5e6a", "#c0cdc8", "#f9e9d9", "#b5ab6d"
    ], // green / blue / white

    [
        "#c5e5f5", "#8d00d8", "#d722b7", "#f9c66c", "#e2e2e2", "#1f336f", "#553773", "#8b3b7b", "#3fb3aa", "#7cc7ac", "#dadaaa", "#fd5d9d",
        "#6cc6dd", "#7799aa", "#fccebb", "#550533", "#750555", "#990f5f", "#e40422", "#434394", "#ece3d3", "#ff3f7f", "#fe9e9e", "#f9f0df"
    ], // purple / teal / yellow

    [
        "#900f3f", "#c70033", "#ff5333", "#ffcc00", "#f9f0df", "#fee17c", "#ede8dd", "#d7116c", "#960422", "#f9966a", "#ff336f", "#511919",
        "#e4042e", "#d83818", "#ff2244", "#e74422", "#e11e21", "#fab6a7", "#fbb515", "#ff855f", "#191919", "#ece3d3", "#fcc1c1", "#f9ce6a"
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





let pigments = gene_pick_property(palette_pigments);
let palette = gene_pick_property(pigments);


let test_palette = palettes_hue_sorted[gene_rand_int(0, palettes_hue_sorted.length)];


