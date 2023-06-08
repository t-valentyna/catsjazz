let canvas, ctx;

window.onload = init;

const assetsToLoadURLs = {
    'room': 'img/room_1.jpg',
    'firstBackground': 'img/first_background.jpg',
    'catHead': 'img/cat_head.png',
    'backgroundSound': 'vintage_comedy.mp3',
    'meow': 'AnimalCat.mp3'
};

class Cat {
    constructor(catObj) {
        
        this.name = new Image();
        this.name.src = 'img/' + catObj.route;
       
        this.border = new Image();
        this.border.src = 'img/' + catObj.border_route;
        
        this.x = catObj.x;
        this.y = catObj.y;
        this.initialY = catObj.y;
        this.hitArea = catObj.hitArea;

        this.display = true;
        this.move = false;
        this.sprite = this.name;

        this.elapsed = 0.0;

        this.boundClickHandler = this.clicked.bind(this);

        // console.log("Cat loaded");
    }

    clicked(event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;

        // Begin a new path
        ctx.beginPath();

        // Define the polygon path using the hitArea
        ctx.moveTo(this.x + this.hitArea[0], this.y + this.hitArea[1]);
        for (let i = 2; i < this.hitArea.length; i+= 2) {
            ctx.lineTo(this.x + this.hitArea[i], this.y + this.hitArea[i + 1]);
        }
        ctx.closePath();
      
        // Check if the click was inside the cat
        if (ctx.isPointInPath(mouseX, mouseY)) {
            canvas.removeEventListener('click', this.boundClickHandler);
            this.move = true;
            this.sprite = this.border;

            // Meowing
            loadedAssets.meow.currentTime = 0;
            loadedAssets.meow.play();
        }
    }

    moving() {
        // Update the counter of found cats in the first step of moving
        if (this.elapsed === 0) {
            counterOfFoundCats++;
        }

        this.elapsed += 1;
        this.y = (this.initialY - 25.0) + Math.cos(this.elapsed/20.0) * 25.0;
        if (this.elapsed > 125.0) {
            // Remove this cat
            this.display = false;
        };
    }
}

let animationFrameId;

let loadedAssets;
const chosenCats = [];
let counterOfFoundCats = 0;


