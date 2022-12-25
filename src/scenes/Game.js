import Phaser from '../lib/phaser.js'

export default class GameScene extends Phaser.Scene {

	// hit count variable
	hitCount = {};
	breakedKioskNumber = 0;


	constructor() {
		super({ key: 'GameScene' });
	}

	init() {
	}

	preload() {
		this.load.image('sky', 'assets/game_scene/background.png');
		this.load.image('ground', 'assets/game_scene/ground.png');
		this.load.spritesheet('kiosk', 'assets/market/kiosk.png', { frameWidth: 68, frameHeight: 128 });
		this.load.image('shop', 'assets/market/shop.png');
		this.load.spritesheet('character', 'assets/game_scene/Strong_Guy_Rung_SpriteSheet.png', { frameWidth: 18, frameHeight: 24 });
		this.load.spritesheet('character_attack', 'assets/game_scene/Strong_Guy_Attacks_SpriteSheet.png', { frameWidth: 27, frameHeight: 24 });
	}

	create() {
		this.setupEvents();
		this.setupAnims();
		this.setupResources();

		this.generateKiosk()
	}


	update(time, delta) {
		if (this.cursors.space.isDown) {
			this.player.setVelocityX(0);
			this.player.anims.play('attack', true);
		}
		else if (this.cursors.left.isDown) {
			this.player.setVelocityX(-200);
			this.player.flipX = true;
			this.player.anims.play('move', true);
		}
		else if (this.cursors.right.isDown) {
			this.player.setVelocityX(200);
			this.player.flipX = false;
			this.player.anims.play('move', true);
		}

		else {
			this.player.setVelocityX(0);

			this.player.anims.play('move');
		}

		if (this.cursors.up.isDown && this.player.body.touching.down) {
			this.player.setVelocityY(-240);

		}
	}

	setupAnims() {
		// 이동 애니
		this.anims.create({
			key: 'move',
			frames: this.anims.generateFrameNumbers('character', { start: 0, end: 7 }),
			frameRate: 50,
			repeat: -1
		});
		// 공격 애니
		this.anims.create({
			key: 'attack',
			frames: this.anims.generateFrameNumbers('character_attack', { start: 0, end: 7 }),
			frameRate: 50,
			repeat: -1
		});

		let kioskAnimFrams = [{ start: 1, end: 2 }, { start: 2, end: 3 }, { start: 3, end: 4 }]

		//foreach
		kioskAnimFrams.forEach((frame, index) => {
			this.anims.create({
				key: `kioskState${index + 1}`,
				frames: this.anims.generateFrameNumbers('kiosk', frame),
				frameRate: 10,
				repeat: -1
			});
		});
	}

	setupResources() {
		// 배경
		this.add.image(0, 0, 'sky').setOrigin(0, 0);

		// 샵
		this.add.image(800, 410, 'shop').setScale(1.5, 1.5);

		// 땅
		this.ground = this.physics.add.staticGroup();
		this.ground.create(400, 590, 'ground').setScale(2).refreshBody();

		// 캐릭터
		this.player = this.physics.add.sprite(100, 450, 'character').setBounce(0.2).setScale(5, 5).setCollideWorldBounds(true);

		this.cursors = this.input.keyboard.createCursorKeys();

		this.physics.add.collider(this.player, this.ground);


		this.hitbox = this.add.rectangle(0, 0, 64, 64, 0xffffff).setVisible(false);
		this.physics.add.existing(this.hitbox, false);
		this.hitbox.body.setCollideWorldBounds(true);
		this.hitbox.body.allowGravity = false;


		window.body1 = this.player.body;
		window.physics = this.physics;
	}

	setupEvents() {
		this.time.addEvent({
			delay: 8000, 			  // ms
			callback: this.generateKiosk,
			callbackScope: this,
			loop: true
		});

		this.input.keyboard.on('keydown-SPACE', function (event) {
			console.log('space down');
			let offset = this.player.flipX ? -30 : 30;
			this.hitbox.setPosition(this.player.x + offset, this.player.y);
		}, this);


		this.input.keyboard.on('keyup-SPACE', function (event) {
			console.log('space up');
			this.hitbox.setPosition(0, 0);
		}, this);

	}

	generateKiosk() {
		console.log('kiosk');
		let x = Phaser.Math.Between(100, 800);
		let kiosk = this.physics.add.sprite(x, 200, 'kiosk').setPushable(false);
		let uuid = Phaser.Math.RND.uuid();
		kiosk.setName(uuid);
		this.physics.add.collider(kiosk, this.ground);
		this.physics.add.collider(this.player, kiosk);
		// overlap event
		this.physics.add.overlap(this.hitbox, kiosk, this.hitKiosk, null, this);
	}


	hitKiosk(player, kiosk) {
		console.log('hit kiosk');

		let name = kiosk.name
		if (this.hitCount[name] === undefined) {
			this.hitCount[name] = 0;
		}
		this.hitCount[name]++;
		console.log(this.hitCount[name]);
		console.log(this.hitCount)

		// anims change
		let index = this.selectKioskAnimsIndex(this.hitCount[name]);
		if (index > 0) {
			kiosk.anims.play(`kioskState${index}`, true);
		}

		if (this.hitCount[name] >= 100) {
			kiosk.destroy();
			this.breakedKioskNumber++;
		}
	}

	selectKioskAnimsIndex(hit) {
		let index = 0;
		if (hit >= 25) {
			index = 1;
		}
		if (hit >= 50) {
			index = 2;
		}
		if (hit >= 75) {
			index = 3;
		}
		return index;
	}
}