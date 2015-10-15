var TTTController = (function(){
	return function(aView) {
		var view = aView;
		/**
		* state:
		* 'wait_new_game'
		* 
		*
		*/
		var state = null;
		var humanSide = null;
		var game = null;
		
		var setProgressState = function(aHumanSide) {
			state = "progress";
			humanSide = aHumanSide;
			game = new TTTGame(humanSide, TTTField, TTTLine);
			if (humanSide == 0) {
				makeComputerMove();
				view.render({
					field: game.getField()
				});
			}
		}
		
		var setFinishedState = function(wonSide){
			state = "finished";
			view.setFinishMode();
			view.render({
				field: game.getField(),
				winner: wonSide
			});
		}
		
		var makeComputerMove = function() {
			game.makeComputerMove();
			view.render({
				field: game.getField()
			});
			if (game.isFinished()) {
				setFinishedState(game.getWinner());
			}
		};
		
		this.setWaitNewGameState = function(){
			state = 'wait_new_game';
			view.setStartMode();
			view.render({});
		};
		
		this.init = function(){
			view.init(this);
			this.setWaitNewGameState();
		};
		this.restartPressed = function(){
			this.setWaitNewGameState();
		};
		this.abortPressed = function(){
			this.setWaitNewGameState();
		};
		this.zeroChoicePressed = function(){
			console.log("zero pressed");
			setProgressState(0);
			view.setProgressMode(humanSide);
		};
		this.exChoicePressed = function(){
			console.log("ex pressed");
			setProgressState(1);
			view.setProgressMode(humanSide);
		};
		this.cellClicked = function(place){
			console.log(place);
			if (state == "progress") {
				if (game.makeHumanMove(place)) {
					view.render({
						field: game.getField()
					});
					if (game.isFinished()) {
						setFinishedState(game.getWinner());
					} else {
						makeComputerMove();
					}
				}
			}
		};
		
		this.init();
		view.render({});
	};
})();