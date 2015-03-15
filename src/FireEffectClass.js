
var FireEffect = cc.Layer.extend({
    
    upFindCount:0,
    downFindCount:0,
    rightFindCount:0,
    leftFindCount:0,
    
    init:function(){
	this._super();	
    },
    /*
    fireDebugView:function(){
	//現在のfieldStateDateを表示する関数
	for(var i = 0; i<this.fireData.length; i++){
	    for(var j = 0; j < this.fireData[i].length; j++){
		//デバッグ用 タッチ位置の表示
		//this.firesDebug[i*9+j].setString(this.fireData[i][j]);
		this.firesDebug[i*9+j].setString(1);
	    }
	}
    },
    */
    
    bomFire:function(firePower,bomPos){
	//fireDataの管理と爆発のエフェクトを表示する関数
	this.fires = [];
	for(var j = 0; j<4; j++){//炎は4方向
	    var fire = cc.ParticleFire.create();
	    fire.setTexture(cc.TextureCache.getInstance().addImage(s_bom));
	    fire.setPosition(bomPos);
	    /*
	    var fire = cc.ParticleSystem.create(100);
	    fire.setEmitterMode(cc.PARTICLE_MODE_GRAVITY);
	    fire.setPosVar({x:5,y:20});
	    fire.setEmissionRate(800);
	    fire.setDuration(0.2);
	    fire.setLife(3.00);
	    fire.setStartColor(cc.color(227, 104, 104, 255));
	    fire.setStartColorVar(cc.color(5, 5, 5, 0));
	    fire.setEndColor(cc.color(0, 0, 0, 255));
	    fire.setEndColorVar(cc.color(0, 0, 0, 0));
	    fire.setPosition(pos);
	    fire.setAutoRemoveOnFinish(true);
	    fire.setTexture( cc.Sprite.create(res.i_particle).getTexture() );
	    */
	    //this.addChild(particle,10);
	    
	    this.addChild(fire);
	    this.fires.push(fire);
	}
	//並列処理 spawn アニメーションを追加する可能性があるのでspawn
	var spawnUp = cc.Spawn.create(
	    cc.MoveBy.create(0.5,cc.p(0,this.upFindCount * 40))//上 Byは現在位置からの相対値
	);
	var spawnDown = cc.Spawn.create(
	    cc.MoveBy.create(0.5,cc.p(0,this.downFindCount * -40))//上 Byは現在位置からの相対値
	);
	var spawnRight = cc.Spawn.create(
	    cc.MoveBy.create(0.5,cc.p(this.rightFindCount * 40,0))//上 Byは現在位置からの相対値
	);
	var spawnLeft = cc.Spawn.create(
	    cc.MoveBy.create(0.5,cc.p(this.leftFindCount * -40,0))//上 Byは現在位置からの相対値
	);
	
	//コールバックの設定 表示し終えたら消す
	var actionCb0 = cc.CallFunc.create(function () {
	    this.removeChild(this.fires[0]); },this);
	var actionCb1 = cc.CallFunc.create(function () {
	    this.removeChild(this.fires[1]); },this);
	var actionCb2 = cc.CallFunc.create(function () {
	    this.removeChild(this.fires[2]); },this);
	var actionCb3 = cc.CallFunc.create(function () {
	    this.removeChild(this.fires[3]); },this);	    
	
	//順次処理 sequence
	var sequenceUp = cc.Sequence.create(spawnUp, actionCb0);
	var sequenceDown = cc.Sequence.create(spawnDown, actionCb1);
	var sequenceRight = cc.Sequence.create(spawnRight, actionCb2);
	var sequenceLeft = cc.Sequence.create(spawnLeft, actionCb3);
	
	this.fires[0].runAction(sequenceUp);
	this.fires[1].runAction(sequenceDown);
	this.fires[2].runAction(sequenceRight);
	this.fires[3].runAction(sequenceLeft);	    
    },
    
    update:function(dt){
	//更新処理
	//ブロック破壊
    },
  
});

FireEffect.create = function(){
    var fire = new FireEffect();
    fire.init();
    return fire;
};

