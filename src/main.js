let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play],
};

let game = new Phaser.Game(config);

// set UI sizes
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;

let keyF, keyR, keyLEFT, keyRIGHT;

// New Weapon implemented (accelerates slightly and when fired, can be controlled)
// Theme changed (Now titled Fishing Patrol) 60 points
// Parallax scrolling implemented : 10 points
// particle explosion on spaceship explode (or fish caught) 20 points
// time remaining in seconds displayed on screen : 10 points

