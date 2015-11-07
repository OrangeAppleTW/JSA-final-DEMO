var c, ctx;
var bgImg, towerImg, towerButtonImg;
var towerButton;
var cursor;
var isBuilding = false;
var towers = [];

$(window).load(function(){
	
	init();
	setInterval(draw, 40);

});

function init(){
	c = document.getElementById("gameCanvas");
	ctx = c.getContext("2d");
	bgImg = document.getElementById("bg-img");
	towerImg = document.getElementById("tower-img");
	towerButtonImg = document.getElementById("tower-btn-img");
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
	});

	$("#gameCanvas").click(function(){
		if( 	cursor.x < towerButton.x+towerButton.width
			&&	cursor.x > towerButton.x
			&&	cursor.y < towerButton.y+towerButton.height
			&&	cursor.y > towerButton.y 						){
			
			isBuilding = !isBuilding;
			console.log(isBuilding);

		}
	});
}

function getMousePosition(){

}

function draw () {
	ctx.drawImage(bgImg,0,0);
	ctx.drawImage(towerButtonImg, towerButton.x, towerButton.y, towerButton.width, towerButton.height);
	if(isBuilding){
		ctx.drawImage(towerImg, parseInt(cursor.x/32)*32, parseInt(cursor.y/32)*32, 32, 32);
	}
}






