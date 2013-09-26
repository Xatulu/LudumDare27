ig.module(
	'game.entities.player'
)
.requires(
	'impact.entity')
	.defines(function(){
		EntityPlayer = ig.Entity.extend({
			animSheet: new ig.AnimationSheet('media/player.png', 16, 16),
			maxVel: {x: 75, y: 100},
			friction: {x: 600, y: 0},
			accelGround: 400,
			accelAir: 200,
			jump: 200,
			size: {x: 9, y:14},
			offset: {x: 3, y: 2},
			startPosition: null,
			flip: false,
			invincible: true,
			invincibleDelay: 2,
			zIndex: 50,
			invincibleTimer: null,
			type: ig.Entity.TYPE.A,
			checkAgainst: ig.Entity.TYPE.NONE,
			collides: ig.Entity.COLLIDES.ACTIVE,
			jumpPlayer: new ig.Sound('media/sounds/jump_player.ogg'),
			levelup: new ig.Sound('media/sounds/levelup.ogg'),
			bulletTimer: new ig.Timer(),

			setupAnimation: function(offset){
				offset = offset * 6;
				this.addAnim('idle', 1, [0+offset]);
				this.addAnim('run', .3, [1+offset, 2+offset, 3+offset]);
				this.addAnim('jump', 0.5, [4+offset, 5+offset]);
				this.addAnim('fall', 0.5, [5+offset, 4+offset]);
			},

			init: function(x, y, settings){
				this.startPosition = {x:x,y:y};
				this.parent(x, y, settings);
				this.setupAnimation(ig.game.weapon);
				this.invincibleTimer = new ig.Timer();
				this.makeInvincible(2);
				this.health = 20 + ig.game.health*10;
			},

			update: function(){
				var accel = this.standin ? this.accelGround : this.accelAir;
				var delay = 0;
									switch(ig.game.weapon){
						case(0):
							delay = 0;
							break;
						case(1):
							delay = 0.33;
							break;
						case(2):
							delay = 1;
							break;
						case(3):
							delay = 0.66;
					}
				if(ig.input.state('left')){
					this.accel.x = -accel;
					this.flip = true;
				} else if(ig.input.state('right')){
					this.accel.x = accel;
					this.flip = false;
				} else {
					this.accel.x = 0;
				}
				if(this.standing && ig.input.pressed('jump')){
					this.vel.y = -this.jump;
					this.jumpPlayer.volume=0.5;
					this.jumpPlayer.play();
				}
				if(ig.game.activeWeapon!=null && ig.input.state('shoot') && !ig.game.tutorial){
					if(this.bulletTimer.delta()>delay){
					ig.game.spawnEntity(ig.game.activeWeapon, this.pos.x, this.pos.y, {flip:this.flip});
					this.bulletTimer.reset();
				}
				}
				if(ig.input.pressed('switch')){
					ig.game.weapon++;
					if(ig.game.weapon>=ig.game.totalWeapons)
						ig.game.weapon=0;
					switch(ig.game.weapon){
						case(0):
							ig.game.activeWeapon = null;
							break;
						case(1):
							ig.game.activeWeapon = "EntityBullet";
							break;
						case(2):
							ig.game.activeWeapon = "EntityShotgunBullet";
							break;
						case(3):
							ig.game.activeWeapon = "EntityRocket";
					}
					this.setupAnimation(ig.game.weapon);
				}
				if ( this.vel.y < 0){
					this.currentAnim = this.anims.jump;
				} else if (this.vel.y > 0){
					this.currentAnim = this.anims.fall;
				} else if (this.vel.x != 0){
					this.currentAnim = this.anims.run;
				} else {
					this.currentAnim = this.anims.idle;
				}
				if(ig.game.experience>= 1+(Math.log(ig.game.level)*Math.pow(ig.game.level, 2)/Math.LN10).round()){
					ig.game.level++;
					ig.game.skillpoints++;
					ig.game.experience=0;
					this.levelup.play();
				}
				this.currentAnim.flip.x = this.flip;
				if(this.invincibleTimer.delta() > this.invincibleDelay){
					this.invincible = false;
					this.currentAnim.alpha = 1;
				};
				this.parent();
			},

			kill: function(){
				this.parent();
				if(!ig.global.hardcore){
				var x = this.startPosition.x;
				var y = this.startPosition.y;
				ig.game.spawnEntity(EntityExplosion, this.pos.x, this.pos.y, {callBack:function(){ig.game.spawnEntity(EntityPlayer, x, y)}});
				} else {
					ig.system.setGame(StartScreen);
				}
			},

			makeInvincible: function(){
				this.invincible = true;
				this.invincibleTimer.reset();
			},

			receiveDamage: function(amount, from){
				if(this.invincible)
					return;
				this.parent(amount, from);
			},

			draw: function(){
				if(this.invincible)
					this.currentAnim.alpha = this.invincibleTimer.delta()/this.invincibleDelay * 1;
				this.parent();
			}
		});
	EntityBullet = ig.Entity.extend({
		size: {x: 5, y: 5},
		animSheet: new ig.AnimationSheet('media/bullet.png', 5, 5),
		maxVel: {x: 200, y: 0},
		lifetime: 0.5,
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.B,
		collides: ig.Entity.COLLIDES.NEVER,
			pistolShoot: new ig.Sound('media/sounds/pistol_shoot.ogg'),
			hitEnemy: new ig.Sound('media/sounds/hit_enemy.ogg'),

		init: function(x,y, settings){
			this.parent( x+ (settings.flip ? -4 : 8), y+7, settings);
			this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
			this.addAnim('idle', 0.2, [0]);
			this.timer = new ig.Timer();
			this.pistolShoot.volume=0.2;
			this.pistolShoot.play();
		},

		handleMovementTrace: function(res){
			this.parent(res);
			if(res.collision.x || res.collision.y || this.timer.delta()>this.lifetime){
				this.kill();
			}
		},

		check: function(other){
			other.receiveDamage(3+(ig.game.damage*2	), this);
			this.kill();
			this.hitEnemy.volume=0.2;
			this.hitEnemy.play();
		},

	});
	EntityRocket = ig.Entity.extend({
		size: {x: 5, y: 5},
		animSheet: new ig.AnimationSheet('media/rocket.png', 5, 5),
		maxVel: {x: 150, y: 0},
		lifetime: 1,
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.B,
		collides: ig.Entity.COLLIDES.NEVER,
			rocketExplosion: new ig.Sound('media/sounds/rocket_explosion.ogg'),
			rocketShoot: new ig.Sound('media/sounds/rocket_shoot.ogg'),

		init: function(x,y, settings){
			this.parent( x+ (settings.flip ? -4 : 8), y+7, settings);
			this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x/2 : this.maxVel.x/2);
			this.addAnim('idle', 0.2, [0]);
			this.timer = new ig.Timer();
			this.currentAnim.flip.x = this.flip;
			this.rocketShoot.volume=0.8;
			this.rocketShoot.play();
		},

		handleMovementTrace: function(res){
			this.parent(res);
			if(res.collision.x || res.collision.y || this.timer.delta()>this.lifetime ){
				this.kill();
			}
		},

		check: function(other){
			other.receiveDamage(9+(ig.game.damage*1), this);
			this.kill();
			this.rocketExplosion.volume=0.7;
			this.rocketExplosion.play();
		},

	});
	EntityShotgunBullet = ig.Entity.extend({
		size: {x: 5, y: 5},
		animSheet: new ig.AnimationSheet('media/bullet.png', 5, 5),
		maxVel: {x: 100, y: 0},
		lifetime: 0.5,
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.B,
		collides: ig.Entity.COLLIDES.NEVER,
			hitEnemy: new ig.Sound('media/sounds/hit_enemy.ogg'),
			shotgunShoot: new ig.Sound('media/sounds/shotgun_shoot.ogg'),

		init: function(x,y, settings){
			this.parent( x+ (settings.flip ? -4 : 8), y+7, settings);
			this.vel.x = this.accel.x = (settings.flip ? -this.maxVel.x : this.maxVel.x);
			this.addAnim('idle', 0.2, [0]);
			this.timer = new ig.Timer();
			this.shotgunShoot.volume=0.4;
			this.shotgunShoot.play();
		},

		handleMovementTrace: function(res){
			this.parent(res);
			if(res.collision.x || res.collision.y || this.timer.delta()>this.lifetime ){
				this.kill();
			}
		},

		check: function(other){
			other.receiveDamage(6+(ig.game.damage*3), this);
			this.kill();
			this.hitEnemy.volume=0.5;
			this.hitEnemy.play();
		},

	});
    EntityExplosion = ig.Entity.extend({
    	lifetime: 1,
    	callBack: null,
    	particles: 40,

    	init: function(x, y, settings){
    		this.parent(x, y, settings);
    		for(var i=0; i < this.particles; i++)
    			ig.game.spawnEntity(EntityExplosionParticle, x, y, {colorOffset: settings.colorOffset ? settings.colorOffset : 0});
    		this.Timer = new ig.Timer();
    	},

    	update: function(){
    		if(this.Timer.delta()>this.lifetime){
    			this.kill();
    			if(this.callBack)
    				this.callBack();
    			return;
    		}
    	}
    });
    EntityExplosionParticle = ig.Entity.extend({
    	size: {x: 2, y: 2},
    	maxVel: {x: 160, y: 200},
    	lifetime: 2,
    	fadetime: 1,
    	bounciness: 0,
    	vel: {x: 100, y: 30},
    	friction: {x: 100, y: 0},
    	collides: ig.Entity.COLLIDES.LITE,
    	colorOffset: 0,
    	totalColors: 15,
    	animSheet: new ig.AnimationSheet('media/blood.png',2,2),

    	init: function(x,y,settings){
    		this.parent(x,y,settings);
    		var frameID = Math.round(Math.random()*this.totalColors)+(this.colorOffset * (this.totalColors+1));
    		this.addAnim('idle', 0.2, [frameID]);
    		this.vel.x = (Math.random() * 2 - 1) * this.vel.x;
    		this.vel.y = (Math.random() * 2 - 1) * this.vel.y;
    		this.Timer = new ig.Timer();
    	},

    	update: function(){
    		if(this.Timer.delta()>this.lifetime){
    			this.kill();
    			return;
    		}
    		this.currentAnim.alpha = this.Timer.delta().map(this.lifetime-this.fadetime, this.lifetime, 1, 0);
    		this.parent();
    	}
    });
});