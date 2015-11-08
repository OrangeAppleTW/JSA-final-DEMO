var c, ctx;
var bgImg, towerImg, towerButtonImg;
var towerButton;
var cursor;
var isBuilding = false;
var towers = [];
var enemies = [];
var cannonBalls = [];
var enemySpawningTime = 50;
var enemyPath = [
	{x:96, y:64},
	{x:384, y:64},
	{x:384, y:192},
	{x:224, y:192},
	{x:224, y:320},
	{x:544, y:320},
	{x:544, y:96}
];
var hp = 100;
var money = 50;
var clock = 0;
var towerPrice = 25;

$(window).load(function(){
	
	init();
	setInterval(draw, 40);

});

function init(){
	c = document.getElementById("gameCanvas");
	ctx = c.getContext("2d");
	ctx.font = "24px Arial";
	ctx.fillStyle = "white";

	bgImg = document.getElementById("bg-img");
	towerImg = document.getElementById("tower-img");
	towerButtonImg = document.getElementById("tower-btn-img");
	slimeImg = document.getElementById("slime-img");
	crosshairImg = document.getElementById("crosshair-img");
	cannonballImg = document.getElementById("cannonball-img");

	towerButton = {
		x:576, 
		y:416,
		width: 64,
		height: 64
	};

	$("#gameCanvas").mousemove(function(event) {
		cursor = {
			x: event.offsetX, 
			y: event.offsetY
		};
		// console.log(cursor.x + "," + cursor.y);
	});

	$("#gameCanvas").click(function(){
		if( 	cursor.x < towerButton.x+towerButton.width
			&&	cursor.x > towerButton.x
			&&	cursor.y < towerButton.y+towerButton.height
			&&	cursor.y > towerButton.y 						){
			
			if (!isBuilding && money>=towerPrice) {
				isBuilding = true;
			} else {
				isBuilding = false;
			}

		} else {
			if(isBuilding){
				var newTower = {
					x: parseInt(cursor.x/32)*32,
					y: parseInt(cursor.y/32)*32,
					width: 32,
					width: 32,
					range: 96,
					fireRate: 16,
					damage: 4,
					readyToShootTime: 10,
					aimingEnemyId: null,
					searchEnemy: function(){
						for(var _i=0; _i<enemies.length; _i++){
							var distance = Math.sqrt( Math.pow(this.x-enemies[_i].x,2) + Math.pow(this.y-enemies[_i].y,2) );
							if (distance<=this.range) {
								this.aimingEnemyId = _i;
								return;
							}
						}
						// 如果都沒找到，會進到這行，清除鎖定的目標
						this.aimingEnemyId = null;
					},
					shoot: function(){
						var aimedEnemy = enemies[this.aimingEnemyId];
						var offsetX = aimedEnemy.x - this.x;
						var offsetY = aimedEnemy.y - this.y;
						var distance = Math.sqrt( Math.pow(offsetX,2) + Math.pow(offsetY,2) );
						var newConnonBall = {
							startingPoint: {
								x: this.x+this.width/2,
								y: this.y
							},
							x: this.x+this.width/2,
							y: this.y,
							size: 8,
							speed: 20,
							damage: this.damage,
							hitted: false,
							direction: {
								x: offsetX/distance,
								y: offsetY/distance
							},
							move: function(){
								this.x += this.direction.x*this.speed;
								this.y += this.direction.y*this.speed;
								for(var _i=0; _i<enemies.length; _i++){
									this.hitted =  isCollided(this.x, this.y, enemies[_i].x, enemies[_i].y, enemies[_i].width, enemies[_i].height );
									if (this.hitted) {
										enemies[_i].hp -= this.damage;
										// 如果不加這行會很慘喔！
										break;
									}
								}
							}
						};
						cannonBalls.push(newConnonBall);
						this.readyToShootTime = this.fireRate;
					}
				};
				towers.push(newTower);
				isBuilding = false;
				money -= towerPrice;
			}
		}
	});
}

