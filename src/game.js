import Phaser from './lib/phaser.js'

import GameScene from './scenes/Game.js'
import StartScene from './scenes/Start.js'

export default new Phaser.Game({
	type: Phaser.AUTO,
	width: 1080,
	height: 640,
	scene: [GameScene, StartScene],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 10 },
			debug: true
		}
	}
})