function init() {
    // Get JSON file and choose 5 cats 
    fetch('./cats.json')
        .then(response => response.json())
        .then(data => {
        const cats = data;
        const chosenCatsNumbers = [];
        let chosenCatsCounter = 0;
        let tempNumber = 0;

        do {
            // Returns a random integer from 0 to 9:
            tempNumber = Math.floor(Math.random() * 10);

            // Add cat to the list if it isn't already chosen
            if (!chosenCatsNumbers.includes(tempNumber)) {
                chosenCats.push(cats[tempNumber]);
                chosenCatsNumbers.push(tempNumber);
                chosenCatsCounter++;
            };
        }
        while (chosenCatsCounter < 5);

    // console.log(chosenCats);

    // Load assets and then start game
    loadAssets(startGame);
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function startGame(assetsReadyToBeUsed) {
    // We're ready to use all sounds, images, musics etc
    loadedAssets = assetsReadyToBeUsed;
    // console.log(assetsReadyToBeUsed);

    drawFirstBackground();
}

function drawFirstBackground() {
    // Remove loader
    document.querySelector('#loader').style.display = "none";

    canvas = document.querySelector('#myCanvas');
    ctx = canvas.getContext('2d');

    ctx.drawImage(loadedAssets.firstBackground, 0, 0);

    drawText('Try to find 5 cats in the room', 225);
    drawButton('Start', StartSearch);
}

function StartSearch() {
    // Turn on the music
    loadedAssets.backgroundSound.loop = true;
    loadedAssets.backgroundSound.play();

    // Make cats clickable
    for (let cat in loadedAssets.cats) {
        canvas.addEventListener('click', loadedAssets.cats[cat].boundClickHandler);
    }

    animationFrameId = requestAnimationFrame(mainLoop);
}

function mainLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(loadedAssets.room, 0, 0);
    // console.log(loadedAssets);

    // Draw cats and move them for next drawing
    for (let cat in loadedAssets.cats) {
        if (loadedAssets.cats[cat].display) {
            ctx.drawImage(loadedAssets.cats[cat].sprite, loadedAssets.cats[cat].x, loadedAssets.cats[cat].y);

            if (loadedAssets.cats[cat].move) {
                loadedAssets.cats[cat].moving();
            }
        }
    }

    // Draw a rectangle for showing the score
    drawRoundedRect(423, 5, 306, 58, 16);

    // Add 5 cat heads
    for (let i = 0; i < counterOfFoundCats; i++) {
        ctx.drawImage(loadedAssets.catHead, 668 - 60 * i, 13);
    }

    // Check if it was the last found cat
        if (counterOfFoundCats >= 5) {
            // After 2 seconds
            setTimeout(gameOver, 2000);
        }

    // ask for a new animation frame
    animationFrameId = requestAnimationFrame(mainLoop);
}

function gameOver() {
    // Stop the animation frame
    cancelAnimationFrame(animationFrameId);

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(loadedAssets.firstBackground, 0, 0);

    drawText('Congratulations! All cats have been found!', 225);
    drawButton('New game', StartNewGame);
}

function StartNewGame() {
    window.location.reload();
}

function drawText(text, y) {
    ctx.save();

    ctx.font = `36px "Comic Sans MS", cursive, sans-serif`;
    ctx.fillStyle = 'white';
    ctx.strokeStyle = '#545454';
    ctx.lineWidth = 2;
    ctx.shadowBlur = 4;
    ctx.shadowColor = 'black';
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;

    // Calculate the x coordinate of the starting point of the text
    const textWidth = ctx.measureText(text).width;
    const x = canvas.width / 2 - textWidth / 2;

    ctx.strokeText(text, x, y);
    ctx.fillText(text, x, y);

    ctx.restore();
}

function drawRoundedRect(x, y, width, height, radius) {
    ctx.save();
    ctx.fillStyle = "rgba(101,10,90, 0.25)";
    ctx.strokeStyle = "rgb(255,255,255)";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.arcTo(x + width, y, x + width, y + radius, radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
    ctx.lineTo(x + radius, y + height);
    ctx.arcTo(x, y + height, x, y + height - radius, radius);
    ctx.lineTo(x, y + radius);
    ctx.arcTo(x, y, x + radius, y, radius);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.restore();
}

function drawButton(text, action) {
    ctx.save();

    // Draw the rounded rectangle
    const x = 247;
    const y = 304;
    const width = 242;
    const height = 66;
    const radius = 16;

    drawRoundedRect(x, y, width, height, radius);

    drawText(text, 349);

    ctx.restore();

    // Add a click event listener to the canvas
    canvas.addEventListener('click', buttonClicked);
    
    function buttonClicked(event) {
        const mouseX = event.offsetX;
        const mouseY = event.offsetY;
      
        // Check if the click was inside the button
        if (mouseX >= x && mouseX <= x + width &&
            mouseY >= y && mouseY <= y + height) {
                canvas.removeEventListener('click', buttonClicked);
                action();
        }
    }
}

function loadAssets(callback) {
    // here we should load the sounds, the sprite sheets etc.
    // then at the end call the callback function    
    loadAssetsUsingHowlerAndNoXhr(assetsToLoadURLs, callback);
}

function isImage(url) {
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

function isAudio(url) {
    return (url.match(/\.(mp3|ogg|wav)$/) != null);
}

function loadAssetsUsingHowlerAndNoXhr(assetsToBeLoaded, callback) {
    let assetsLoaded = {};
    let loadedAssets = 0;
    let numberOfAssetsToLoad = 10;

    // define ifLoad function
    let ifLoad = function () {
        if (++loadedAssets >= numberOfAssetsToLoad) {
            callback(assetsLoaded);
        }
        // console.log("Loaded asset " + loadedAssets);
    };

    // get num of assets to load
    for (let name in assetsToBeLoaded) {
        numberOfAssetsToLoad++;
    }

    // console.log("Nb assets to load: " + numberOfAssetsToLoad);

    for (let name in assetsToBeLoaded) {
        // console.log(assetsLoaded);
        let url = assetsToBeLoaded[name];
        // console.log("Loading " + url);
        if (isImage(url)) {
            assetsLoaded[name] = new Image();

            assetsLoaded[name].onload = ifLoad;
            // will start async loading. 
            assetsLoaded[name].src = url;
        } else {
            // We assume the asset is an audio file
            // console.log("loading " + name + " buffer : " + assetsToBeLoaded[name].loop);
            assetsLoaded[name] = new Audio(url);
            assetsLoaded[name].addEventListener('canplaythrough', function() {
                ifLoad();
              });
        } // if

    }

    // Load cats
    console.log(chosenCats);
    assetsLoaded.cats = {};
    for (let cat of chosenCats) {
        // console.log(cat);
        assetsLoaded.cats[cat.name_full] = new Cat(cat);
        assetsLoaded.cats[cat.name_full].name.onload = ifLoad; 
        assetsLoaded.cats[cat.name_full].border.onload = ifLoad; 
    }
    // console.log(assetsLoaded);
}
