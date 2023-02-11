var gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
// queue all assets.
[
	"./assets/hornet.png", // main character
	
	"./assets/Uoma.png", // enemies
	"./assets/Heavy_Sentry.png",
	"./assets/Hive_Knight.png",
	"./assets/hiveknight.png", // modified version of Hive_Knight.png

	"./assets/Charged_Lumafly.png",// powerups
	"./assets/Gathering_Swarm.png",


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
	"./assets/block.png",
	"./assets/ice-block.png",
	
	"./assets/sounds/music/intro.mp3", // music, sound assets
	"./assets/sounds/music/main-1.mp3",
	"./assets/sounds/music/main-2.mp3",
	"./assets/sounds/music/ver-1.mp3",
	"./assets/sounds/music/ver-2.mp3",
	"./assets/sounds/music/ver-3.mp3",
	"./assets/sounds/music/drumloop.mp3",
	"./assets/sounds/music/fadein.mp3",
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
].forEach(asset => ASSET_MANAGER.queueDownload(asset));

ASSET_MANAGER.downloadAll(() => {
	ASSET_MANAGER.autoRepeat("./assets/sounds/music/intro.mp3");
	ASSET_MANAGER.autoRepeat("./assets/sounds/music/main-1.mp3");
	ASSET_MANAGER.autoRepeat("./assets/sounds/music/main-2.mp3");
	ASSET_MANAGER.autoRepeat("./assets/sounds/music/ver-1.mp3");
	ASSET_MANAGER.autoRepeat("./assets/sounds/music/ver-2.mp3");
	ASSET_MANAGER.autoRepeat("./assets/sounds/music/ver-3.mp3");
	ASSET_MANAGER.autoRepeat("./assets/sounds/music/drumloop.mp3");
	ASSET_MANAGER.autoRepeat("./assets/sounds/music/fadein.mp3");
	var canvas = document.getElementById("gameWorld");
	var ctx = canvas.getContext("2d");
	
	canvas.focus();
	gameEngine.init(ctx);
	gameEngine.addEntity(new TitleScreen(gameEngine));
	gameEngine.start();
});
