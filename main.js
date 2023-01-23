var gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();
// queue all assets.
[
	"./assets/hornet.png",
	"./assets/Uoma.png",
	"./assets/Dirt_Block.png",
	"./assets/lava_7.png",
	"./assets/Overworld_Level_1.png",
	"./assets/Environmental_Blocks.png"
].forEach(asset => ASSET_MANAGER.queueDownload(asset));

ASSET_MANAGER.downloadAll(() => {
	var canvas = document.getElementById("gameWorld");
	var ctx = canvas.getContext("2d");
	
	params.canvasWidth = 1524; // adjusted for midpoint purposes
	params.canvasHeight = 768;


	gameEngine.init(ctx);

	gameEngine.addEntity(new TitleScreen(gameEngine));

	gameEngine.start();
});
