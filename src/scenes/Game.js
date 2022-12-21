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
		this.load.spritesheet('character', 'assets/game_scene/Strong_Guy_Rung_SpriteSheet.png', { frameWidth: 18, frameHeight: 24 });
		this.load.spritesheet('character_attack', 'assets/game_scene/Strong_Guy_Attacks_SpriteSheet.png', { frameWidth: 27, frameHeight: 24 });
		
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
		// set scale but not interpolate
		this.player = this.physics.add.sprite(100, 450, 'character').setBounce(0.2).setScale(5,5).setCollideWorldBounds(true);

		// 이동 애니
		this.anims.create({
			key: 'move',
			frames: this.anims.generateFrameNumbers('character', {start: 0, end: 7}),
			frameRate: 10,
			repeat: -1
		});
		// 공격 애니
		this.anims.create({
			key: 'attack',
			frames: this.anims.generateFrameNumbers('character_attack', {start: 0, end: 7}),
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
		else if (this.cursors.space.isDown)
		{
			this.player.setVelocityX(0);

			this.player.anims.play('attack', true);
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