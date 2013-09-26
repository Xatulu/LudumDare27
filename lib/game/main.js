ig.module( 
	'game.main' 
)
.requires(
	'impact.game',
	'game.levels.tutorial',
	'game.levels.level1',
	'game.levels.bossfight',
	'impact.font',
	'impact.sound',
	'game.entities.coin'
)
.defines(function(){

MyGame = ig.Game.extend({
	
	// Load a font
	gravity: 300,
	statText: new ig.Font('media/razer.font.png'),
	otherText: new ig.Font('media/dfkai.font.png'),
	scoreText: new ig.Font('media/dfkai.font.black.png'),
	score: new ig.Image('media/stats.png'),
	player: null,
	levelTimer: null,
	spawnTimer: null,
	experience: 0,
	money: 0,
	level: 1,
	weapon: 0,
	totalWeapons: 1,
	damage: 0,
	health: 0,
	timeperkill: 3,
	skillpoints: 0,
	tutorial: true,
	activeWeapon: null,
	

	init: function() {
		// Initialize your game here; bind keys etc.
		ig.input.bind(ig.KEY.A, 'left');
		ig.input.bind(ig.KEY.D, 'right');
		ig.input.bind(ig.KEY.W, 'jump');
		ig.input.bind(ig.KEY.LEFT_ARROW, 'left');
		ig.input.bind(ig.KEY.RIGHT_ARROW, 'right');
		ig.input.bind(ig.KEY.UP_ARROW, 'jump');
		ig.input.bind(ig.KEY.TAB, 'switch');
		ig.input.bind(ig.KEY.SPACE, 'shoot');
		ig.input.bind(ig.KEY.CTRL, 'shoot');
		ig.input.bind(ig.KEY._1, 'damage');
		ig.input.bind(ig.KEY._2, 'health');
		ig.input.bind(ig.KEY._3, 'time');
		this.loadLevel(LevelTutorial);
		this.player = ig.game.getEntitiesByType(EntityPlayer);
		this.levelTimer = new ig.Timer(10);
		this.spawnTimer = new ig.Timer(5);
		this.levelTimer.pause();
		this.spawnTimer.pause();
			},

	update: function() {
		// Update all entities and backgroundMaps
		this.parent();
		// Add your own, additional update code here
			if(this.levelTimer.delta()>=0){
			if(!ig.global.hardcore){
			this.loadLevelDeferred(LevelLevel1);
			this.levelTimer.set(10);
			} else {
				ig.system.setGame(StartScreen);
			}
		}
			if(this.skillpoints>0){
			if(ig.input.pressed('damage')){
				ig.game.skillpoints--;
				ig.game.damage++;
			} else if(ig.input.pressed('health')){
				ig.game.skillpoints--;
				ig.game.health++;
				this.player.health+=10;
			} else if(ig.input.pressed('time')){
				ig.game.skillpoints--;
				ig.game.timeperkill++;
			}}
			var player = this.getEntitiesByType(EntityPlayer)[0];
			if(player){
				this.screen.x = player.pos.x - ig.system.width/2 + 64;
				this.screen.y = player.pos.y - ig.system.height/2 - 32;
			}
			if(this.tutorial)
			if(ig.input.pressed('shoot')&&(this.tutorialstage == 2 || this.tutorialstage == 3 || this.tutorialstage == 4 || this.tutorialstage == 5 || this.tutorialstage == 6 || this.tutorialstage == 7|| this.tutorialstage == 9 )){
				this.tutorialstage++;
			}
			if(!this.tutorial){
				if(this.spawnTimer.delta()>=0)
					this.spawnZombies();
			}
		},

	spawnZombies: function(){
		var zombies = ig.game.getEntitiesByType(EntityEnemy);
		if(zombies.length<30){
		var amount = Math.floor((Math.random()*10)+1);
		var player = this.getEntitiesByType(EntityPlayer)[0];
		var alternate = false;
		for(var i = 1; i<=amount; i++){
			var random = Math.floor((Math.random()*2)+1);
			(alternate ? ig.game.spawnEntity(EntityEnemy, player.pos.x + 40 + Math.floor((Math.random()*80)+1), player.pos.y-16) : ig.game.spawnEntity(EntityEnemy, player.pos.x - 56 - Math.floor((Math.random()*80)+1), player.pos.y-16));
			alternate=!alternate;
		}
		if(!beaten) this.spawnTimer.reset(5);
		}
	},

	draw: function() {
		// Draw all entities and backgroundMaps
		this.parent();
		this.statText.draw("Time left: " + (-this.levelTimer.delta().round()) + " | Money: " + this.money + " $", 160, 0, ig.Font.ALIGN.CENTER);
		this.drawStats();
		if(this.beaten){
			this.statText.draw("YOU WON! YOU SAVED THE WORLD!\n ENJOY THE SPOILS OF WAR! \nBATH IN YOUR ENEMIES BLOOD\n(due to time constraints\n a real winning screen is missing, sorry)\n(thanks for playingm, hope you had fun!)\n(Xatulu)", 160, 40, ig.Font.ALIGN.CENTER);
		}
	},

	drawStats: function(){
		offsetx = 5;
		offsety = 5;
		this.score.draw(offsetx, offsety);
		var player = this.getEntitiesByType(EntityPlayer)[0];
		this.scoreText.draw("" + this.level, offsetx + 33,offsety + 11, ig.Font.ALIGN.CENTER);
			this.scoreText.draw("" + this.experience, offsetx + 33,offsety + 20, ig.Font.ALIGN.CENTER);
			this.scoreText.draw("" + (1+(Math.log(ig.game.level)*Math.pow(ig.game.level, 2)/Math.LN10).round()), offsetx + 33,offsety + 29, ig.Font.ALIGN.CENTER);
			this.scoreText.draw("" + this.damage, offsetx + 33,offsety + 38, ig.Font.ALIGN.CENTER);
			if (player){
				this.scoreText.draw("" + player.health, offsetx + 33,offsety + 47, ig.Font.ALIGN.CENTER);
			} else {
				this.scoreText.draw("0", offsetx + 33,offsety + 47, ig.Font.ALIGN.CENTER);
			}
			this.scoreText.draw("" + this.timeperkill, offsetx + 33,offsety + 56, ig.Font.ALIGN.CENTER);
			this.scoreText.draw("" + this.skillpoints, offsetx + 33,offsety + 65, ig.Font.ALIGN.CENTER);
	},
});

	StartScreen = ig.Game.extend({
		background: new ig.Image('media/background.png'),
		statText: new ig.Font('media/razer.font.png'),

		init: function(){
		ig.input.bind(ig.KEY.SPACE, 'start');
		ig.input.bind(ig.KEY.TAB, 'hardcore');
		ig.global.hardcore=false;
		ig.music.add('media/sounds/theme.ogg')
		ig.music.volume = 0.3;
		ig.music.play();
		},

		update: function(){
			if(ig.input.pressed('start')){
				ig.system.setGame(MyGame)
			}
			if(ig.input.pressed('hardcore')){
				ig.global.hardcore=!ig.global.hardcore;
			}
			this.parent();
						if(ig.input.pressed('mute')){
				ig.Sound.enabled = !ig.Sound.enabled;
			}
		},

		draw: function(){
			this.parent();
			this.background.draw(0,0);
			if(ig.global.hardcore)
				this.statText.draw("Hardcore enabled, Tread carefully", 160, 0, ig.Font.ALIGN.CENTER);
		},
	});

if(ig.ua.mobile || ig.global.mute){
	ig.Sound.enabled = false;
}
// Start the Game with 60fps, a resolution of 320x240, scaled
// up by a factor of 2
ig.main( '#canvas', StartScreen, 60, 320, 240, 2);

});
