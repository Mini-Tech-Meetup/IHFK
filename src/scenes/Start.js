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
		super('start')
	}

	init() {

	}

	preload() {
		this.load.image('where_bubble', 'assets/speech_bubble/where.png')

	}

	create() {
		console.log('StartScene.create()')
		var [x, y] = randomPosition()
		var bubble = this.add.image(x, y, 'where_bubble').setOrigin(0)

	}

	update(time, delta) {
	}
	
}