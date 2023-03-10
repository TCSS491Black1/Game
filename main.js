var gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
// queue all assets.
[
	"./assets/hornet.png", // main character
	"./assets/hornetattack.png",
	
	"./assets/Uoma.png", // enemies
	"./assets/Heavy_Sentry.png",
	"./assets/Fire_Wheel.png",
	"./assets/Purple_Wheel.png",
	"./assets/LightPurple_Wheel.png",
	"./assets/Yellow_Wheel.png",
	"./assets/Blue_Wheel.png",
	"./assets/Green_Wheel.png",
	"./assets/Hive_Knight.png",
	"./assets/HiveKnight.png", // modified version of Hive_Knight.png

	"./assets/Charged_Lumafly.png",// powerups
	"./assets/Gathering_Swarm.png",
	"./assets/Lightseed.png",

	"./assets/Overworld_Level_1_blue.png", // backgrounds
	"./assets/Overworld_Level_1.png", 
	"./assets/Underground_Level_2.png",
	"./assets/IceLevel_3_black.png",
	"./assets/IceLevel3.png",
	"./assets/HellLevel4.png",
	"./assets/Level1ParallaxFlowers.png",
	"./assets/Level2ParallaxBoulders.png",
	"./assets/Level3ParallaxPillars.png",

	"./assets/Environmental_Blocks.png", // various blocks/ground
	"./assets/Dirt_Block.png",
	"./assets/lava_7.png",
	"./assets/arrows.png",
	"./assets/sword.png",
	"./assets/block.png",
	"./assets/ice-block.png",
	"./assets/Pit_Glow.png",
	
	"./assets/sounds/music/intro.mp3", // music sound assets
	// "./assets/sounds/music/main-1-quiet.mp3",
	// "./assets/sounds/music/main-2-quiet.mp3",
	// "./assets/sounds/music/ver-1.mp3",
	// "./assets/sounds/music/ver-2.mp3",
	"./assets/sounds/music/end-1.mp3",
	"./assets/sounds/music/end-2.mp3",
	// "./assets/sounds/music/drumloop.mp3",
	// "./assets/sounds/music/fadein.mp3",
	"./assets/sounds/music/dream-requiem-anticipate-heavy.mp3",
	"./assets/sounds/music/dream-requiem-anticipate.mp3",
	"./assets/sounds/music/dream-requiem-bridge.mp3",
	"./assets/sounds/music/dream-requiem-fluteup.mp3",
	"./assets/sounds/music/dream-requiem-intro.mp3",
	"./assets/sounds/music/dream-requiem-sparkle.mp3",
	"./assets/sounds/music/dream-requiem-strfkr.mp3",
	// "./assets/sounds/music/ver-1.mp3",
	// "./assets/sounds/music/ver-2.mp3",
	"./assets/sounds/music/end-1.mp3",
	"./assets/sounds/music/end-2.mp3",


	"./assets/sounds/sfx/attack.wav",
	"./assets/sounds/sfx/step.wav",
	"./assets/sounds/sfx/collide.wav",
	"./assets/sounds/sfx/drop.wav",
	"./assets/sounds/sfx/hit.wav",
	"./assets/sounds/sfx/jump.wav",
	"./assets/sounds/sfx/laser.wav",
	"./assets/sounds/sfx/stab.wav",
	"./assets/sounds/sfx/step.wav",
	"./assets/sounds/sfx/trill.wav",

	"./assets/sounds/character/hive-jump1.wav", // character sound assets
	"./assets/sounds/character/hive-jump2.wav",
	"./assets/sounds/character/hive-jump3.wav",
	"./assets/sounds/character/hornet-jump1.wav",
	"./assets/sounds/character/hornet-jump2.wav",
	"./assets/sounds/character/hornet-jump3.wav",
	"./assets/sounds/character/hornet-jumpland1.wav",
	"./assets/sounds/character/hornet-jumpland2.wav",
	"./assets/sounds/character/hornet-dash1.wav",
	"./assets/sounds/character/hornet-dash2.wav",
	"./assets/sounds/character/hornet-swordhit1.wav",
	"./assets/sounds/character/hornet-swordhit2.wav",
	"./assets/sounds/character/hornet-swordhit3.wav",
	"./assets/sounds/character/hornet-swordmiss1.wav",
	"./assets/sounds/character/hornet-swordmiss2.wav",
	"./assets/sounds/character/hornet-swordmiss3.wav",	
].forEach(asset => ASSET_MANAGER.queueDownload(asset));

const resizeCanvas = (event) => {
	var canvas = document.getElementById("gameWorld");
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}

ASSET_MANAGER.downloadAll(() => {
	var canvas = document.getElementById("gameWorld");
	var ctx = canvas.getContext("2d");

	canvas.focus();
	gameEngine.init(ctx);
	
	window.onresize = resizeCanvas;
	resizeCanvas();

	gameEngine.addEntity(new TitleScreen(gameEngine));
	gameEngine.start();
});
