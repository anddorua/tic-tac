var TTTField = (function(){
	return function(aTTTLineClass){
		var cells = [-1, -1, -1, -1, -1, -1, -1, -1, -1];
		var TTTLine = aTTTLineClass;
		this.getLines = function(){
			var result = [];
			result.push(new TTTLine([{place:0, kind:cells[0]},{place:1, kind:cells[1]},{place:2, kind:cells[2]}]));
			result.push(new TTTLine([{place:3, kind:cells[3]},{place:4, kind:cells[4]},{place:5, kind:cells[5]}]));
			result.push(new TTTLine([{place:6, kind:cells[6]},{place:7, kind:cells[7]},{place:8, kind:cells[8]}]));
			
			result.push(new TTTLine([{place:0, kind:cells[0]},{place:3, kind:cells[3]},{place:6, kind:cells[6]}]));
			result.push(new TTTLine([{place:1, kind:cells[1]},{place:4, kind:cells[4]},{place:7, kind:cells[7]}]));
			result.push(new TTTLine([{place:2, kind:cells[2]},{place:5, kind:cells[5]},{place:8, kind:cells[8]}]));
			
			result.push(new TTTLine([{place:0, kind:cells[0]},{place:4, kind:cells[4]},{place:8, kind:cells[8]}]));
			result.push(new TTTLine([{place:2, kind:cells[2]},{place:4, kind:cells[4]},{place:6, kind:cells[6]}]));
			return result;
		};
		this.move = function(place, kind) {
			if (cells[place] != -1) {
				return false;
			} else {
				cells[place] = kind;
				return true;
			}
		};
		this.getFreePlaces = function(){
			var freePlaces = [];
			for (var i = 0; i < 9; i++) {
				if (cells[i] == -1) {
					freePlaces.push(i);
				}
			}
			return freePlaces;
		};
		this.getCells = function(){
			return cells;
		};
	};
})();