import Phaser from './lib/phaser.js'
import GameScene from './scenes/Game.js'
import StartScene from './scenes/Start.js'
import { screenSize , gravity } from './config/config.js'

export default new Phaser.Game({
	type: Phaser.AUTO,
	width: screenSize.width,
	height: screenSize.height,
    pixelArt: true,
	scene: [GameScene,StartScene],
	physics: {
		default: 'arcade',
		arcade: {
			gravity: gravity,
			debug: false
		}
	}
})
