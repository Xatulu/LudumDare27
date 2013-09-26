ig.module(
	'game.entities.deathzombie')
.requires(
	'impact.entity')
.defines(function(){
	EntityDeathzombie = ig.Entity.extend({
		_wmDrawBox: true,
		_wmBoxColor: 'rgba(0, 255, 255, 0.7)',
		size: {x: 8, y: 8},
		triggerFunction: null,
		tutorialstage: null,
		checkAgainst: ig.Entity.TYPE.B,

		update: function(){},

		check: function( other ) {
			if(other instanceof EntityEnemy){
				other.kill();
			}
		}
	});
});