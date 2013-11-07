function Hanoi(n, x, y, width, height) {
	this.n = n;
	this.curr = 0;
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	
	this.stick = {
		x: this.x+(0.5-0.005)*this.width, 
		y: this.y+(0.05)*this.height,
		width: 0.01*this.width,
		height: 0.9*this.height
	};
	
	this.base = {
		x: this.x+0.05*this.width,
		y: this.y+(0.05+0.9)*height,
		width: 0.9*this.width,
		height: 0.01*this.height
	}
	
	this.plates = new Array();
}

Hanoi.prototype.addPlate = function(i) { // i as size
	this.curr++;
	this.plates.push({
		x: this.base.x + this.base.width/2
			-(i+1)/this.n*this.base.width/2,
		y: this.base.y-0.9*this.stick.height*this.curr/this.n,
		width: (i+1)/this.n*this.base.width,
		height: 0.9*this.stick.height/this.n,
	});
}

Hanoi.prototype.reset = function() {
	this.curr = 0;
	while (this.plates.length!=0)
		this.plates.pop();
}