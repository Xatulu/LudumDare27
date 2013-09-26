ig.module(
	'game.entities.oldman')
.requires(
	'impact.entity',
	'game.entities.pistol')
.defines(function(){
	EntityOldman = ig.Entity.extend({
		animSheet: new ig.AnimationSheet('media/oldman.png', 16, 16),
		size: {x: 8, y: 14},
		otherText: new ig.Font('media/dfkai.font.png'),
		offset: {x: 4, y: 2},
		maxVel: {x: 0, y:0},
		flip: true,
		type: ig.Entity.TYPE.A,
		checkAgainst: ig.Entity.TYPE.A,
		collides: ig.Entity.COLLIDES.FIXED,

		init: function(x, y, settings){
			this.parent(x, y, settings);
			this.addAnim('idle', 1, [0]);
			this.addAnim('walk', 0.3, [1,2,3]);
			ig.game.tutorialstage = 1;

			ig.input.bind(ig.KEY.SPACE, 'shoot');
			this.currentAnim = this.anims.idle;
		},

		draw: function(){
			if(ig.game.tutorialstage == 1){
				this.otherText.draw("Old man: \"Hey you! Get over here!\n Use A and D to move and W to jump!\"", 160, 200, ig.Font.ALIGN.CENTER);
			}else if(ig.game.tutorialstage == 2){
				this.otherText.draw("Old man: \"Good! Now look up at the left corner of the game!\n This screen shows you your relevant stats!\nPress SPACE to learn more!\"", 160, 200, ig.Font.ALIGN.CENTER);
			}else if(ig.game.tutorialstage == 3){
				this.otherText.draw("Old man: \"You earn Experience by killing foes.\n Once you kill enough,\n you will advance to the next level and gain a Skillpoint!\nPress SPACE to learn more!\"", 160, 200, ig.Font.ALIGN.CENTER);
			}else if(ig.game.tutorialstage == 4){
				this.otherText.draw("Old man: \"You Using those skillpoints, you grow stronger!.\n By pressing 1, 2 or 3, you can increase\n either your Damage, your Hitpoints or your Mojo!\nPress SPACE to learn more!\"", 160, 200, ig.Font.ALIGN.CENTER);
			}else if(ig.game.tutorialstage == 5){
				this.otherText.draw("Old man: \"1 increases the damage your weapons deal!.\n2 increases your Hitpoints by 10.\n3 increases your Mojo powers!\nPress SPACE to learn more!\"", 160, 200, ig.Font.ALIGN.CENTER);
			}else if(ig.game.tutorialstage == 6){
				this.otherText.draw("Old man: \"Time is of essence! The evil Golgarnot.\nwill destroy the world in 10 SECONDS.\nOnly you and your Mojo can save us!\nPress SPACE to learn more!\"", 160, 200, ig.Font.ALIGN.CENTER);
			}else if(ig.game.tutorialstage == 7){
				this.otherText.draw("Old man: \"By killing foes and harnessing their powers,\nyour Mojo will dilude time and delay him!.\nPlease, stop him!\nPress SPACE to learn more!\"", 160, 200, ig.Font.ALIGN.CENTER);
			}else if(ig.game.tutorialstage == 8){
				this.otherText.draw("Old man: \"Take this pistol fight your way through his minions,\nand ultimately kill Golgarnot himself!.\nBut hurry!!\"", 160, 200, ig.Font.ALIGN.CENTER);
				if(!this.pistolspawned){
					ig.game.spawnEntity(EntityPistol, this.pos.x-5, this.pos.y+5);
					this.pistolspawned=true;
				}
			}else if(ig.game.tutorialstage == 9){
				this.otherText.draw("Old man: \"Your Mojo might allow you to turn back time,\nBut only up to this moment!\n Now go!\nPress SPACE to learn more!\"", 160, 200, ig.Font.ALIGN.CENTER);
			}else if(ig.game.tutorialstage == 10){
				this.otherText.draw("Old man: \"Leave through the door on the right.\nFollow the way, and if you find other weapons:\n You can cycle through them with TAB!\"", 160, 200, ig.Font.ALIGN.CENTER);
				this.collides = ig.Entity.COLLIDES.NEVER;
			}
			this.currentAnim.flip.x = this.flip;
			this.parent();
		},

	});
});