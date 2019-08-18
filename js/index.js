const config = {
    type: Phaser.AUTO,
    width: w,
    height: h,
    parent: 'app',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {//重力值
                y: 700
            },
        },
    },
    scene: [gameStart,gamePlay]
}
const game = new Phaser.Game(config);