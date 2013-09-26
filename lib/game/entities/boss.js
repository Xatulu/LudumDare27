ig.module(
	'game.entities.boss')
.requires(
	'impact.entity')
.defines(function(){
	EntityBoss = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/boss.png', 48, 48),
		size: {x: 24, y: 42},
		offset: {x: 12, y: 6},
		maxVel: {x: 50, y: 50},
		flip: true,
		friction: {x: 300, y: 0},
		speed: 10,
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,	
		hitPlayer: new ig.Sound('media/sounds/hit_player.ogg'),	
		

		init: function(x, y, settings){
			this.parent(x, y, settings);
			this.addAnim('walk', .3, [1,2,3]);
			this.health=300+50*(ig.game.level-1);
		},

		update: function(){
			if (!ig.game.collisionMap.getTile(this.pos.x + (this.flip ? +4 : this.size.x -4), this.pos.y + this.size.y+1)){
				this.flip = !this.flip;
			}
			var xdir = this.flip ? -1 : 1;
			this.vel.x = this.speed * xdir;
			this.currentAnim.flip.x = this.flip;
			this.parent();
		},

		handleMovementTrace: function(res){
			this.parent(res);
			if(res.collision.x){
				this.flip = !this.flip;
			}
		},

		kill: function(){
			this.parent();
			ig.game.experience += (ig.game.level*ig.game.level);
			ig.game.levelTimer.pause();
			ig.game.spawnTimer.pause();
			ig.game.beaten = true;
			ig.game.spawnEntity(EntityExplosion, this.pos.x, this.pos.y, {particles: 100, colorOffset: 0});
		},

		check: function(other){
			other.receiveDamage(15, this);
			this.hitPlayer.play();
		},

		receiveDamage: function(value){
			this.parent(value);
			if(this.health>0){
				ig.game.spawnEntity(EntityExplosion, this.pos.x, this.pos.y, {particles: 5, colorOffset: 0});
			}
		},
	});
});