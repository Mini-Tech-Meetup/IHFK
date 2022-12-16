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
		super({key: 'StartScene'});
	}

	init() {
		this.time.addEvent({
			delay: 1000, // 1초마다 실행
			callback: this.updateImage,
			callbackScope: this,
			loop: true
		});
	}

	preload() {
		this.load.image('where_bubble', 'assets/speech_bubble/where.png');
	}

	create() {
		console.log('StartScene.create()');
		var [x, y] = randomPosition();
		this.bubble = this.add.image(x, y, 'where_bubble').setOrigin(0.5,0.5);
	}

	update(time, delta) {
		
	}

	updateImage() {
		var [x, y] = randomPosition();
		this.bubble.destroy();
		this.bubble = this.add.image(x, y, 'where_bubble').setOrigin(0.5,0.5);
	}
	
}