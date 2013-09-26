ig.module(
	'game.entities.death')
.requires(
	'impact.entity')
.defines(function(){
	EntityDeath = ig.Entity.extend({
		_wmDrawBox: true,
		_wmBoxColor: 'rgba(0, 255, 255, 0.7)',
		size: {x: 8, y: 8},
		triggerFunction: null,
		tutorialstage: null,
		checkAgainst: ig.Entity.TYPE.BOTH,

		update: function(){},

		check: function( other ) {
			if(other instanceof EntityPlayer || other instanceof EntityEnemy){
				other.kill();
			}
		}
	});
});