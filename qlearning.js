
function Edge(v, w) {
	this.v = v;
	this.w = w;
}

function Graph(n) {
	/* this.vertices = new Array(n); */
	this.edges = new Array(n);
	for (i=0; i<n; i++) this.edges[i] = new Array();
	this.n = n;
}

Graph.prototype.addEdge = function(u, v, w) {
	this.edges[u].push(new Edge(v, w));
};

////////////

function Qlearning(n, m) {
	// currState[i] = j means plate i in stick j
	this.gamma = 0.8; // praise rate
	this.initWeight = 100;
	
	this.nPlates = n; // number of plates
	this.nSticks = m;
	
	this.dst = Math.pow(this.nSticks, this.nPlates) -1;
	this.currState = new Array();
	this.currState.length = n;
	for (i=0; i<this.currState.length; i++) 
		this.currState[i] = 0;
	this.currV = 0;
	this.path = new Array();
	this.dstState = new Array();
	for (i=0; i<this.dstState.length; i++)
		this.dstState[i] = this.dst;
	
	this.R = new Graph(this.dst+1);
	this.Q = new Graph(this.dst+1);
}

Qlearning.prototype.resetState = function() {
	for (i=0; i<this.nPlates; i++) {
		this.currState[i] = 0; // place all plates on stick 0
		this.dstState[i] = dst;	
	}
	this.currV = 0;
	delete this.path;
	this.path = new Array();
	this.path.push(0);
}

Qlearning.prototype.generateR = function() {
	nPlates = this.nPlates;
	nSticks = this.nSticks;
	for (u=0; u<=this.dst; u++) { // enumerate possible states
		state = this.getStateArr(u);
		tops = this.getTops(state);	
		for (stick1=0; stick1<nSticks; stick1++) {
			for (stick2=0; stick2<nSticks; stick2++) {
				//if (stick1==stick2) continue; // allow or not?
				if (tops[stick1]!=-1 && // at least one is left
						(tops[stick1]<tops[stick2] ||
						 tops[stick2]==-1)) { // stick1->stick2
					moved = tops[stick1]; // in order to restore
					state[tops[stick1]] = stick2;
					v = this.getStateNum(state);
					if (v==this.dst)
						this.R.addEdge(u, v, this.initWeight);
					else
						this.R.addEdge(u, v, 0);
					state[moved] = stick1;	
				}
			}
		}
		
	}
};

Qlearning.prototype.generateQ = function() {
	// clone R, but substitute w as 0, 
	// and set edge to dst as this.initWeight
	for (u=0; u<=this.dst; u++) { // enumerate state u
		for (i=0; i<this.R.edges[u].length; i++) { // tranverse R.edges
			edge = this.R.edges[u][i];
			this.Q.edges[u].push(new Edge(edge.v, 0));
		}
	}
	
	// make out Q
	do {
		isSet = false;
		for (u=0; u<=this.dst; u++) { // enumerate src u
			for (i=0; i<this.Q.edges[u].length; i++) {
				quv = this.Q.edges[u][i];
				ruv = this.R.edges[u][i];
				v = quv.v;
				maxQvrW = 0;
				for (j=0; j<this.Q.edges[v].length; j++) {
					qvr = this.Q.edges[v][j];
					if (qvr.w>maxQvrW) 
						maxQvrW = qvr.w;
				}
				tmp = ruv.w + this.gamma*maxQvrW;
				if (tmp>quv.w) {
					isSet = true;
					quv.w = tmp;
				}
			}
		}
	} while (isSet);	
};

Qlearning.prototype.next = function() {
	max = 0;
	u = this.currV;
	if (u==this.dst) return false; // already reached
	for (i=0; i<this.Q.edges[u].length; i++) {
		edge = this.Q.edges[u][i];
		if (edge.w > max) {
			max = edge.w;
			maxEdge = edge;
		}
	}
	this.path.push(this.currV);
	this.currV = maxEdge.v;
	this.currState = this.getStateArr(maxEdge.v);
	return true;
}

Qlearning.prototype.back = function() {
	if (this.path.length==0) return false;
	this.currV = this.path.pop();
	this.currState = this.getStateArr(this.currV);
	console.log("path is ", this.path)
	return true;
}

///////////////


Qlearning.prototype.getStateNum = function(state) {
	nPlates = this.nPlates;
	nSticks = this.nSticks;
	stateNum = 0;
	offset = 1;
	for (plate=0; plate<nPlates; plate++) {
		stateNum += state[plate]*offset;
		offset *= nSticks;
	}
	return stateNum;
};

Qlearning.prototype.getStateArr = function (stateNum) {
	nPlates = this.nPlates;
	nSticks = this.nSticks;
	state = new Array(nPlates); // translated state
	t = stateNum;
	for (plate=0; plate<nPlates; plate++) {
		state[plate] = t % nSticks;
		t = Math.floor(t / nSticks);
	}
	return state;
};

Qlearning.prototype.getTops = function(state) {
	nPlates = this.nPlates;
	nSticks = this.nSticks;
	tops = new Array(nSticks);
	for (stick=0; stick<nSticks; stick++) {
		for (plate=0; plate<nPlates; plate++) {
			if (state[plate]==stick) {
				tops[stick] = plate;
				break;
			}
			tops[stick] = -1; // no plate in this stick
		}
	}
	return tops;
};

Qlearning.prototype.getSecond = function(state, stick) {
	nPlates = this.nPlates;
	nSticks = this.nSticks;
	count = 0;
	for (plate=0; plate<nPlates; plate++) { 
		// start from the smallest plate
		if (state[plate]==stick) {
			count++;
			if (count==2) return plate;
		}
	}
	return -1; // no second; only one left
}



