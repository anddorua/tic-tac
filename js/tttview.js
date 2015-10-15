var TTTView = (function(){
	return function(){
		var controller = null;
		var fhProgressSection = null;
		var fhFinishSection = null;
		var fhStartSection = null;
		var cnv = null;
		var cnvSection = null;
		var startTime = null;
		var timerSection = null;
		var stateInformerSection = null;
		var resultBannerSection = null;
		var humanSide = null;
		var timerId;
		
		var showGameTime = function(){
			var delta = new Date(Date.now() - startTime);
			var displayString = delta.toLocaleString("en-US", {minute: 'numeric', second: 'numeric'});
			timerSection.innerHTML = displayString;
		};
		
		var showHumanSide = function(){
			stateInformerSection.innerHTML = humanSide == 1 ? "X" : "0";
		};
		
		var showWinnerBanner = function(sign){
			resultBannerSection.innerHTML = sign;
		}
		
		var restartHandler = function(){
			controller.restartPressed();
		};
		var abortHandler = function(){
			controller.abortPressed();
		};
		var zeroHandler = function(){
			controller.zeroChoicePressed();
		};
		var exHandler = function(){
			controller.exChoicePressed();
		};
		var cnvClickHandler = function(e){
			var size = cnvSection.width;
			var cellX = Math.floor(e.offsetX / (size / 3));
			var cellY = Math.floor(e.offsetY / (size / 3));
			var absoluteCell = cellY * 3 + cellX;
			controller.cellClicked(absoluteCell);
		};
		
		var handlers = [
			{elem:"#restart-button", etype: "click", handler: restartHandler},
			{elem:"#abort-button", etype: "click", handler: abortHandler},
			{elem:"#zero-button", etype: "click", handler: zeroHandler},
			{elem:"#ex-button", etype: "click", handler: exHandler},
			{elem:"#cnv", etype: "click", handler: cnvClickHandler}
		];
		
		var drawFieldBackground = function(){
			cnv.fillStyle = "#f7f7f7";
			cnv.fillRect(0,0,cnvSection.width, cnvSection.height);
		};
		
		var drawSharp = function(){
			var size = cnvSection.width;
			cnv.beginPath();
			cnv.lineWidth = 3;
			cnv.moveTo(size / 3, 0); 		cnv.lineTo(size / 3, size);
			cnv.moveTo((size / 3) * 2, 0); 	cnv.lineTo((size / 3) * 2, size);
			cnv.moveTo(0, size / 3); 		cnv.lineTo(size, size / 3);
			cnv.moveTo(0, (size / 3) * 2); 	cnv.lineTo(size, (size / 3) * 2);
			cnv.strokeStyle = "#99adeb";
			cnv.stroke();
		};
		
		var drawCharInMiddle = function(x, y, letter) {
			var size = cnvSection.height / 3 * 0.6;
			cnv.font = "" + size + "px Lucida Console, monospace";
			cnv.textAlign = "center";
			cnv.textBaseline = "middle";
			cnv.fillStyle = "black";
			cnv.fillText(letter, x, y);
		};
		
		var getPlaceX = function(place){
			var size = cnvSection.width;
			return (place % 3) * size / 3 + size / 6;
		};
		
		var getPlaceY = function(place){
			var size = cnvSection.width;
			return Math.floor(place / 3) * size / 3 + size / 6;
		};
		
		var drawFieldFigures = function(fieldToDraw){
			var cells = fieldToDraw.getCells();
			for (var place = 0; place < cells.length; place++) {
				if (cells[place] != -1) {
					drawCharInMiddle(getPlaceX(place), getPlaceY(place), cells[place] == 1 ? "X" : "O");
				}
			}
		};
		
		var drawFinishLine = function(field){
			var finished = field.getLines().filter(function(line){ return line.isFinished() !== false; });
			if (finished.length > 0) {
				var place1 = finished[0].getCells()[0].place;
				var place2 = finished[0].getCells()[2].place;
				var x1 = getPlaceX(place1);
				var y1 = getPlaceY(place1);
				var x2 = getPlaceX(place2);
				var y2 = getPlaceY(place2);

				var k = 1.15;
				var lx1 = (x1 - x2) * k + x2;
				var ly1 = (y1 - y2) * k + y2;
				var lx2 = (x2 - x1) * k + x1;
				var ly2 = (y2 - y1) * k + y1;
				
				cnv.beginPath();
				cnv.lineWidth = 4;
				cnv.moveTo(lx1, ly1); 
				cnv.lineTo(lx2, ly2);
				cnv.strokeStyle = "#ff3300";
				cnv.stroke();
			}
		};
		
		this.render = function(params){
			drawFieldBackground();
			drawSharp();
			if (params.field) {
				drawFieldFigures(params.field);
			}
			if (params.winner !== undefined) {
				if (params.winner == -1) {
					showWinnerBanner("DRAW");
				} else if (params.winner == humanSide) {
					drawFinishLine(params.field);
					showWinnerBanner("YOU WIN");
				} else {
					drawFinishLine(params.field);
					showWinnerBanner("YOU LOSE");
				}
			}
		};
		
		this.init = function(aController){
			controller = aController;
			handlers.forEach(function(handlerItem){
				document.querySelector(handlerItem.elem).addEventListener(handlerItem.etype, handlerItem.handler);
			});
			fhProgressSection = document.getElementById("fh-progress");
			fhStartSection = document.getElementById("fh-start");
			fhFinishSection = document.getElementById("fh-finish");
			timerSection = document.getElementById("fh-timer");
			stateInformerSection = document.getElementById("fh-state-informer");
			resultBannerSection = document.getElementById("fh-result-banner");
			cnvSection = document.getElementById("cnv");
			cnv = cnvSection.getContext("2d");
		};
		this.showSection = function(section_name){
			fhStartSection.style.display = section_name == "start" ? "block" : "none";
			fhProgressSection.style.display = section_name == "progress" ? "block" : "none";
			fhFinishSection.style.display = section_name == "finish" ? "block" : "none";
		}
		this.setStartMode = function(){
			clearInterval(timerId);
			this.showSection("start");
		};
		this.setProgressMode = function(aHumanSide){
			humanSide = aHumanSide;
			this.showSection("progress");
			startTime = new Date();
			timerId = setInterval(showGameTime, 1000);
			showGameTime();
			showHumanSide();
		};
		this.setFinishMode = function(){
			clearInterval(timerId);
			this.showSection("finish");
		};
	}
})();