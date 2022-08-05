let app = new PIXI.Application({ width: 736, height: 550 });
document.querySelector('.game').appendChild(app.view);

// Add loading gif
let spinner = PIXI.Sprite.from('./img/ispinner.png');
spinner.anchor.set(0.5);
spinner.x = app.screen.width / 2;
spinner.y = app.screen.height / 2;
app.stage.addChild(spinner);

// Array of all cats and its features
const cats = [
    {
        name: "cat1",
        name_full: "cat1_full",
        route: "kitty_hidden.png",
        border_name: "cat1_border",
        border_route: "kitty_border.png",
        x: 397,
        y: 310,
        hitArea: [
            64, 7,
            63, 64,
            10, 73,
            6, 76,
            16, 9,
        ],
    },
    {
        name: "cat2",
        name_full: "cat2_full",
        route: "mini_cat_hidden.png",
        border_name: "cat2_border",
        border_route: "mini_cat_border.png",
        x: 609,
        y: 389,
        hitArea: [
            29, 89,
            19, 72,
            15, 1,
            25, 2,
            44, 24,
            73, 25,
            95, 6,
            104, 12,
            93, 68,
            53, 94,
        ],
    },
    {
        name: "cat3",
        name_full: "cat3_full",
        route: "cat_from_family_hidden.png",
        border_name: "cat3_border",
        border_route: "cat_from_family_border.png",
        x: 0,
        y: 171,
        hitArea: [
            0, 19,
            43, -2,
            94, 52,
            47, 91,
            0, 94,
        ],
    },
    {
        name: "cat4",
        name_full: "cat4_full",
        route: "kitty_from_family_hidden.png",
        border_name: "cat4_border",
        border_route: "kitty_from_family_border.png",
        x: 150,
        y: 75,
        hitArea: [
            8, 22,
            20, 6,
            41, 27,
            52, 80,
            14, 80,
        ],
    },
    {
        name: "cat5",
        name_full: "cat5_full",
        route: "sleeping_cat_hidden.png",
        border_name: "cat5_border",
        border_route: "sleeping_cat_border.png",
        x: 396,
        y: 431,
        hitArea: [
            37, 107,
            6, 34,
            49, 8,
            84, 8,
            130, 25,
            157, 59,
            91, 118,
        ],
    },
    {
        name: "cat6",
        name_full: "cat6_full",
        route: "black_white_cat_hidden.png",
        border_name: "cat6_border",
        border_route: "black_white_cat_border.png",
        x: 313,
        y: 249,
        hitArea: [
            44, 87,
            6, 87,
            8, 25,
            20, 6,
            38, 7,
            44, 33,
        ],
    },
    {
        name: "cat7",
        name_full: "cat7_full",
        route: "cat_paw_hidden.png",
        border_name: "cat7_border",
        border_route: "cat_paw_border.png",
        x: 54,
        y: 426,
        hitArea: [
            15, 124,
            28, 8,
            53, 9,
            124, 103,
            118, 124,
        ],
    },
    {
        name: "cat8",
        name_full: "cat8_full",
        route: "cat_tail_hidden.png",
        border_name: "cat8_border",
        border_route: "cat_tail_border.png",
        x: 123,
        y: 279,
        hitArea: [
            48, 81,
            53, 26,
            140, 7,
            181, 22,
            181, 48,
            99, 83,
        ],
    },
    {
        name: "cat9",
        name_full: "cat9_full",
        route: "brown_cat_hidden.png",
        border_name: "cat9_border",
        border_route: "brown_cat_border.png",
        x: 19,
        y: 296,
        hitArea: [
            33, 113,
            10, 96,
            8, 42,
            70, 6,
            98, 17,
            79, 94,
        ],
    },
    {
        name: "cat10",
        name_full: "cat10_full",
        route: "white_cat_hidden.png",
        border_name: "cat10_border",
        border_route: "white_cat_border.png",
        x: 509,
        y: 191,
        hitArea: [
            53, 9,
            109, 101,
            85, 150,
            26, 165,
            7, 147,
            20, 8,
        ],
    }
];

