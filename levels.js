const levelOne = {
    music: "./assets/sounds/music/intro.mp3",
    background: ["./assets/Overworld_Level_1_blue.png","./assets/Overworld_Level_1.png"],
    worldSize: 2,
    spawnPoint: [350 , 0],
    groundType: GrassGround,
    wallType: GrassWall,
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
    wall:[{x:-32,y:0,size: 47}],

    targetblock: [{x: 700, y: params.canvasHeight*2-32*4, xScale: 1 , yScale: 1},
        {x: 95*32, y:params.canvasHeight*2 + 600, xScale: 1 , yScale: 1}
    ],
    enemies: [
        {name: "Uoma" , x: 1200, y:550},
        {name: "Uoma" , x: 1200, y:450},
        {name: "Uoma" , x: 1200, y:350},
    ],
    powerUps:  [{}]

}
const levelTwo = {
    music: "./assets/sounds/music/main-1.mp3",
    background: ["./assets/Underground_Level_2.png","./assets/Underground_Level_2.png"],
    worldSize: 2,
    spawnPoint: [350 , 1200],
    groundType: UnderGround,
    wallType: UnderWall,
    ground: [
        {x:32*9, y:47*32, size: 10 }, 
        {x:32*95, y:47*32, size: 1 }, 
        {x:32*100, y:47*32, size: 1 }, 
        {x:32*105, y:47*32, size: 1 }, 
        {x:32*110, y:47*32, size: 1 }, 
        {x:32*115, y:47*32, size: 1 }, 
        {x:32*120, y:47*32, size: 1 }, 
        {x:32*125, y:47*32, size: 1 }, 
        {x:32*130, y:47*32, size: 1 },         
        {x:32*135, y:47*32, size: 1 }, 
        {x:32*140, y:47*32, size: 1 }, 
        {x:32*145, y:47*32, size: 1 }, 
        {x:32*150, y:47*32, size: 1 },         
        {x:32*155, y:47*32, size: 1 }, 
        {x:32*160, y:47*32, size: 240 }, 
      
        {x:32*20, y:44*32, size: 10 }, 
        {x:32*34, y:42*32, size: 10 }, 
        {x:32*48, y:40*32, size: 9 }, 
        {x:32*60, y:39*32, size: 14 },
        {x:32*77, y:43*32, size: 6 }, 
        {x:32*86, y:45*32, size: 4 }, 
        {x:32*73, y:36*32, size: 4 }, 
        {x:32*78, y:34*32, size: 8 }, 
        {x:32*70, y:31*32, size: 7 }, 
        {x:32*65, y:29*32, size: 4 }, 
        {x:32*9, y:26*32, size: 105 }, 

        {x:32*117, y:28*32, size: 3 }, 
        {x:32*120, y:29*32, size: 3 }, 
        {x:32*123, y:30*32, size: 3 }, 
        {x:32*126, y:31*32, size: 4 }, 
        {x:32*130, y:32*32, size: 4 }, 
        {x:32*134, y:33*32, size: 4 }, 
        {x:32*138, y:34*32, size: 4 }, 
        {x:32*142, y:35*32, size: 4 }, 
        {x:32*146, y:36*32, size: 4 }, 
        {x:32*150, y:37*32, size: 4 }, 
        {x:32*154, y:38*32, size: 4 }, 
        {x:32*158, y:39*32, size: 4 }, 


        {x:32*221, y:26*32, size: 89 }, 
        {x:32*315, y:26*32, size: 1 }, 
        {x:32*321, y:26*32, size: 18 }, 
        {x:32*345, y:26*32, size: 16 },
        {x:32*399, y:40*32, size: 21 },
        {x:32*393, y:46*32, size: 1 }, 
        {x:32*394, y:45*32, size: 1 }, 
        {x:32*395, y:44*32, size: 1 }, 
        {x:32*396, y:43*32, size: 1 }, 
        {x:32*397, y:42*32, size: 1 }, 
        {x:32*398, y:41*32, size: 1 }, 

        {x:32*414, y:37*32, size: 4 }, 
        {x:32*409, y:35*32, size: 4 }, 
        {x:32*415, y:34*32, size: 4 }, 
        {x:32*404, y:33*32, size: 4 }, 
        {x:32*404, y:30*32, size: 4 }, 
        {x:32*411, y:28*32, size: 5 }, 
        {x:32*414, y:23*32, size: 5 }, 
        {x:32*407, y:20*32, size: 4 }, 
        {x:32*404, y:18*32, size: 4 }, 
        {x:32*401, y:16*32, size: 4 }, 
        {x:32*398, y:14*32, size: 4 }, 
        {x:32*395, y:12*32, size: 4 }, 
        {x:32*398, y:10*32, size: 4 }, 
        {x:32*401, y:8*32, size: 4 }, 
        {x:32*408, y:7*32, size: 10 }, 

        {x:32*16, y:7*32, size: 4 }, 
        {x:32*22, y:6*32, size: 3 }, 
        {x:32*27, y:3*32, size: 3 }, 
        {x:32*28, y:7*32, size: 5 }, 
        {x:32*33, y:2*32, size: 2 }, 
        {x:32*37, y:5*32, size: 3 }, 
        {x:32*40, y:7*32, size: 5 }, 
        {x:32*46, y:9*32, size: 4 }, 
        {x:32*51, y:7*32, size: 3 }, 
        {x:32*55, y:4*32, size: 3 }, 
        {x:32*59, y:6*32, size: 3 }, 
        {x:32*66, y:8*32, size: 4 }, 
        {x:32*73, y:7*32, size: 5 }, 
        {x:32*85, y:7*32, size: 4 }, 
        {x:32*97, y:7*32, size: 5 }, 
        {x:32*103, y:3*32, size: 5 }, 
        {x:32*113, y:0*32, size: 7 }, 
        {x:32*127, y:7*32, size: 6 }, 
        {x:32*138, y:7*32, size: 6 }, 
        {x:32*150, y:7*32, size: 6 }, 
        {x:32*162, y:7*32, size: 6 }, 
        {x:32*175, y:7*32, size: 8 }, 
        {x:32*187, y:7*32, size: 7 }, 
        {x:32*197, y:7*32, size: 1 }, 
        {x:32*201, y:7*32, size: 1 }, 
        {x:32*205, y:7*32, size: 1 }, 
        {x:32*209, y:7*32, size: 1 }, 
        {x:32*214, y:7*32, size: 1 }, 
        {x:32*217, y:7*32, size: 51 }, 


        {x:32*270, y:4*32, size: 5 }, 
        {x:32*270, y:12*32, size: 5 }, 
        {x:32*272, y:8*32, size: 1 }, 
        {x:32*276, y:7*32, size: 9 }, 
        {x:32*289, y:5*32, size: 1 }, 
        {x:32*293, y:7*32, size: 11 }, 
        {x:32*309, y:9*32, size: 1 }, 
        {x:32*313, y:7*32, size: 7 }, 
        {x:32*323, y:9*32, size: 2 }, 
        {x:32*328, y:7*32, size: 5 }, 
        {x:32*336, y:5*32, size: 1 }, 
        {x:32*341, y:7*32, size: 7 }, 
        {x:32*350, y:5*32, size: 2 }, 
        {x:32*354, y:7*32, size: 7 }, 
        {x:32*364, y:5*32, size: 1 }, 
        {x:32*368, y:7*32, size: 5 }, 
        {x:32*374, y:5*32, size: 2 }, 
        {x:32*377, y:7*32, size: 4 }, 
        {x:32*382, y:5*32, size: 3 }, 
        {x:32*386, y:7*32, size: 4 }, 
        {x:32*362, y:23*32, size: 5 }, 
        {x:32*369, y:19*32, size: 5 }, 
        {x:32*375, y:16*32, size: 4 }, 
        {x:32*381, y:12*32, size: 4 }, 



        {x:32*398, y:7*32, size: 1 }, 

    // easily can add a "platform" or "obstacle" option here too
    ],
    wall:[{x:0, y:0, size: 48},
        {x:8*32, y:8*32, size: 47},
        {x:9*32, y:7*32, size: 2},
        {x:10*32, y:6*32, size: 2},
        {x:11*32, y:4*32, size: 3},
        {x:399*32,y:40*32,size: 7},
        {x:420*32,y:0,size: 41},
        {x:221*32,y:8*32 ,size: 18}],

    targetblock: [{x: 32, y: 47*32, xScale: 3.5 , yScale: 1}],
    enemies: [{name: "Heavy_Sentry" , x: 800, y:400}],
   // {name: "Heavy_Sentry" , x: 2200, y:550*2},
    //{name: "Heavy_Sentry" , x: 3200, y:550*2},  ],
    powerUps:  [{name: "Gathering_Swarm" , x: 1200 , y:1000  }]

}
const levelThree = {
    music: "./assets/sounds/music/main-2.mp3",
    background: ["./assets/IceLevel3.png"],
    worldSize: 1,
    spawnPoint: [150 , 0],
    groundType: IceGround,
    wallType: IceWall,
    ground: [
        {x:0, y:params.canvasHeight-32, size: 736 }

    ],
    wall: [{x:0,y:0,size: 24}],
    targetblock: [{x: 700, y: params.canvasHeight-32*4, xScale: 1 , yScale: 1}],
    enemies: [
        {name: "Uoma" , x: 1200, y:550},
        {name: "Uoma" , x: 2200, y:450},
        {name: "Uoma" , x: 3200, y:350},
        {name: "Uoma" , x: 4200, y:550},
        {name: "Uoma" , x: 5200, y:450},
        {name: "Uoma" , x: 6200, y:350},
    ],
    powerUps:  [{}]


}
const levelFour = {
    music: "./assets/sounds/music/drumloop.mp3",
    background: ["./assets/HellLevel4.png"],
    worldSize: 1,
    spawnPoint: [150 , 0],
    groundType: HellGround,
    wallType: HellWall,
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
    wall: [{x:0,y:0,size: 24}],
    targetblock: [{x: 700, y: params.canvasHeight-32*4, xScale: 1 , yScale: 1}],
    enemies: [
        {name: "Uoma" , x: 1200, y:550},
        {name: "Uoma" , x: 2200, y:450},
        {name: "Uoma" , x: 3200, y:350},
        {name: "Uoma" , x: 4200, y:550},
        {name: "Uoma" , x: 5200, y:450},
        {name: "Uoma" , x: 6200, y:350},
    ],
    powerUps:  [{}]


}