function isCollided(pointX, pointY, targetX, targetY, targetWidth, targetHeight) {
	if(		pointX >= targetX
		&&	pointX <= targetX + targetWidth
		&&	pointY >= targetY
		&&	pointY <= targetY + targetHeight
	){
		return true;
	} else {
		return false;
	}
}

function enemyMove(enemy) {
	enemy.x += enemy.direction.x * enemy.speed;
	enemy.y += enemy.direction.y * enemy.speed;
	if(		enemyPath[enemy.pathDes].x >= enemy.x
		&&	enemyPath[enemy.pathDes].x <= enemy.x + enemy.speed
		&&	enemyPath[enemy.pathDes].y >= enemy.y
		&&	enemyPath[enemy.pathDes].y <= enemy.y + enemy.speed
		){

		if (enemy.pathDes === enemyPath.length-1) {
			enemies.shift();
			hp -= 10;
		} else {
			enemy.x = enemyPath[enemy.pathDes].x;
			enemy.y = enemyPath[enemy.pathDes].y;

			enemy.pathDes++;

			if( enemyPath[enemy.pathDes].x > enemy.x ){
				enemy.direction.x = 1;
			} else if ( enemyPath[enemy.pathDes].x < enemy.x ){
				enemy.direction.x = -1;
			} else {
				enemy.direction.x = 0;
			}

			if( enemyPath[enemy.pathDes].y > enemy.y ){
				enemy.direction.y = 1;
			} else if ( enemyPath[enemy.pathDes].y < enemy.y ){
				enemy.direction.y = -1;
			} else {
				enemy.direction.y = 0;
			}
		}
	}
}

function spawnEnemy(){
	newEnemy = {
		x: 96,
		y: 448,
		width: 32,
		height: 32,
		speed: 2,
		pathDes: 0,
		hp: 10,
		direction: {x:0, y:-1},
		money: 3
	};
	enemies.push(newEnemy);
}

function draw () {

	if(clock%enemySpawningTime===0){
		spawnEnemy();
	}

	ctx.drawImage(bgImg,0,0);
	ctx.drawImage(towerButtonImg, towerButton.x, towerButton.y, towerButton.width, towerButton.height);
	if(isBuilding){
		ctx.drawImage(towerImg, parseInt(cursor.x/32)*32, parseInt(cursor.y/32)*32, 32, 32);
	}

	for(var _i=0; _i<enemies.length; _i++){
		enemyMove(enemies[_i]);
		if (enemies[_i].hp<=0) {
			money += enemies[_i].money;
			enemies.splice(_i,1);
		} else {
			ctx.drawImage( slimeImg, enemies[_i].x, enemies[_i].y, enemies[_i].width, enemies[_i].height );
		}
	}

	for(var _i=0; _i<towers.length; _i++){
		towers[_i].searchEnemy();
		ctx.drawImage(towerImg, towers[_i].x, towers[_i].y, 32, 32);
		if ( towers[_i].aimingEnemyId!=null ) {
			var id = towers[_i].aimingEnemyId;
			ctx.drawImage( crosshairImg, enemies[id].x, enemies[id].y, enemies[id].width, enemies[id].height );
			if ( towers[_i].readyToShootTime === 0 ){
				towers[_i].shoot();
			}
		}
		if(towers[_i].readyToShootTime>0){
			towers[_i].readyToShootTime--;
		}
	}

	for(var _i=0; _i<cannonBalls.length; _i++){
		cannonBalls[_i].move();

		if (cannonBalls[_i].hitted) {
			cannonBalls.splice(_i,1);
		} else {
			ctx.drawImage( cannonballImg, cannonBalls[_i].x, cannonBalls[_i].y, cannonBalls[_i].size, cannonBalls[_i].size );
		}
	}

	ctx.fillText("HP: "+hp, 16, 32);
	ctx.fillText("Money: "+money, 16, 64);

	clock++;

}






