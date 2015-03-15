var g = {
    score:0,
    delay:0,
};

var Result = cc.Layer.extend({
    init:function(){
	this._super();
	var size = cc.Director.getInstance().getWinSize();
	
	var resultLabel = cc.LabelTTF.create("今回のスコア" + g.score,"Arial",20);
	resultLabel.setPosition(cc.p(size.width/2,size.height/2));
	this.addChild(resultLabel);

	//localStorageの名前付けsampleが小文字になっていた
	//var highScore = parseInt(sys.localStorage.getItem("sample/highScore")||0);
	var highScore = parseInt(sys.localStorage.getItem("Sample/highScore")||0);
	if(g.score > highScore){
	    highScore = g.score;
	    sys.localStorage.setItem("Sample/highScore",highScore);
	}
	    var highLabel = cc.LabelTTF.create("ハイスコア"+highScore,"Arial",20);
	    highLabel.setPosition(cc.p(size.width/2,size.height/2-50));
	    this.addChild(highLabel);
	    
	    this.scheduleOnce(function(){
		this.onTouchesBegan = function(touches,event){
		    g.score = 0;
		    cc.Director.getInstance().replaceScene(new SampleScene());
		};
	    },2.0);

	this.setTouchEnabled(true);
	return true;
	},
    
    onTouchesBegan:function(touches,event){},
    onTouchesMoved:function(touches,event){},
    onTouchesEnded:function(touches,event){},
    onTouchesCancelld:function(touches,event){},
});

var ResultScene = cc.Scene.extend({
    //onEnter:Function(){//function()は小文字
    onEnter:function(){
	this._super();
	var layer = new Result();
	layer.init();
	this.addChild(layer);
	}
});

