const levelOne = {
    music: "./assets/sounds/music/intro.mp3",
    background: "./assets/Overworld_Level_1.png",
    ground: [
        {x:0, y:params.canvasHeight-32, size: 736 }, // base flat ground
        {x:32*10, y:params.canvasHeight-32*1, size: 8 },
        {x:32*12, y:params.canvasHeight-32*5, size: 8 },
        {x:32*14, y:params.canvasHeight-32*9, size: 8 },
        {x:32*16, y:params.canvasHeight-32*13, size: 8 },
    ],
    targetblock: [{x: 2200, y: params.canvasHeight-32*4}],
    enemies: [
        {x: 1200, y:550},
        {x: 1200, y:450},
        {x: 1200, y:350},
    ],

}

const levelTwo = {
    //music: "./assets/sounds/music/intro.mp3",
    background: "./assets/Underground_Level_2.png",
    ground: [
        {x:0, y:params.canvasHeight-32, size: 736 }, // base flat ground
        {x:32*10, y:params.canvasHeight-32*1, size: 8 },
        {x:32*12, y:params.canvasHeight-32*5, size: 8 },
        {x:32*14, y:params.canvasHeight-32*9, size: 8 },
        {x:32*16, y:params.canvasHeight-32*13, size: 8 },
    ],
    targetblock: [{x: 2200, y: params.canvasHeight-32*4}],
    enemies: [
        {x: 1200, y:550},
        {x: 1200, y:450},
        {x: 1200, y:350},
    ],

}