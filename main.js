//$(document).ready(function(){


function onStartClick() {
	n = prompt('Enter the number of plates', '3');
	m = prompt('Enter the number of sticks', '3');
	qlearning = new Qlearning(n, m);
	qlearning.generateR();
	qlearning.generateQ();
	$("#start").hide();
	
	hanois = new Array(m);
	width = document.getElementById("hanoi").width/m;
	height = document.getElementById("hanoi").height;
	for (i=0; i<m; i++) {
		hanois[i] = new Hanoi(n, width*i, 0, width, height);
	} 
	showHanoi();
	$("#next").show();
	$("#back").show();
}

function onNextClick() {
	if (!qlearning.next()) return;
	showHanoi();
	console.log(qlearning.currState);
	console.log(qlearning.currV);
	console.log("");
}

function onBackClick() {
	if (!qlearning.back()) return;
	showHanoi();
	console.log(qlearning.currState);
	console.log(qlearning.currV);
	console.log("");
}

function showHanoi() {
	var canvas = document.getElementById("hanoi");
	var cxt = canvas.getContext("2d");
	cxt.clearRect(0, 0, canvas.width, canvas.height);
	for (stick=0; stick<m; stick++) {
		hanois[stick].reset();
	}
	
	for (plate=n-1; plate>=0; plate--) { // add plates reversely
		stick = qlearning.currState[plate];
		hanois[stick].addPlate(plate);
	}
	for (i=0; i<m; i++) {
		cxt.fillStyle="#000000";
		stick = hanois[i].stick;
		cxt.fillRect(stick.x, stick.y, stick.width, stick.height);
		base = hanois[i].base;
		cxt.fillRect(base.x, base.y, base.width, base.height);
		
		cxt.fillStyle = "#FF0000";
		plates = hanois[i].plates;
		console.log("plates are", plates);
		for (j=0; j<plates.length; j++) {
			plate = plates[j];
			cxt.fillRect(plate.x, plate.y, plate.width, plate.height);
		}
	}
}

//});



