class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        this.load.image('rocket', './Assets/Hook.png');
        this.load.image('spaceship', './Assets/gold_Fishe_1.png');
        this.load.image('water', './Assets/WaterBackground.png');
        this.load.image('stones', './Assets/stones.png');
        this.load.spritesheet('explosion', './Assets/explosion.png', {frameWidth: 64, frameHeight:32, startFrame:0, endFrame:9});
        this.load.image('blue', './Assets/blue.png');
    }

    create() {
        // stones
        this.stones = this.add.tileSprite(0, 0, 640, 480, 'stones').setOrigin(0, 0);
        // water
        this.water = this.add.tileSprite(0, 0, 640, 480, 'water').setOrigin(0, 0);
        this.water.alpha = 0.5;
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);
        // white borders
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - 32, 'rocket').setOrigin(0.5, 0);
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);        
        
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);

        // keyboard configuration
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        
        // animation configuration
        this.anims.create({
            key:'explode',
            frames: this.anims.generateFrameNumbers('explosion', {start: 0, end: 9, first: 0}),
            frameRate: 30
        });
        this.p1Score = 0;

        let particles = this.add.particles('blue');

        // Font Configuration
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        // score display
        this.scoreLeft = this.add.text(borderUISize + borderPadding,
                              borderUISize + borderPadding^2, 
                              this.p1Score, scoreConfig);
        
        let timeConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        
        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        timeConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            this.add.text(game.config.width/2, game.config.height/2, 
                'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 
                'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);
        console.log(this.clock.now);

        // Text element to show time left
        this.timeLeft = this.add.text(game.config.width - this.scoreLeft.x - 
                        borderUISize, this.scoreLeft.y, this.clock.now, timeConfig);
    }

    shipExplode(ship) {
        ship.alpha = 0;
        let particles = this.add.particles('blue');
        let emitter = particles.createEmitter();

        // emitter.explode(4, ship.x, ship.y); 
        emitter.setPosition(ship.x, ship.y);
        emitter.setSpeed(200);
        emitter.setLifespan(100);
        emitter.setScale(0.18);
        let boom = this.time.delayedCall(
            200, () => {
                ship.reset();
                ship.alpha = 1; 
                emitter.remove();
        }, null, this); 

        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;
        this.sound.play('sfx_explosion');
    }

    update() {
        // check key input for restart 
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }

        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.stones.tilePositionX -= 4;
            this.water.tilePositionX -= 10;
            this.timeLeft.text = Math.trunc(this.clock.getRemainingSeconds()).toString().substr(0, 2);
            // console.log(this.clock.getRemainingSeconds());
        } 
    }
    
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
            return true;
        } else {
            return false;
        }
    }
}
