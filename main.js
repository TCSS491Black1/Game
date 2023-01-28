var gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
// queue all assets.
[
	"./assets/block.png",
	"./assets/ice-block.png",
	"./assets/hornet.png",
	"./assets/Uoma.png",
	"./assets/Dirt_Block.png",
	"./assets/lava_7.png",
	"./assets/Overworld_Level_1.png",
	"./assets/Underground_Level_2.png",
	"./assets/IceLevel3.png",
	"./assets/HellLevel4.png",
	"./assets/Environmental_Blocks.png",
	"./assets/sounds/music/intro.mp3",
	"./assets/sounds/sfx/trill.wav",
].forEach(asset => ASSET_MANAGER.queueDownload(asset));

ASSET_MANAGER.downloadAll(() => {
	ASSET_MANAGER.autoRepeat("./assets/sounds/music/intro.mp3");
	var canvas = document.getElementById("gameWorld");
	var ctx = canvas.getContext("2d");
	

	canvas.focus();

	gameEngine.init(ctx);

	gameEngine.addEntity(new TitleScreen(gameEngine));

	gameEngine.start();
});
