import Phaser from '../lib/phaser.js'

import { screenSize, gravity } from '../config/config.js'

function randomPosition() {
	var screenX = screenSize.width
	var screenY = screenSize.height
	var randomX = Math.floor(Math.random() * screenX)
	var randomY = Math.floor(Math.random() * screenY)

	return [randomX, randomY]
}




export default class StartScene extends Phaser.Scene {

	constructor() {
		super({ key: 'StartScene' });
	}

	init() {
		this.time.addEvent({
			delay: 3000, 			  // ms
			callback: this.updateImage,
			callbackScope: this,
			loop: true
		});
	}

	preload() {
		this.load.image('where_bubble', 'assets/speech_bubble/where.png');
		this.load.image('start_button', 'assets/button/start_button.png');
		this.load.image('credit_button', 'assets/button/credit_button.png');
	}

	create() {
		console.log('StartScene.create()');
		this.cameras.main.setBackgroundColor('#FFFFFF');
		this.creditButton = this.add.image(550, 200, 'credit_button').setOrigin(0.5, 0.5);

		this.creditButton.setInteractive();
		this.creditButton.on('pointerdown', () => {
			// show start button
			this.startButton = this.add.image(550, 500, 'start_button').setOrigin(0.5, 0.5);
			this.startButton.setInteractive();
			this.startButton.on('pointerdown', () => {
				this.scene.start('GameScene');
			});

			this.creditButton.destroy();
		});




	}

	update(time, delta) {

	}

	updateImage() {
		var [x, y] = randomPosition();

		if (this.bubble) {
			this.bubble.x = x;
			this.bubble.y = y;
		}
		else {
			this.bubble = this.add.image(x, y, 'where_bubble').setOrigin(0.5, 0.5);
			this.bubble.setDepth(-1);
		}
	}

}