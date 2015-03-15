
var Bom = cc.Sprite.extend({

    state:0,
    timer:0,
    firePower:0,

    init:function(file){
	this._super(file);
	
	this.setPosition(100,100);
	//ボムの状態 0:非設置 1:通常ボム設置 2:スイッチボム設置
	this.state = 0;
	//ボムの爆発までのカウント用
	this.timer = Bom.TIMER;
	//火力 とりあえず初期値を3とする
	this.firePower = 3;
	this.setAnchorPoint(cc.p(-0.5,-0.5));
	this.setScale(0.5);
	this.scheduleUpdate();
	
	},
    	
    update:function(dt){
	//更新処理
	//ブロック破壊
	//ブロック落下
	if(this.timer < Bom.TIMER && this.timer % 100 ==0){
	    //cc.log("大きくなる！");
	    this.setScale(0.5);
	}
	else if(this.timer < Bom.TIMER && this.timer % 50 ==0){
	    //cc.log("小さくなる!");
	    this.setScale(0.6);
	}
    },
  
});

//ボム最大数
Bom.NUM = 5;
//ボム爆発までのタイマー
Bom.TIMER = 300;

Bom.create = function(file){
    var bom = new Bom();
    bom.init(file);
    return bom;
};


    
