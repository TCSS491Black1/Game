var gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("")
ASSET_MANAGER.queueDownload("")

ASSET_MANAGER.downloadAll(() => {
	var canvas = document.getElementById("gameWorld");
	var ctx = canvas.getContext("2d");
	
	params.canvasWidth = 1024
	params.canvasHeight = 768;


	gameEngine.init(ctx);

	gameEngine.addEntity(new SceneManager(gameEngine));

	gameEngine.start();
});
