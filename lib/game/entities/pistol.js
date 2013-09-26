ig.module(
	'game.entities.pistol')
.requires(
	'impact.entity')
.defines(function(){
	EntityPistol = ig.Entity.extend({
		size: {x: 5, y: 4},
		statText: new ig.Font('media/razer.font.png'),
		animSheet: new ig.AnimationSheet('media/pistol.png', 5, 4),
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.NEVER,
		pickup: new ig.Sound('media/sounds/pickup_item.ogg'),

		init: function(x,y,settings){
			this.parent(x,y,settings);
			this.addAnim('idle', 1, [0]);
		},

		check: function(other){
			if(ig.game.weapon<1){
			ig.game.weapon=1;		
			}
			if(ig.game.totalWeapons<2)
				ig.game.totalWeapons++;
			if(ig.game.tutorialstage==8)
				ig.game.tutorialstage++;
			ig.game.activeWeapon="EntityBullet";
			other.setupAnimation(ig.game.weapon);
			this.pickup.play();
			this.kill();
		},
	});
});