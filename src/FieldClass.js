BLOCK_SIZE = 39;
BLOCK_POSITION_X = 60;
BLOCK_POSITION_Y = 60;

/** キャンバスのサイズ  **/
CANVAS_SIZE_X = 480;
CANVAS_SIZE_Y = 480;

var Field = cc.Layer.extend({
    
    /** 初期化関数 ここから **/
    init:function(){
		this._super();
	
		var bg = cc.LayerGradient.create(
		    cc.c4b(255,255,255,128),
		    cc.c4b(0,0,255,128),
		    cc.p(0,1)
		);
		this.addChild(bg);
		
		//２次元配列フィールドデータ
		//フィールドの表示用データ 3:外壁 4:正面から見える壁 5:何もなし
		//左に90度回転したらOK
		this.fieldViewData=[
		    [3,4,4,4,4,4,4,4,3],//fieldViewData[0][0]~[0][8]
		    [3,5,5,5,5,5,5,5,3],
		    [3,5,4,5,4,5,4,5,3],
		    [3,5,5,5,5,5,5,5,3],
		    [3,5,4,5,4,5,4,5,3],
		    [3,5,5,5,5,5,5,5,3],
		    [3,5,4,5,4,5,4,5,3],
		    [3,5,5,5,5,5,5,5,3],
		    [3,4,4,4,4,4,4,4,3],
		];

		//0:何もなし 1:壁 2:予約 3:予約 4:爆弾がある 5:予約 6: 7:火の海
		this.fieldStateData=[
		    [1,1,1,1,1,1,1,1,1],//fieldStateData[0][0]~[0][8]
		    [1,4,0,0,0,0,0,0,1],
		    [1,0,1,0,1,0,1,0,1],
		    [1,0,0,0,0,0,0,0,1],
		    [1,0,1,0,1,0,1,0,1],
		    [1,0,0,0,0,0,0,0,1],
		    [1,0,1,0,1,0,1,0,1],
		    [1,0,0,0,0,0,0,0,1],
		    [1,1,1,1,1,1,1,1,1],
		];

		//フィールドのブロック表示
		this.blocks = [];
		for(var i = 0; i<this.fieldViewData.length; i++){
		    for(var j = 0; j < this.fieldViewData[i].length; j++){
				if(this.fieldViewData[i][j] == 3){
				    var block = cc.Sprite.create();//後ほど画像を変えるのでここは別々のif文内でよい
				    block.setTextureRect(cc.rect(0,0,BLOCK_SIZE,BLOCK_SIZE));
				    block.setColor(cc.c3b(255,122,0));
				    block.setPosition(cc.p(i*40+BLOCK_POSITION_X
							   , j*40+BLOCK_POSITION_Y));
				    block.setAnchorPoint(cc.p(0,0));
				    this.addChild(block,6);
				}
				if(this.fieldViewData[i][j] == 4){
				    var block = cc.Sprite.create();
				    block.setTextureRect(cc.rect(0,0,BLOCK_SIZE,BLOCK_SIZE));
				    block.setColor(cc.c3b(0,255,255));
				    block.setPosition(cc.p(i*40+BLOCK_POSITION_X
							   , j*40+BLOCK_POSITION_Y));
				    
				    block.setAnchorPoint(cc.p(0,0));
				    this.addChild(block,6);
				}
			this.blocks.push(block);
		    }
		}
	
		this.states = [];
		for(var i = 0; i<this.fieldViewData.length; i++){
		    for(var j = 0; j < this.fieldViewData[i].length; j++){
				//デバッグ用 タッチ位置の表示　初期化
				this.fieldState = cc.LabelTTF.create(" ","Arial",17);
				this.fieldState.setAnchorPoint(cc.p(0,0));
				this.fieldState.setString(this.fieldStateData[i][j]);
				this.fieldState.setPosition(cc.p(i*40+BLOCK_POSITION_X
							    , j*40+BLOCK_POSITION_Y));
				//fieldState.setAnchorPoint(cc.p(0,0));
				this.addChild(this.fieldState,10);
				this.states.push(this.fieldState);
		    }
		}
		
		this.scheduleUpdate();
    },
    /** 初期化関数 ここまで **/
    
    /** フィールドにデバッグ情報を表示する関数 ここから **/
    stateDebugView:function(){
		//現在のfieldStateDateをリアルタイムで表示する
		for(var i = 0; i<this.fieldViewData.length; i++){
		    for(var j = 0; j < this.fieldViewData[i].length; j++){
			//デバッグ用 タッチ位置の表示
			this.states[i*9+j].setString(this.fieldStateData[i][j]);
		    }
		}
    },
    /** フィールドにデバッグ情報を表示する関数 ここから **/

    update:function(dt){
		//更新処理
		//ブロック破壊
		//ブロック落下
    },
    
});



//Field.prototype.create = function(){
Field.create = function(){
    var field = new Field();
    field.init();//フィールド初期化処理(イニシャライザ)
    return field;
};
