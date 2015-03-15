
var Sample = cc.Layer.extend({
    init:function(){
	this._super();
	var size = cc.Director.getInstance().getWinSize();

	/*
	//２次元配列フィールドデータ
	this.fieldData=[
	    [3,4,4,4,3],
	    [3,5,5,5,3],
	    [3,5,4,5,3],
	    [3,5,5,5,3],
	    [3,5,4,5,3],
	    [3,5,5,5,3],
	    [3,5,4,5,3],
	    [3,5,5,5,3],
	    [3,4,4,4,3],
	];
	var collisionData=[
	    [1,1,1,1,1],
	    [1,0,0,0,1],
	    [1,0,1,0,1],
	    [1,0,0,0,1],
	    [1,0,1,0,1],
	    [1,0,0,0,1],
	    [1,0,1,0,1],
	    [1,0,0,0,1],
	    [1,1,1,1,1],
	];

	//フィールドのブロック表示
	this.blocks = [];
	for(var i = 0; i<this.fieldData.length; i++){
	    for(var j = 0; j < this.fieldData[i].length; j++){
		if(this.fieldData[i][j] == 3){
		    var block = cc.LabelTTF.create("■","Arial",160);
		    block.setColor(cc.c3b(255,255,0));//黄色
		    block.setPosition(cc.p(i*85, j*80));
		    block.setAnchorPoint(cc.p(0,0));
		    this.addChild(block,10);
		}
		if(this.fieldData[i][j] == 4){
		    var block = cc.LabelTTF.create("■","Arial",160);
		    block.setColor(cc.c3b(255,255,255));//
		    block.setPosition(cc.p(i*85, j*80));
		    block.setAnchorPoint(cc.p(0,0));
		    this.addChild(block,10);
		}
		this.blocks.push(block);
	    }
	}
	*/

	//スコア
	this.scoreLabel = cc.LabelTTF.create("","Arial",17);
	this.scoreLabel.setPosition(cc.p(20,size.height-20));
	this.scoreLabel.setAnchorPoint(cc.p(0,1));
	this.addChild(this.scoreLabel,10);
	
	//爆弾
	this.boms = [];
	//これよりCの#defineみたいなんで定義したい。
	//#define maxNum = 3;//爆弾最大所持数。定義したい
	for(var i=0; i<3; i++){
	    //LayerにSprinteを引数s_shipで初期化
	    //this.bom = cc.Sprite.create(s_ship);//こっちのほうがスマート
	    var bom = cc.Sprite.create(s_ship);
	    //ボムの状態 0:非設置 1:通常ボム設置 2:スイッチボム設置
	    bom.state = 0;
	    //ボムの爆発までのカウント用
	    bom.timer = 300;
	    this.boms.push(bom);
	}
		
	//隕石
	this.enemies = [];
	for(var i = 0; i<15; i++){
	    if(i%2 == 0)
	    var enemy = cc.LabelTTF.create("★","Arial",38);
	    if(i%2 == 1)
	    var enemy = cc.LabelTTF.create("＊","Arial",38);
	    
	    enemy.v = cc.p(-5,(Math.random() -0.5)*3)//隕石の速度を定義 updateで+や-をする
	    enemy.setColor(cc.c3b(255,255,0));//赤くする
	    enemy.setPosition(cc.p((Math.random()+1)*size.width,Math.random()*size.height));
	    var role = cc.RotateBy.create(Math.random()%5+1,90);
	    var repeat = cc.RepeatForever.create(role);
	    enemy.runAction(repeat);
	    this.addChild(enemy,10);
	    this.enemies.push(enemy);
	}
	/*
	//火力
	this.fires = [];
	for(var i = 0; i<4; i++){//炎は4方向
	    var fire = cc.ParticleFire.create();
	    fire.setTexture(cc.TextureCache.getInstance().addImage(s_ship));
	    this.fires.push(fire);
	}
	*/
	
	
	//デバッグ用 タッチ位置の表示
	this.touchPos = cc.LabelTTF.create("","Arial",17);
	this.touchPos.setPosition(cc.p(110,size.height-20));
	this.touchPos.setAnchorPoint(cc.p(0,1));
	this.addChild(this.touchPos,10);
	
	this.scheduleUpdate();
	
	this.setTouchEnabled(true);
	return true;
    },
    
    update:function(dt){
	var size = cc.Director.getInstance().getWinSize();
	g.delay++;

	this.scoreLabel.setString("SCORE"+g.score);
	
	
	for(var i=0;i<this.enemies.length;i++){
	    var enemy = this.enemies[i];
	    var pos = enemy.getPosition();
	    pos = cc.p(pos.x,pos.y);
	    pos.x += enemy.v.x;
	    pos.y += enemy.v.y;
	    
	    //画面からでないように(マリオのゲーム的な感じ)
	    if(pos.x < 0)
		pos.x = size.width;
	    if(pos.y < 0)
		pos.y = size.height;
	    if(pos.y > size.height)
		pos.y = 0;
	    enemy.setPosition(pos);	    
	}
	
	
	//爆弾の現在位置を取得 デバッグ用
	var bom = this.boms[0];
	var pos = bom.getPosition();
	this.touchPos.setString("bomの位置" + pos.x +","+ pos.y　+ "  ディレイカウント:" + g.delay + this.toudched);

	if (this.touched) {
	    //boms[i].stateが0であればbom[i].stateを1にして設置
	    if(this.boms[2].state == 0 && this.boms[1].state == 1　&& this.boms[0].state ==1 && g.delay > 50){
		this.boms[2].state = 1;   
		cc.log("状態いべ3");		
		var bom = this.boms[2];
		//タッチした位置posを爆弾表示位置に代入
		pos = cc.p(this.touched.x ,this.touched.y);
		bom.setPosition(pos);
		this.addChild(bom, 5);
		bom.state = 1;
		g.delay = 0;
	    }
	}

	if (this.touched) {
	    //boms[i].stateが0であればbom[i].stateを1にして設置
	    if(this.boms[1].state == 0　&& this.boms[0].state ==1 && g.delay > 50){
		this.boms[1].state = 1;   
		cc.log("状態いべ2");		
		var bom = this.boms[1];
		//タッチした位置posを爆弾表示位置に代入
		pos = cc.p(this.touched.x, this.touched.y);
		bom.setPosition(pos);
		this.addChild(bom, 5);
		bom.state = 1;
		g.delay = 0;
		this.touched = null;
	    }
	}
	
	if (this.touched) {
	    //boms[i].stateが0であればbom[i].stateを1にして設置
	    if(this.boms[0].state == 0){
		this.boms[0].state = 1;   
		cc.log("状態いべ1");		
		var bom = this.boms[0];
		//タッチした位置posを爆弾表示位置に代入
		pos = cc.p(this.touched.x , this.touched.y);
		bom.setPosition(pos);
		this.addChild(bom, 5);
		bom.state = 1;
		g.delay = 0;
		this.touched = null;
	    }
	}
	
	/** bom状態の判定 自信**/
	for(var i=0;i<this.boms.length;i++){
	    if(this.boms[i].state == 1){
		this.boms[i].timer--;
		if(this.boms[i].timer == 0){
		    this.onBomFire(i);
		}
	    }
	}	
	//あたり判定
	for(var i=0;i<this.enemies.length;i++){
	    var enemy = this.enemies[i];
	    var distance = cc.pDistance(pos,enemy.getPosition());
	    if(distance < 0.5){
		cc.log("HIT");
		if(!this.gameover){
		    this.gameover = true;
		    this.onGameover();
		}
	    }
	}
	g.score++;
    },
    onBomFire:function(i){
	var fire0 = cc.ParticleFire.create();
	fire0.setTexture(cc.TextureCache.getInstance().addImage(s_ship));
	fire0.setPosition(cc.p(this.boms[i].getPosition()));
	/*
	var fire0 = this.fires[0];
	var fire1 = this.fires[1];
	var fire2 = this.fires[2];
	var fire3 = this.fires[3];
	*/
	
	//fire0.setPosition(cc.p(this.boms[i].getPosition()));
	
	//爆発のエモーション
	this.addChild(fire0);
	/*
	this.addChild(fire1);
	this.addChild(fire2);
	this.addChild(fire3);
	*/

	//並列処理 spawn
	var spawnUp = cc.Spawn.create(
	    cc.MoveBy.create(0.7,cc.p(0,300))//上 Byは現在位置からの相対値
	);
	/*
	var spawnDown = cc.Spawn.create(
	    cc.MoveBy.create(0.7,cc.p(0,-300))//上 Byは現在位置からの相対値
	);
	var spawnRight = cc.Spawn.create(
	    cc.MoveBy.create(0.7,cc.p(300,0))//上 Byは現在位置からの相対値
	);
	var spawnLeft = cc.Spawn.create(
	    cc.MoveBy.create(0.7,cc.p(-300,0))//上 Byは現在位置からの相対値
	);
	*/
	
	//コールバックの設定
	var actionCb0 = cc.CallFunc.create(function () {
	    this.removeChild(fire0);
	},this);
	/*
	//コールバックの設定
	var actionCb1 = cc.CallFunc.create(function () {
	    this.removeChild(fire1);
	},this);
	//コールバックの設定
	var actionCb2 = cc.CallFunc.create(function () {
	    this.removeChild(fire2);
	},this);
	//コールバックの設定
	var actionCb3 = cc.CallFunc.create(function () {
	    this.removeChild(fire3);
	},this);
	*/
	//順次処理 sequence
	var sequenceUp = cc.Sequence.create(spawnUp, actionCb0);
	/*
	var sequenceDown = cc.Sequence.create(spawnDown, actionCb1);
	var sequenceRight = cc.Sequence.create(spawnRight, actionCb2);
	var sequenceLeft = cc.Sequence.create(spawnLeft, actionCb3);
	*/

	//fire.runAction(sequence);
	fire0.runAction(sequenceUp);
	/*fire1.runAction(sequenceDown);
	fire2.runAction(sequenceRight);
	fire3.runAction(sequenceLeft);
	*/
	/** 爆発音 **/
	var audioEngine = cc.AudioEngine.getInstance();
	audioEngine.playEffect(s_explosion06); // 爆発音
	//if(){
	//onBomFire()自分自身を呼び出す(再起)
	//}
	//タイマーを元に戻す。ステートも未設置状態にする。
	this.boms[i].timer = 300;
	this.boms[i].state = 0;
    },
    onGameover:function(){
	var audioEngine = cc.AudioEngine.getInstance();
	audioEngine.playEffect(s_explosion06); // 爆発音
	audioEngine.stopMusic(s_cyber06);
	
	var transition = cc.TransitionFade.create(1.0,new ResultScene());
	cc.Director.getInstance().replaceScene(transition);	
    },	    
    onTouchesBegan:function (touches, event) {
	this.touched = touches[0].getLocation();
    },
    onTouchesMoved:function (touches, event) {
	this.touched = null;
	//this.touched = touches[0].getLocation();
    },
    onTouchesEnded:function (touches, event) {
	this.touched = null;
	//this.touched = touches[0].getLocation();
    },
    onTouchesCancelled:function (touches, event) {
	this.touched = null;
    },
});

var SampleScene = cc.Scene.extend({
    onEnter:function(){
	var audioEngine = cc.AudioEngine.getInstance();
	audioEngine.playMusic(s_cyber06, true); // BGM
	
	this._super();
	var layer = new Sample();
	layer.init();
	this.addChild(layer);
	}
});
