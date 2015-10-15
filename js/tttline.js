var TTTLine = (function(){
	return function(aCells){
		var cells = aCells;
		var cellsCount = function(kind){
			return cells.filter(function(cell){ return cell.kind == kind; }).length;
		};
		this.isFinished = function(){
			if (cells[0].kind == 0 && cells[1].kind == 0 && cells[2].kind == 0) {
				return 0;
			}
			if (cells[0].kind == 1 && cells[1].kind == 1 && cells[2].kind == 1) {
				return 1;
			}
			return false;
		};
		this.canWinOneMove = function(kind){
			return cellsCount(kind) == 2 && cellsCount(-1) == 1;
		};
		this.firstFreeCellMove = function() {
			return cells.filter(function(cell){ return cell.kind == -1; })[0].place;
		};
		this.containPlace = function(place) {
			return cells.some(function(cell){ return cell.place == place; });
		};
		this.hasNoMarks = function(kind) {
			return cells.every(function(cell){ return cell.kind != kind; });
		};
		this.getCellContent = function(index){
			return cells[index].kind;
		};
		this.getCells = function(index){
			return cells;
		};
	};
})();