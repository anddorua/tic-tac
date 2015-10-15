var TTTGame = (function(){
	return function(aHumanPlayerKind, FieldClass, LineClass){
		var field = new FieldClass(LineClass);
		var lastComputerMove;
		
		var getOppositeKind = function(side) { 
			return side == 1 ? 0 : 1; 
		};
		
		var computerKind = getOppositeKind(aHumanPlayerKind);
		
		this.getLastComputerMove = function(){ 
			return lastComputerMove; 
		};
		this.getHumanKind = function() { 
			return getOppositeKind(computerKind); 
		};
		this.getField = function(){
			return field;
		};
		/**
		*	returns state:
		*	
		*/
		this.getFinishedLines = function(){
			return field.getLines().filter(function(line){ var finished  = line.isFinished(); return finished === 0 || finished === 1; });
		};
		this.isFinished = function(){
			return this.getFinishedLines().length > 0 || field.getFreePlaces().length == 0;
		};
		this.getWinner = function(){
			var finished = this.getFinishedLines();
			if (finished.length > 0) {
				return finished[0].getCellContent(0);
			} else {
				return -1;
			}
		};
		this.makeHumanMove = function(place){
			return field.move(place, getOppositeKind(computerKind));
		};
		this.makeComputerMove = function(){
			// 1 - определяем, можно ли закончить игру победой в этом ходу
			var linesToWin = field.getLines().filter(function(line){ return line.canWinOneMove(computerKind); });
			if (linesToWin.length > 0) {
				lastComputerMove = linesToWin[0].firstFreeCellMove();
				field.move(lastComputerMove, computerKind);
				return 'won';
			}
			
			// 2 - определяем, можем ли помешать сопернику закончить игру победой на следующем ходу
			var humanKind = getOppositeKind(computerKind);
			var linesToLoose = field.getLines().filter(function(line){ return line.canWinOneMove(humanKind); });
			if (linesToLoose.length > 0) {
				lastComputerMove = linesToLoose[0].firstFreeCellMove();
				field.move(lastComputerMove, computerKind);
				return 'moved';
			}
			
			// 3 - определяем наиболее выгодный ход
			var possibleMoves = [];
			var allLines = field.getLines();
			field.getFreePlaces().forEach(function(freePlace){
				var linesToCatchCount = allLines.filter(function(line){ 
					return line.containPlace(freePlace) && line.hasNoMarks(humanKind); 
				}).length;
				if (linesToCatchCount > 0) {
					possibleMoves.push({place: freePlace, count: linesToCatchCount});
				}
			});
			if (possibleMoves.length > 0) {
				var bestMove = possibleMoves.sort(function(moveA, moveB){ 
					if (moveA.count < moveB.count) {
						return -1;
					} else if (moveA.count == moveB.count) {
						return 0;
					} else {
						return 1;
					}
				}).pop();
				lastComputerMove = bestMove.place;
				field.move(lastComputerMove, computerKind);
				return "moved";
			} else {
				return 'lose';
			}
		};
	};
})();