// Choose random 5 cats
const chosen_cats = [];
const chosen_cats_numbers = [];
let chosen_cats_counter = 0;
let temp_number = 0;

do {
    // Returns a random integer from 0 to 9:
    temp_number = Math.floor(Math.random() * 10);

    // Add cat to the list if it isn't already chosen
    if (!chosen_cats_numbers.includes(temp_number)) {
        chosen_cats.push(cats[temp_number]);
        chosen_cats_numbers.push(temp_number);
        chosen_cats_counter++;
    };
}
while (chosen_cats_counter < 5);

const loader = PIXI.Loader.shared; // PixiJS exposes a premade instance for you to use.

// Chainable `add` to enqueue a resource
loader.add('room', 'img/room_1.jpg')
    .add('cat_head', 'img/cat_head.png')
    .add('first_background', 'img/first_background.jpg')
    .add('background_sound', 'vintage_comedy.mp3') // Music by PianoAmor from Pixabay
    .add('meow', 'AnimalCat.mp3');
const len = chosen_cats.length;
for (let i = 0; i < len; i++) {
    loader.add(chosen_cats[i]["name_full"], "img/" + chosen_cats[i]["route"])
        .add(chosen_cats[i]["border_name"], "img/" + chosen_cats[i]["border_route"]);
};

// The `load` method loads the queue of resources, and calls the passed in callback called once all
// resources have loaded.
loader.load((loader, resources) => {
    // resources is an object where the key is the name of the resource loaded and the value is the resource object.
    // They have a couple default properties:
    // - `url`: The URL that the resource was loaded from
    // - `error`: The error that happened when trying to load (if any)
    // - `data`: The raw data that was loaded
    // also may contain other properties based on the middleware that runs.
    first_background = new PIXI.Sprite(resources.first_background.texture);
    room = new PIXI.Sprite(resources.room.texture);
    cat_head = new PIXI.Texture(resources.cat_head.texture);
    background_sound = resources.background_sound.sound;
    meow = resources.meow.sound;
    for (let i = 0; i < len; i++) {
        window[chosen_cats[i]["name_full"]] = new PIXI.Texture(resources[chosen_cats[i]["name_full"]].texture);
        window[chosen_cats[i]["border_name"]] = new PIXI.Texture(resources[chosen_cats[i]["border_name"]].texture);
    };
});

