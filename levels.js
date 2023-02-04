const levelOne = {
    music: "./assets/sounds/music/intro.mp3",
    background: "./assets/Overworld_Level_1.png",
    groundType: GrassGround,
    ground: [
        {x:0, y:params.canvasHeight-32+768, size: 300 }, // base flat ground
        {x:32*10, y:params.canvasHeight-32*1+768, size: 8 },
        {x:32*10, y:params.canvasHeight-32*5+768, size: 8 },
        {x:32*10, y:params.canvasHeight-32*9+768, size: 8 },
        {x:32*100, y:params.canvasHeight-32*13+768, size: 8 },
        {x:32*10, y:32*1+768, size: 8 },
        {x:32*12, y:32*5+768, size: 8 },
        {x:32*14, y:32*9+768, size: 8 },
        {x:32*16, y:32*13+768, size: 8 },
        {x:32*10, y:32*1+450, size: 8 },
        {x:32*12, y:32*5+450, size: 8 },
        {x:32*14, y:32*9+450, size: 8 },
        {x:32*16, y:32*13+450, size: 8 },
    ],
    targetblock: [{x: 700, y: params.canvasHeight-32*4},
        {x: 95*32, y:params.canvasHeight + 600}
    ],
    enemies: [
        {name: "Uoma" , x: 1200, y:550},
        {name: "Uoma" , x: 1200, y:450},
        {name: "Uoma" , x: 1200, y:350},
    ],

}
const levelTwo = {
    music: "./assets/sounds/music/main-1.mp3",
    background: "./assets/Underground_Level_2.png",
    groundType: UnderGround,
    ground: [
        {x:0, y:params.canvasHeight*2-32, size: 736 }, 
        {x:32*12, y:params.canvasHeight*2-32*5, size: 8 },
        {x:32*12, y:params.canvasHeight*2-32*6, size: 8 },
        {x:32*12, y:params.canvasHeight*2-32*9, size: 8 },
        {x:32*24, y:params.canvasHeight*2-32*13, size: 8 },
        {x:32*46, y:params.canvasHeight*2-32*13, size: 8 },

        {x:32*36, y:params.canvasHeight*2-32*13, size: 8 },
        {x:32*72, y:params.canvasHeight*2-32*5, size: 8 },
        {x:32*85, y:params.canvasHeight*2-32*9, size: 8 },
        {x:32*95, y:params.canvasHeight*2-32*12, size: 8 },

        {x:32*200, y:params.canvasHeight*2-32*1, size: 8 },
        {x:32*202, y:params.canvasHeight*2-32*5, size: 8 },
        {x:32*204, y:params.canvasHeight*2-32*9, size: 8 },
        {x:32*206, y:params.canvasHeight*2-32*13, size: 8 },

        {x:32*226, y:params.canvasHeight*2-32*13, size: 8 },
        {x:32*246, y:params.canvasHeight*2-32*13, size: 8 },
        {x:32*276, y:params.canvasHeight*2-32*13, size: 8 },

    // easily can add a "platform" or "obstacle" option here too
    ],
    targetblock: [{x: 700, y: params.canvasHeight-32*4}],
    enemies: [{}  ],
    powerUps:  [{name: "Gathering_Swarm" , x: 1200 , y:1000  }]

}
const levelThree = {
    music: "./assets/sounds/music/main-2.mp3",
    background: "./assets/IceLevel3.png",
    groundType: IceGround,
    ground: [
        {x:0, y:params.canvasHeight-32, size: 736 }, 
        {x:32*12, y:params.canvasHeight-32*5, size: 8 },
        {x:32*24, y:params.canvasHeight-32*9, size: 8 },
        {x:32*46, y:params.canvasHeight-32*13, size: 8 },

        {x:32*36, y:params.canvasHeight-32*13, size: 8 },
        {x:32*72, y:params.canvasHeight-32*5, size: 8 },
        {x:32*85, y:params.canvasHeight-32*9, size: 8 },
        {x:32*95, y:params.canvasHeight-32*12, size: 8 },

        {x:32*200, y:params.canvasHeight-32*1, size: 8 },
        {x:32*202, y:params.canvasHeight-32*5, size: 8 },
        {x:32*204, y:params.canvasHeight-32*9, size: 8 },
        {x:32*206, y:params.canvasHeight-32*13, size: 8 },

        {x:32*226, y:params.canvasHeight-32*13, size: 8 },
        {x:32*246, y:params.canvasHeight-32*13, size: 8 },
        {x:32*276, y:params.canvasHeight-32*13, size: 8 },

    ],
    targetblock: [{x: 700, y: params.canvasHeight-32*4}],
    enemies: [
        {x: 1200, y:550},
        {x: 2200, y:450},
        {x: 3200, y:350},
        {x: 4200, y:550},
        {x: 5200, y:450},
        {x: 6200, y:350},
    ],

}
const levelFour = {
    music: "./assets/sounds/music/drumloop.mp3",
    background: "./assets/HellLevel4.png",
    groundType: HellGround,
    ground: [
        {x:0, y:params.canvasHeight-32, size: 736 }, 
        {x:32*12, y:params.canvasHeight-32*5, size: 8 },
        {x:32*24, y:params.canvasHeight-32*9, size: 8 },
        {x:32*46, y:params.canvasHeight-32*13, size: 8 },

        {x:32*36, y:params.canvasHeight-32*13, size: 8 },
        {x:32*72, y:params.canvasHeight-32*5, size: 8 },
        {x:32*85, y:params.canvasHeight-32*9, size: 8 },
        {x:32*95, y:params.canvasHeight-32*12, size: 8 },

        {x:32*200, y:params.canvasHeight-32*1, size: 8 },
        {x:32*202, y:params.canvasHeight-32*5, size: 8 },
        {x:32*204, y:params.canvasHeight-32*9, size: 8 },
        {x:32*206, y:params.canvasHeight-32*13, size: 8 },

        {x:32*226, y:params.canvasHeight-32*13, size: 8 },
        {x:32*246, y:params.canvasHeight-32*13, size: 8 },
        {x:32*276, y:params.canvasHeight-32*13, size: 8 },

    ],
    targetblock: [{x: 700, y: params.canvasHeight-32*4}],
    enemies: [
        {x: 1200, y:550},
        {x: 2200, y:450},
        {x: 3200, y:350},
        {x: 4200, y:550},
        {x: 5200, y:450},
        {x: 6200, y:350},
    ],

}