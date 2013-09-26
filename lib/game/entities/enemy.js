ig.module(
	'game.entities.enemy')
.requires(
	'impact.entity')
.defines(function(){
	EntityEnemy = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/zombie.png', 16, 16),
		size: {x: 8, y: 14},
		offset: {x: 4, y: 2},
		maxVel: {x: 100, y: 100},
		flip: true,
		friction: {x: 150, y: 0},
		speed: 14,
		type: ig.Entity.TYPE.B,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.PASSIVE,	
		hitPlayer: new ig.Sound('media/sounds/hit_player.ogg'),	
		

		init: function(x, y, settings){
			this.parent(x, y, settings);
			this.addAnim('walk', .3, [1,2,3]);
			this.health=10+1*ig.game.level;
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
			ig.game.experience += ((ig.game.level*ig.game.level)/(ig.game.level*2)).round();
			var random = Math.floor((Math.random()*10)+1);
			switch(random){
				case(0):
				case(1):
				case(2):
				case(3):
					ig.game.spawnEntity(EntityCoin, this.pos.x, this.pos.y, false);
					break;
			}
			ig.game.levelTimer.set(ig.game.timeperkill-ig.game.levelTimer.delta());
			ig.game.spawnEntity(EntityExplosion, this.pos.x, this.pos.y, {colorOffset: 0});
		},

		check: function(other){
			other.receiveDamage(10, this);
			this.hitPlayer.play();
		},

		receiveDamage: function(value){
			this.parent(value);
			if(this.health>0){
				ig.game.spawnEntity(EntityExplosion, this.pos.x, this.pos.y, {particles: 2, colorOffset: 0});
			}
		},
	});
});