const getRandom = (max, min) =>{
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const gamePlay = {
    key: 'gamePlay',
    preload: function(){

        this.load.image('bg1','images/bg/bg1.png');
        this.load.image('bg2','images/bg/bg2.png');
        this.load.image('bg3','images/bg/bg3.png');
        this.load.image('bg4','images/bg/bg4.png');
        this.load.image('footer',' images/bg/footer.png');
        //level1
        this.load.image('rock1',' images/item-level-1-branch.png');
        this.load.image('rock2', 'images/item-level-1-branch.png');
        //level2
        this.load.image('rock3', 'images/item-level-2-smoke-sm.png');
        this.load.image('rock4', 'images/item-level-2-smoke-lg.png');
        //level3
        this.load.image('rock5', 'images/item-level-3-fire-lg.png');
        this.load.image('rock6', 'images/item-level-3-fire-sm.png');

        this.load.image('congratulation',' images/ui/txt-congratulations.png');
        this.load.image('gameOver',' images/ui/txt-game-over.png');
        this.load.image('tryAgainBtn',' images/ui/btn-try-again.png');
        this.load.spritesheet('user', 'images/player.png', {frameWidth: 144, frameHeight: 120});

        //參數設定
        this.timeInt = 90;
        this.speedLevel = 1;
        this.gameStop = false;
        this.obstacle1 =[];
        this.obstacle2 =[];
        this.obstacle3 =[];
        this.obsIdx = 0;  // 障礙物索引
        this.obsIdx2 = 1;
        this.obsIdx3 = 2;
        this.isJump = true;//是否可以跳躍
    },
    create: function(){
        // 資源載入完成，加入遊戲物件及相關設定
        this.bg4 = this.add.tileSprite(w/2, h/2, w, h, 'bg4');
        this.bg3 = this.add.tileSprite(w/2, h/2, w, h, 'bg3');
        this.bg2 = this.add.tileSprite(w/2, h/2, w, h, 'bg2');
        this.bg1 = this.add.tileSprite(w/2, h/2, w, h, 'bg1');
        this.footer = this.add.tileSprite(w/2, 360+45, w, 90, 'footer');

        //把物件加入有物理的世界
        this.physics.add.existing(this.footer);
        // 設定物件不會動靜止不會掉下去
        this.footer.body.immovable = true;
        // 物件的位置和旋轉是否受其速度，加速度，阻力和重力的影響
        this.footer.body.moves = false;
        //設定人物位置
        this.player = this.physics.add.sprite(150, 150, 'user');
        this.player.setScale(0.7);



        //設定角色彈跳值
        this.player.setBounce(1);
        //設定邊界，不讓他超出邊界
        this.player.setCollideWorldBounds(true);
        //設定角色碰撞邊界
        this.player.setSize(100, 100);
        //設定動畫播放
        // 動畫影格
        keyFrame(this);

        // 加入物理效果(將需要碰撞的物件綁在一起)
        const addPhysics = GameObject =>{
            this.physics.add.existing(GameObject);
            GameObject.body.immovable = true;
            GameObject.body.moves = false;
        }

        // 障礙物的座標資訊
        const masPos = [
            {name: 'rock1', x: w+200 , y: 320, w: 160, h: 83},
            {name: 'rock2', x: w+200 , y: h / 2 - 30 , w: 200, h: 94},
            {name: 'rock3', x: w+200 , y: 70, w: 130, h: 160},
            {name: 'rock4', x: w+200 , y: 320, w: 160, h: 83},
            {name: 'rock5', x: w+200 , y: h / 2 - 30 , w: 200, h: 94},
            {name: 'rock6', x: w+200 , y: 70, w: 130, h: 160},
        ]
        //初始化時間參數
        this.TimeText = this.add.text(w-180,h-50,`Time : ${this.timeInt}`,{color:'#fff',fontSize:'30px'});

        //倒數計時
        let timer =setInterval(()=>{
            this.timeInt--;
            if(this.timeInt < 50 && this.timeInt >30){
                this.speedLevel = 2;
            }
            else if(this.timeInt < 30 && this.timeInt >10){
                this.speedLevel = 3;
            }
            else if(this.timeInt <10 && this.timeInt >0){
                this.speedLevel = 4;
            }
            this.TimeText.setText(`Time : ${this.timeInt}`);
            if(this.timeInt <=0){
                this.gameStop = true;
                clearInterval(timer);
                this.congratulation = this.add.image(w/2,h/2-50,'congratulation');
                this.congratulation.setScale((0.5));
            }
        },1000)

        //碰撞到後停止遊戲
        const hittest = () => {
            this.gameStop = true;
            this.player.setBounce(0);
            this.player.setSize(110, 100, 0);
            this.player.anims.play('deel', true);
            clearInterval(timer);
            let gameOver = this.add.image(w / 2, h / 2 - 40, 'gameOver');
            gameOver.setScale(0.8);
            let tryAgainBtn = this.add.image(w / 2, h / 2 + 30, 'tryAgainBtn');
            tryAgainBtn.setScale(0.6);
            tryAgainBtn.setInteractive();
            tryAgainBtn.on('pointerdown', () => this.scene.start('gameStart'));
        }

        //檢查是否碰撞&產生地板障礙物
        for (let i = 0; i < 10; i++) {
            let BoolIdx = getRandom(2, 0);
            let BoolIdx2 = getRandom(2, 0);
            this['rock'+ i] = this.add.tileSprite(masPos[BoolIdx].x, masPos[BoolIdx].y, masPos[BoolIdx].w, masPos[BoolIdx].h, masPos[BoolIdx].name);
            this['rockB'+ i] = this.add.tileSprite(masPos[BoolIdx2].x, masPos[BoolIdx2].y, masPos[BoolIdx2].w, masPos[BoolIdx2].h, masPos[BoolIdx2].name);
            this['rockC'+ i] = this.add.tileSprite(masPos[BoolIdx2].x, masPos[BoolIdx2].y, masPos[BoolIdx2].w, masPos[BoolIdx2].h, masPos[BoolIdx2].name);

            this.obstacle1.push(this['rock'+ i] );
            this.obstacle2.push(this['rockB'+ i]);
            this.obstacle3.push(this['rockC'+ i]);
            //加入物理效果
            addPhysics(this['rock'+ i] );
            addPhysics(this['rockB'+i]);
            addPhysics(this['rockC'+i]);

            //玩家和障礙物綁在一起
            this.physics.add.collider(this.player, this['rock'+ i] , hittest);
            this.physics.add.collider(this.player, this['rockB'+i], hittest);
            this.physics.add.collider(this.player, this['rockC'+i], hittest);

        }
        this.physics.add.collider(this.player, this.footer);//玩家和地板綁在一起

        //播放動畫
        this.player.anims.play('run', true);
    },
    update: function(){
        //時間歸零後
        if(this.gameStop) return;
        //定義哪些需要知道碰撞的物件
        // 遊戲狀態更新
        this.bg4.tilePositionX += 4 * this.speedLevel;
        this.bg3.tilePositionX += 3 * this.speedLevel;
        this.bg2.tilePositionX += 2 * this.speedLevel;
        this.bg1.tilePositionX += 1 * this.speedLevel;
        this.footer.tilePositionX += 4 * this.speedLevel;

        
        this.obstacle1[this.obsIdx].x -= 3 * this.speedLevel;

        //時間在10秒以內的時候變換level2的障礙物
        if(this.TimeStep < 10 && this.TimeStep > 0 ){
            this.monsterArr2[this.masIdx2].x -= 3 * this.bgSpeed;
        }

         // 檢測怪物是否超出邊界然後返回
         for (let i = 0; i < this.obstacle1.length; i++) {
            if(this.obstacle1[i].x <= -100){
                this.obstacle1[i].x = w + 200;
                this.obsIdx = getRandom(this.obstacle1.length - 1, 0);
            }
            if(this.obstacle2[i].x <= -100){
                this.obstacle2[i].x = w + getRandom(400, 200);
                this.obsIdx2 = getRandom(this.obstacle2.length - 1, 0);
            }
            if(this.obstacle3[i].x <= -100){
                this.obstacle3[i].x = w + getRandom(400, 200);
                this.obsIdx3 = getRandom(this.obstacle3.length - 1, 0);
            }
        }

        //滑鼠監聽事件
        const keyboard = this.input.keyboard.createCursorKeys();
        if(keyboard.right.isDown){
            this.player.anims.play('speed', true);
            this.player.flipX = false;//角色翻轉
            this.player.setVelocityX(250);//每次移動的pixel
        }
        else if(keyboard.left.isDown){
            this.player.anims.play('speed', true);
            this.player.flipX = true;
            this.player.setVelocityX(-260);
        }
        else{
            this.player.anims.play('run', true);
            this.player.flipX = false;
            this.player.setVelocityX(0);
        }
        if(keyboard.up.isDown){
            if(this.isJump){
                this.isJump = false;
                this.player.setVelocityY(-250);
            }
        }
       else if(keyboard.down.isDown){
            if(this.isJump){
                this.isJump = false;
                this.player.setVelocityY(200);
            }
        }
        else{
            this.isJump = true;
        }
    }
}