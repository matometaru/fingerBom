/** Layerクラス ここから **/
var Sample = cc.Layer.extend({
	/** init function ここから **/
	init:function(){
		this._super();
		var size = cc.Director.getInstance().getWinSize();
		
		//Field.js参照
		this.field = Field.create();
		this.addChild(this.field);
	
		//FireEffectClass.js
		this.fireEffect = FireEffect.create();
		this.addChild(this.fireEffect);
		
		//爆弾
		this.boms = [];
		for(var i=0; i<Bom.NUM; i++){	    
		    var bom = Bom.create(s_bom);	    
		    this.addChild(bom,7);
		    this.boms.push(bom); 
		    var pos = bom.getPosition();
		}
			
		//デバッグ用 タッチ位置の表示
		this.touchPos = cc.LabelTTF.create("","Arial",17);
		this.touchPos.setPosition(cc.p(110,size.height-20));
		this.touchPos.setAnchorPoint(cc.p(0,1));
		this.addChild(this.touchPos,10);
		
		this.scheduleUpdate();
		
		this.setTouchEnabled(true);
		return true;
    },
    /** init function ここまで **/
    
    
    /** update function ここから **/
    update:function(dt){
		var size = cc.Director.getInstance().getWinSize();
		if(g.delay < 51){
			g.delay++;
		}
		g.score++;
	
		//爆弾の現在位置を取得 デバッグ用
		var bom = this.boms[0];
		var pos = bom.getPosition();
		this.touchPos.setString("bomの位置" + pos.x +","+ pos.y　+ "  ディレイカウント:" + g.delay);
		
		/** 爆弾設置 **/
		if(this.touched && g.delay > 50){
		    for(var i=0; i<this.boms.length ;i++){
				if(this.boms[i].state == 0){
				    pos = cc.p(this.touched.x ,this.touched.y);
				    var j = this.parsePtoZx(pos.x);
				    var k = this.parsePtoZy(pos.y);
				    cc.log("x=" + j + " y=" + k +"に爆弾["+i+"]を配置しました。");
			    	if(this.field.fieldStateData[j][k] == 0){
						//クリックした座標位置から整えた位置を返す関数
						pos = this.rectInPosition(pos);
						this.boms[i].state = 1;   		
						this.boms[i].setPosition(pos);
						this.field.fieldStateData[j][k] = 4;
						g.delay = 0;
						this.field.stateDebugView();
						break;
					}
			  	  	else{
						cc.log("爆弾を配置できません。");
				    }
				}
		    }
		}
		/** bom状態の判定 **/
		for(var i=0;i<this.boms.length;i++){
		    if(this.boms[i].state == 1){
				this.boms[i].timer--;
				if(this.boms[i].timer == 0){
				    var pos = this.boms[i].getPosition();
				    var j = this.parsePtoZx(pos.x);
				    var k = this.parsePtoZy(pos.y);
				    this.onBomFire(j,k);
				}
		    }
		}
    },
    /** update function ここまで **/
    
    
    
    /** parseBomNum function ここから **/
    /** 座標から何番目の爆弾か特定し、番号を返す関数 ここから **/
    parseBomNum:function(j,k){
		cc.log(j +"と"+ j + "をparseBomNum:");
		for(var i=0;i<this.boms.length;i++){
		    var pos = this.boms[i].getPosition();
		    if( j==this.parsePtoZx(pos.x)  && k==this.parsePtoZx(pos.y)){
				return i;
		    }
		}
    },
     /** 座標から何番目の爆弾か特定し、番号を返す関数 ここまで **/
    /** parseBomNum function ここまで **/
    
    
    
    /** onBomFire function ここから **/
    onBomFire:function(i,j){
		//i,jよりnumを求める	
		var num = this.parseBomNum(i,j);
		cc.log("爆弾の番号 = " + num)
		
		var pos = this.boms[num].getPosition();
	
		/** 爆発音 **/
		var audioEngine = cc.AudioEngine.getInstance();
		audioEngine.playEffect(s_explosion06); 
		
		//爆発する爆弾のfieldの位置をセット
		cc.log("変換前 state =" + this.field.fieldStateData[i][j] + " i=" + i + " j=" + j);
		var i = this.parsePtoZx(pos.x);
		var j = this.parsePtoZy(pos.y);
		cc.log("posx = "+pos.x+" posy = "+pos.y);
		cc.log("変換後 state =" + this.field.fieldStateData[i][j] + " i=" + i + " j=" + j);
		//爆発が確定した時点で、stateは0にする
		this.field.fieldStateData[i][j] = 0;
		
		/*上下左右 4カ所探索*/
		this.fireEffect.upFindCount = this.catchFireUp(i,j);
		this.fireEffect.rightFindCount = this.catchFireRight(i,j);
		this.fireEffect.downFindCount = this.catchFireDown(i,j);
		this.fireEffect.leftFindCount = this.catchFireLeft(i,j);
		cc.log("上" + this.fireEffect.upFindCount+" 右" + this.fireEffect.rightFindCount+" 下" + this.fireEffect.downFindCount+" 左 " + this.fireEffect.leftFindCount);
	
		//探索回数判明後　火力の表示長さが決定する
		this.fireEffect.bomFire(this.boms[num].firePower,pos);
		cc.log("火力のエフェクトを消去しました。");
		
		/** カウントリセット **/			
		this.upCount = 0;
		this.rightCount = 0;
		this.downCount = 0;
		this.leftCount = 0;
		
		//爆発したら→タイマーを元に戻す。ステートも未設置状態にする。
		this.boms[num].setPosition(1000, pos.y);
		cc.log("爆発した爆弾 num="+num+ "を x=1000 y="+pos.y + "に移動する。")
		this.boms[num].timer = Bom.TIMER;
		this.boms[num].state = 0;
		this.field.fieldStateData[i][j] = 0;
	
		this.field.stateDebugView();
	
		//引火判定を全て行った後 0.5秒後に全ての火力ステート7を0に戻す
		//火力は0.5秒間フィールドに残る
		//if(fireData[i][j]==7)fireData[i][j]=0;
		this.scheduleOnce(function(){
		    cc.log("全ての火力を消す");
		},0.5);

    },
	/** onBomFire function ここまで **/
	
	
	/** 変数 **/
    upCount:0,
    downCount:0,
    rightCount:0,
    leftCount:0,
    /***********/

    //引火判定再帰処理 探索回数を返す
    /** 上探索 右探索 下探索 左探索 ここから **/
    catchFireUp:function(i,j){	
		if(this.field.fieldStateData[i][j+1] == 1){
		    cc.log("上の壁に当たった");
		}   
		if(this.field.fieldStateData[i][j+1] == 4){
		    cc.log("上の爆弾に当たった");
		    this.onBomFire(i,j+1);
		}
		if(this.field.fieldStateData[i][j+1] == 0) {
		    this.catchFireUp(i,j+1);
		    this.field.fieldStateData[i][j+1]=7;//7は火力データ
		    //0.5秒後何もない状態に戻す
		    this.scheduleOnce(function()
		    	{this.field.fieldStateData[i][j+1]=0;},0.5);
		    //0.6秒後にデバッグビューを更新
		    this.scheduleOnce(function()
		    	{this.field.stateDebugView();},0.6);
		}
		this.upCount++;
		return this.upCount;
	},
	
    catchFireRight:function(i,j){	
		if(this.field.fieldStateData[i+1][j] == 1) cc.log("右の壁に当たった");
		if(this.field.fieldStateData[i+1][j] == 4){
			 cc.log("右の爆弾に当たった");
			 this.onBomFire(i+1,j);
		}
		if(this.field.fieldStateData[i+1][j] == 0){
			this.catchFireRight(i+1,j);
			this.field.fieldStateData[i+1][j]=7;//7は火力データ
			this.scheduleOnce(function()
		    	{this.field.fieldStateData[i+1][j]=0;},0.5);
		}
		this.rightCount++;
		return this.rightCount;
    },
    
    catchFireDown:function(i,j){	
		if(this.field.fieldStateData[i][j-1] == 1) cc.log("下の壁に当たった");
		if(this.field.fieldStateData[i][j-1] == 4){
			cc.log("下の爆弾に当たった");
			this.onBomFire(i,j-1);
		}
		if(this.field.fieldStateData[i][j-1] == 0){
			this.catchFireDown(i,j-1);
			this.field.fieldStateData[i][j-1]=7;//7は火力データ
			this.scheduleOnce(function()
		    	{this.field.fieldStateData[i][j-1]=0;},0.5);
		}
		this.downCount++;
		return this.downCount;
    },
    
    catchFireLeft:function(i,j){	
		if(this.field.fieldStateData[i-1][j] == 1) cc.log("左の壁に当たった");
		if(this.field.fieldStateData[i-1][j] == 4){
			cc.log("左の爆弾に当たった");
			this.onBomFire(i-1,j);
		}
		if(this.field.fieldStateData[i-1][j] == 0){
			this.catchFireLeft(i-1,j);
			this.field.fieldStateData[i-1][j]=7;//7は火力データ
			this.scheduleOnce(function()
		    	{this.field.fieldStateData[i-1][j]=0;},0.5);
		}
		this.leftCount++;
		return this.leftCount;
	},
	 /** 上探索 右探索 下探索 左探索 ここまで **/
	 

    /** クリックした座標位置をもらい、整えた位置を返す関数 ここから**/
    rectInPosition:function(pos){
		//座標を整える
		var i = this.parsePtoZx(pos.x);
		var j = this.parsePtoZy(pos.y);
		fixPos = cc.p(i*40+BLOCK_POSITION_X, j*40+BLOCK_POSITION_Y);	
		cc.log("rectInPositionメソッド: posx="+pos.x + " posy="+pos.y + "を整えた座標に変化する i=" +fixPos.x +" j="+ fixPos.y);
		//座標位置を返す
		return fixPos;
    },
    /** クリックした座標位置をもらい、整えた位置を返す関数 ここまで**/
    
    
    /** タッチ位置よりfieldDataに爆弾ステートをセットする関数 ここから **/
    setBomOnField:function(pos){
		var i = this.parsePtoZx(pos.x);
		var j = this.parsePtoZy(pos.y);
	
		//爆弾を設置
		this.field.fieldStateData[i][j] = 4;
    },
    /** タッチ位置よりfieldDataに爆弾ステートをセットする関数 ここまで **/
    
    
    /** タッチしたx座標をfieldDataの添字に変換する関数 ここから **/
    parsePtoZx:function(x){
		var i = parseInt((x - BLOCK_POSITION_X) / 40);
		if(i > 8) i=8;
		return i;
    },
     /** タッチしたx座標をfieldDataの添字に変換する関数 ここまで **/
     
     
     /** タッチしたy座標をfieldDataの添字に変換する関数 ここから **/
    parsePtoZy:function(y){
		var j = parseInt((y - BLOCK_POSITION_Y) / 40);
		if(j > 8) j=8;
		return j;
    },
     /** タッチしたy座標をfieldDataの添字に変換する関数 ここまで **/
    
    
    /** GameOver時に実行する関数 ここから **/
    onGameover:function(){
		var audioEngine = cc.AudioEngine.getInstance();
		audioEngine.playEffect(s_explosion06); // 爆発音
		audioEngine.stopMusic(s_cyber06);
		
		var transition = cc.TransitionFade.create(1.0,new ResultScene());
		cc.Director.getInstance().replaceScene(transition);	
    },
     /** GameOver時に実行する関数 ここまで **/
    
    
    /** タッチイベントに関する関数 ここから **/
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
     /** タッチイベントに関する関数 ここまで **/
    
});
/** Layerクラス ここまで **/



var SampleScene = cc.Scene.extend({
    onEnter:function(){
    	/*
		var audioEngine = cc.AudioEngine.getInstance();
		audioEngine.playMusic(s_cyber06, true); // BGM
		*/
		
		this._super();
		var layer = new Sample();
		layer.init();
		this.addChild(layer);
	}
});
