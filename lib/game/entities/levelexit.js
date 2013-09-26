ig.module(
'game.entities.levelexit')
.requires(
'impact.entity'
)
.defines(function(){
	EntityLevelexit = ig.Entity.extend({
		_wmDrawBox: true,
		_wmBoxColor: 'rgba(255, 255, 0, 0.7)',
		size: {x: 8, y: 8},
		level: null,

		checkAgainst: ig.Entity.TYPE.A,

		update: function(){},

		check: function(other){
								if(ig.game.tutorialstage==10){
			if(ig.game.tutorial){
				ig.game.tutorial=false;
				ig.game.levelTimer.unpause();
				ig.game.spawnTimer.unpause();
			}
			if(other instanceof EntityPlayer){
				if(this.level){
					var levelName = this.level.replace(/^(Level)?(\w)(\w*)/, function(m, l, a, b){ 
						return a.toUpperCase() + b;
					});
					ig.game.loadLevelDeferred(ig.global['Level'+levelName]);}
				}
			}
		},
	})
})