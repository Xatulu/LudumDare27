ig.module(
	'game.entities.shotgun')
.requires(
	'impact.entity')
.defines(function(){
	EntityShotgun = ig.Entity.extend({
		size: {x: 11, y: 10},
		animSheet: new ig.AnimationSheet('media/shotgun.png', 11, 10),
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,
		pickup: new ig.Sound('media/sounds/pickup_item.ogg'),

		init: function(x,y,settings){
			this.parent(x,y,settings);
			this.addAnim('idle', 1, [0]);
		},

		check: function(other){
			if(ig.game.totalWeapons<3 && ig.game.money>=100){
				ig.game.weapon=2;
				ig.game.totalWeapons++;
				ig.game.activeWeapon="EntityShotgunBullet";
				other.setupAnimation(ig.game.weapon);
				this.kill();
				this.pickup.play();
				ig.game.money-=100;
			}
		},
	});
});