var c, ctx;
var bgImg, towerImg, towerButtonImg;
var towerButton;
var cursor;
var isBuilding = false;
var towers = [];
var enemies = [];
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
var clock = 0;

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
			
			isBuilding = !isBuilding;
			console.log(isBuilding);

		} else {
			if(isBuilding){
				var newTower = {
					x: parseInt(cursor.x/32)*32,
					y: parseInt(cursor.y/32)*32,
					range: 96,
					searchEnemy: function(){
						for(var _i=0; _i<enemies.length; _i++){
							var distance = Math.sqrt( Math.pow(this.x-enemies[_i].x,2) + Math.pow(this.y-enemies[_i].y,2) );
							if (distance<=this.range) {
								enemies[_i].isAimed = true;
								break;
							}
						}
					}
				};
				towers.push(newTower);
				isBuilding = false;
			}
		}
	});
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

function enemiesMove() {
	for(var _i=0; _i<enemies.length; _i++){
		enemyMove(enemies[_i]);
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
		direction: {x:0, y:-1},
		isAimed: false
	};
	enemies.push(newEnemy);
}

function draw () {

	if(clock%enemySpawningTime===0){
		spawnEnemy();
	}
	enemiesMove();

	ctx.drawImage(bgImg,0,0);
	ctx.drawImage(towerButtonImg, towerButton.x, towerButton.y, towerButton.width, towerButton.height);
	if(isBuilding){
		ctx.drawImage(towerImg, parseInt(cursor.x/32)*32, parseInt(cursor.y/32)*32, 32, 32);
	}
	for(var _i=0; _i<towers.length; _i++){
		towers[_i].searchEnemy();
		ctx.drawImage(towerImg, towers[_i].x, towers[_i].y, 32, 32);
	}
	for(var _i=0; _i<enemies.length; _i++){
		ctx.drawImage( slimeImg, enemies[_i].x, enemies[_i].y, enemies[_i].width, enemies[_i].height );
		if ( enemies[_i].isAimed ) {
			ctx.drawImage( crosshairImg, enemies[_i].x, enemies[_i].y, enemies[_i].width, enemies[_i].height );
			enemies[_i].isAimed = false; //如果沒有這行，即使敵人離開了，還是會被鎖定喔
		}
	}

	ctx.fillText("HP: "+hp, 16, 32);

	clock++;

}






