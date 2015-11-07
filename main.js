$(window).load(function(){
	var c = document.getElementById("gameCanvas");
	var ctx = c.getContext("2d");
	var bgImg = document.getElementById("bg-img");
	ctx.drawImage(bgImg,0,0);
	console.log("Ready");
});