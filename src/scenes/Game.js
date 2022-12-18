import Phaser from '../lib/phaser.js'

export default class GameScene extends Phaser.Scene
{
	constructor()
	{
		super({key: 'GameScene'});
	}

	init()
	{
	}

	preload()
	{
		this.load.image('sky', 'assets/game_scene/background.png');
		this.load.image('ground', 'assets/game_scene/ground.png');
		this.load.spritesheet('character', 'assets/game_scene/character.png', { frameWidth: 72, frameHeight: 96 });
	}

	create()
	{
		console.log('GameScene.create()');
		// 배경
		this.add.image(0, 0, 'sky').setOrigin(0, 0);
		
		// 땅
		this.ground = this.physics.add.staticGroup();
		this.ground.create(400, 590, 'ground').setScale(2).refreshBody();

		// 캐릭터
		this.player = this.physics.add.sprite(100, 450, 'character').setBounce(0.2).setCollideWorldBounds(true);

		// 이동 애니
		this.anims.create({
			key: 'move',
			frames: this.anims.generateFrameNumbers('character', {start: 0, end: 7}),
			frameRate: 10,
			repeat: -1
		});


		this.cursors = this.input.keyboard.createCursorKeys();

		this.physics.add.collider(this.player, this.ground);

		window.body1 = this.player.body;
		window.physics = this.physics;
	
	}

	update(time, delta)
	{
		if (this.cursors.left.isDown)
		{
			this.player.setVelocityX(-200);

			this.player.anims.play('move', true);
		}
		else if (this.cursors.right.isDown)
		{
			this.player.setVelocityX(200);

			this.player.anims.play('move', true);
		}
		else 
		{
			this.player.setVelocityX(0);

			this.player.anims.play('move');
		}

		if (this.cursors.up.isDown && this.player.body.touching.down)
		{
			this.player.setVelocityY(-240);

		}
	}
}