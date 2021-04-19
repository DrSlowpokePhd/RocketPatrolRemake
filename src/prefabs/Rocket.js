class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
        this.isFiring = false;
        this.accelerate = true;
        this.moveSpeed = (this.accelerate) ? 1 : 2; 
        this.xMoveSpeed = 2;
        this.acceleration = 1;
        this.maxSpeed = 5;
        this.reset();
        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    update() {
        if(!this.isFiring) {
            // check to see if acceleration is enabled
            if (this.accelerate) {
                this.moveSpeed = 1; // reset moveSpeed to initial value when not firing
            }
            // x axis movement when not firing
            if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.xMoveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width -
              borderUISize - this.width) {
                this.x += this.xMoveSpeed;
            }
        }

        if (Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play();  // play sfx
        } 

        if (this.isFiring && this.y >= borderUISize * 3 + borderPadding) {
            if (this.accelerate) { // accelerate at rate of this.acceleration
                this.moveSpeed += this.acceleration;
            }
            if (this.moveSpeed > this.maxSpeed) {
                this.moveSpeed = this.maxSpeed;
            }
            this.y -= this.moveSpeed;
            if (keyLEFT.isDown && this.x >= borderUISize + this.width) {
                this.x -= this.xMoveSpeed;
            } else if (keyRIGHT.isDown && this.x <= game.config.width -
              borderUISize - this.width) {
                this.x += this.xMoveSpeed;
            }
        } 

        if (this.y <= borderUISize * 3 + borderPadding) {
            this.reset();
        }
    }

    reset() {
        this.isFiring = false;
        this.y = game.config.height - borderUISize - borderPadding;
    }
}
