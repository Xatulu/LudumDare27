ig.module(
	'game.entities.trigger')
.requires(
	'impact.entity')
.defines(function(){
	EntityTrigger = ig.Entity.extend({
		_wmDrawBox: true,
		_wmBoxColor: 'rgba(0, 0, 255, 0.7)',
		size: {x: 8, y: 8},
		triggerFunction: null,
		tutorialstage: null,
		checkAgainst: ig.Entity.TYPE.A,

		update: function(){},

		check: function( other ) {
			if(other instanceof EntityPlayer){
				if(ig.game.tutorialstage+1 == this.tutorialstage){
					ig.game.tutorialstage++;
					this.kill();
				}
			}
		}
	});
});