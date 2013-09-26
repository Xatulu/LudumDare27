ig.module(
	'game.entities.stats')
.requires(
	'impact.entity')
.defines(function(){
	EntityStats = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/stats.png', 40, 80),
		size: {x: 40, y: 80},
		maxVel: {x: 0, y: 0},
		type: ig.Entity.TYPE.NONE,
		checkAgainst: ig.Entity.TYPE.NONE,
		collides: ig.Entity.COLLIDES.NEVER,
		otherText: new ig.Font('media/dfkai.font.black.png'),

		init: function(x, y, settings){
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
			var level = ig.game.level;
			var xp = ig.game.experience;
			var next = Math.pow(2, ig.game.level)
			var damage = ig.game.damage;
			var health = ig.game.health;
			var timeperkill = ig.game.timeperkill;
			var skillpoints = ig.game.skillpoints;

			ig.input.bind(ig.KEY._1, 'damage');
			ig.input.bind(ig.KEY._2, 'health');
			ig.input.bind(ig.KEY._3, 'time');
		},

		update: function(){
			this.parent();
			this.level = ig.game.level;
			this.xp = ig.game.experience;
			this.next = Math.pow(2, ig.game.level)
			this.damage = ig.game.damage;
			this.health = ig.game.health;
			this.timeperkill = ig.game.timeperkill;
			this.skillpoints = ig.game.skillpoints;
			if(this.skillpoints>0){
			if(ig.input.pressed('damage')){
				ig.game.skillpoints--;
				ig.game.damage++;
			} else if(ig.input.pressed('health')){
				ig.game.skillpoints--;
				ig.game.health++;
			} else if(ig.input.pressed('time')){
				ig.game.skillpoints--;
				ig.game.timeperkill++;
			}}
		},

		draw: function(){
			this.parent();
			this.otherText.draw("" + this.level, this.pos.x + 35,this.pos.y + 11, ig.Font.ALIGN.LEFT);
			this.otherText.draw("" + this.xp, this.pos.x + 35,this.pos.y + 20, ig.Font.ALIGN.LEFT);
			this.otherText.draw("" + (this.next - this.xp), this.pos.x + 35,this.pos.y + 29, ig.Font.ALIGN.LEFT);
			this.otherText.draw("" + this.damage, this.pos.x + 35,this.pos.y + 38, ig.Font.ALIGN.LEFT);
			this.otherText.draw("" + (20 + this.health*10), this.pos.x + 30,this.pos.y + 47, ig.Font.ALIGN.LEFT);
			this.otherText.draw("" + this.timeperkill, this.pos.x + 32,this.pos.y + 56, ig.Font.ALIGN.LEFT);
			this.otherText.draw("" + this.skillpoints, this.pos.x + 35,this.pos.y + 65, ig.Font.ALIGN.LEFT);
		}
	});
});