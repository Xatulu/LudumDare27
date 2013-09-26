ig.module(
	'game.entities.coin')
.requires(
	'impact.entity',
	'impact.sound')
.defines(function(){
	EntityCoin = ig.Entity.extend({
		size: {x: 8, y: 8},
		animSheet: new ig.AnimationSheet('media/coin.png',8,8),
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,
		coinSFX: new ig.Sound('media/sounds/coin.ogg'),

		init: function(x,y,settings){
			this.parent(x,y,settings);
			this.addAnim('idle', 1, [0]);
			ig.soundManager.volume = 0.1;
		},

		check: function(other){
			ig.game.money += 10;
			this.coinSFX.play();
			this.kill();
		},
	});
});