loader.onComplete.add(() => {
    // Remove spinner image
    app.stage.removeChild(app.stage.children[0]);

    // Add counter and list of found cats
    let counter = 0;
    const cat_sprites_found = [];

    // Add first background
    app.stage.addChild(first_background);

    // Add text
    const style = new PIXI.TextStyle({
        dropShadow: true,
        dropShadowBlur: 4,
        fill: "white",
        fontFamily: "\"Comic Sans MS\", cursive, sans-serif",
        fontSize: 36,
        stroke: "#545454",
        strokeThickness: 2
    });
    const start_text = new PIXI.Text('Try to find 5 cats in the room', style);
    start_text.anchor.set(0.5);
    start_text.x = app.screen.width / 2;
    start_text.y = (app.screen.height / 2) - 50;
    app.stage.addChild(start_text);

    // Add the button with label
    let btn_start = new PIXI.Graphics();
    btn_start.lineStyle(2, 0xffffff, 1);
    btn_start.beginFill(0x650A5A, 0.25);
    btn_start.drawRoundedRect(247, 304, 242, 66, 16);
    btn_start.endFill();
    btn_start.interactive = true;
    btn_start.buttonMode = true;
    btn_start.on('pointerdown', StartSearch);
    app.stage.addChild(btn_start);
    const btn_text = new PIXI.Text('Start', style);
    btn_text.x = 320;
    btn_text.y = 309;
    app.stage.addChild(btn_text);

    // When click on start button
    function StartSearch() {
        // Remove all objects
        btn_start.destroy();
        while (app.stage.children[0]) { 
            app.stage.removeChild(app.stage.children[0]); 
        };

        // Auto repeating of the main music
        background_sound.loop = true;
        background_sound.play();
        
        // Add background
        app.stage.addChild(room);

        // Empty array with all sprite objects
        const cat_sprites = [];

        for (let i = 0; i < len; i++) {
            // Create sprites of cats
            window[chosen_cats[i]["name"]] = new PIXI.Sprite(window[chosen_cats[i]["name_full"]]);

            // Add new sprite to array
            cat_sprites.push(window[chosen_cats[i]["name"]]);

            // Assign coordinates, name, corresponded border texture and hit area to each sprite
            cat_sprites[i].x = chosen_cats[i]["x"];
            cat_sprites[i].y = chosen_cats[i]["y"];
            cat_sprites[i].name = chosen_cats[i]["name"];
            cat_sprites[i].border = window[chosen_cats[i]["border_name"]];
            cat_sprites[i].hitArea = new PIXI.Polygon(chosen_cats[i]["hitArea"]);

            // Opt-in to interactivity
            cat_sprites[i].interactive = true;
            // cat_sprites[i].buttonMode = true;

            // Pointers normalize touch and mouse
            cat_sprites[i].on('pointerdown', onClick);

            app.stage.addChild(cat_sprites[i]);
        };

        // Add a rectangle for showing the score
        let cat_score = new PIXI.Graphics();
        cat_score.lineStyle(2, 0xffffff, 1);
        cat_score.beginFill(0x650A5A, 0.25);
        cat_score.drawRoundedRect(423, 5, 306, 58, 16);
        cat_score.endFill();
        app.stage.addChild(cat_score);

        // Add 5 cat heads
        for (let i = 1; i < 6; i++) {
            window["cat_head_" + i] = new PIXI.Sprite(cat_head);
            window["cat_head_" + i].x = 668 - 60 * (i - 1);
            window["cat_head_" + i].y = 13;
            // app.stage.addChild(window["cat_head_" + i]);
        };
    };

    function onClick() {
        // Meowing
        meow.play();

        // Change texture to bordered
        this.texture = this.border;
        
        // Set movement to this sprite
        let elapsed = 0.0;
        let tmp_y = this.y;
        this.cat_ticker = new PIXI.Ticker;
        this.cat_ticker.add((delta) => {
            elapsed += delta;
            this.y = (tmp_y - 25.0) + Math.cos(elapsed/20.0) * 25.0;
            if (elapsed > 125.0) {
                // Remove this cat and stop ticker
                this.visible = false;
                this.cat_ticker.stop();
            };
        });
        this.cat_ticker.start();

        // Check if this cat was already clicked
        if (!cat_sprites_found.includes(this)) {
            // Add this sprite to the list of found cats
            cat_sprites_found.push(this);

            // Refresh counter and add one cat head
            counter++;
            app.stage.addChild(window["cat_head_" + counter]);

            // Check if it was the last found cat
            if (counter >= 5) {
                // After 2 seconds
                window.setTimeout(function() {
                    // Remove all objects
                    while (app.stage.children[0]) { 
                        app.stage.removeChild(app.stage.children[0]); 
                    };

                    // Add first background
                    app.stage.addChild(first_background);

                    // Add text
                    const finish_text = new PIXI.Text('Congratulations! All cats have been found!', style);
                    finish_text.anchor.set(0.5);
                    finish_text.x = app.screen.width / 2;
                    finish_text.y = (app.screen.height / 2) - 50;
                    app.stage.addChild(finish_text);

                    // Add button with label
                    let btn_finish = new PIXI.Graphics();
                    btn_finish.lineStyle(2, 0xffffff, 1);
                    btn_finish.beginFill(0x650A5A, 0.25);
                    btn_finish.drawRoundedRect(247, 304, 242, 66, 16);
                    btn_finish.endFill();
                    btn_finish.interactive = true;
                    btn_finish.buttonMode = true;

                    // When you click on the button, the page and app will reload
                    btn_finish.on('pointerdown', function() {
                        window.location.reload();
                    });
                    
                    app.stage.addChild(btn_finish);
                    const btn_again = new PIXI.Text('New game', style);
                    btn_again.x = 280;
                    btn_again.y = 309;
                    app.stage.addChild(btn_again);
                }, 2000 );
            }
        };
    }
});
