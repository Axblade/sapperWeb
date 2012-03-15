var sapperGame = {
	numberOfFields: 100,
	numberOfMines: 10,
	currentNumberOfMines: 0,
	putFlag: false,
	endGame: "no"
}

sapperGame.tileType = [
	"empty",
	"mine"
];


$(function(){
	setUpFlag();
	setUpRenew();
	setUpFinish();

	// clone 100 copies of the card
	for(var i = 0; i < sapperGame.numberOfFields - 1; i++){
		$(".tile:first-child").clone().appendTo("#field");
	}
	// initialize each card's position
	var i = 0;
	$("div#field").children().each(function(index) {
	  // align the cards to be 10x10 ourselves.
	  	$(this).css({
	    	"left" : ($(this).width()  + 5) * (index % 10),
	        "top"  : ($(this).height() + 5) * Math.floor(index / 10)
		});
		
		// mine lander
		var chanse = 0.095;
		if (i / (sapperGame.numberOfFields - i) > 0.3)
			chanse = 0.195;
			
		if (sapperGame.currentNumberOfMines < sapperGame.numberOfMines) {
			var type = getTileType(chanse);
		} else {
			var type = sapperGame.tileType[0];
		}	
		
		if (type == "mine")
			sapperGame.currentNumberOfMines++;
			
		$(this).find(".downside").addClass(type);
		$(this).attr("data-pattern", type);
		$(this).attr('id', i);
		
		// click listener
		$(this).click(selectTile);
		// tile index
		i++;
	});
	renewCounter();
});

// menu setup
// flag insertion setup
function setUpFlag() {
	$("div.flag-tile").click(function() {
		if (!sapperGame.putFlag) {
			sapperGame.putFlag = true;
			$(this).removeClass("disabled");
			$(this).addClass("enabled");
		} else {
			sapperGame.putFlag = false;
			$(this).removeClass("enabled");
			$(this).addClass("disabled");
		}
	});
}

// renew game button
function setUpRenew() {
	$('div.renew-tile').click(function() {
		var result = confirm("Are you sure want to reload game?");
		if (result) {
			location.reload();
		}
	});
}

// finish game
function setUpFinish() {
	$('div.check-tile').click(function() {
		if ($('div.flagged').length != sapperGame.currentNumberOfMines) {
			sapperGame.gameEnd = "lost";
			var result = confirm("Are you sure want to finish game?");
			if (result ==  true) {
				checkForGameEnd();
			}
		} else {
			// check if all mines are marked
			var result = true;
			$('*[data-pattern=mine]').each(function(index) {
				if (!$(this).hasClass('flagged')) {
					result = false;
				}
			});
			if (result == true) {
				sapperGame.gameEnd = "win";
			} else {
				sapperGame.gameEnd = "lost";
			}
			checkForGameEnd();
		}
	});
}

// field setup
function getTileType(chanse) {
	var rand;
	if (Math.random() > chanse) {
		rand = 0;
	} else {
		rand = 1;
	}
	return sapperGame.tileType[rand];
}

// click listener for tile.click
function selectTile() {
	if (!sapperGame.putFlag) {
		// open tile
		if ($(this).children(".flagged").length ) {
			// remove flag
			$(this).children(".upside").removeClass("flagged");
		} else {
			// open tile
			$(this).addClass("tile-flipped");

			if ($(this).attr('data-pattern')  == 'empty') {
				// add number to tile
				var mineCounter = checkAreaForMines($(this));
				if (mineCounter > 0) {
					$(this).find(".downside").text(mineCounter);
					if (mineCounter == 1) {
						$(this).css({ 'color' : 'blue' });
					} else if (mineCounter == 2) {
						$(this).css({ 'color' : 'yellow' });
					} else {
						$(this).css({ 'color' : 'red' });
					}
				}
			} else {
				// it was a good game
				$('*[data-pattern=mine]').removeClass('flagged');
				$('*[data-pattern=mine]').addClass('tile-flipped');
				sapperGame.gameEnd = "lost";				
			}
		}
	} else {
		// add flag
		$(this).children(".upside").addClass("flagged");
	}
	checkForGameEnd();
	renewCounter();
}


// check near tiles for mines
function checkAreaForMines(tile) {
	var i = 0;
	var id = parseInt(tile.attr('id'));

	if (id % 10 == 0) {
		// without left
    	if (tile.parent().children('#' + (id - 10)).attr('data-pattern') == 'mine')
   			i++;
    	if (tile.parent().children('#' + (id - 9)).attr('data-pattern') == 'mine')
    		i++;
    	if (tile.parent().children('#' + (id + 1)).attr('data-pattern') == 'mine')
   			i++;
    	if (tile.parent().children('#' + (id + 10)).attr('data-pattern') == 'mine')
   			i++;
    	if (tile.parent().children('#' + (id + 11)).attr('data-pattern') == 'mine')
   			i++;
	} else if (id % 10 == 9) {
		// without right
		if (tile.parent().children('#' + (id - 11)).attr('data-pattern') == 'mine')
   			i++;
    	if (tile.parent().children('#' + (id - 10)).attr('data-pattern') == 'mine')
   			i++;
    	if (tile.parent().children('#' + (id - 1)).attr('data-pattern') == 'mine')
   			i++;
    	if (tile.parent().children('#' + (id + 9)).attr('data-pattern') == 'mine')
   			i++;
    	if (tile.parent().children('#' + (id + 10)).attr('data-pattern') == 'mine')
   			i++;
	} else {
		// all around
    	if (tile.parent().children('#' + (id - 11)).attr('data-pattern') == 'mine')
   			i++;
    	if (tile.parent().children('#' + (id - 10)).attr('data-pattern') == 'mine')
   			i++;
    	if (tile.parent().children('#' + (id - 9)).attr('data-pattern') == 'mine')
    		i++;
    	if (tile.parent().children('#' + (id - 1)).attr('data-pattern') == 'mine')
   			i++;
    	if (tile.parent().children('#' + (id + 1)).attr('data-pattern') == 'mine')
   			i++;
    	if (tile.parent().children('#' + (id + 9)).attr('data-pattern') == 'mine')
   			i++;
    	if (tile.parent().children('#' + (id + 10)).attr('data-pattern') == 'mine')
   			i++;
    	if (tile.parent().children('#' + (id + 11)).attr('data-pattern') == 'mine')
   			i++;
	}
	return i;
}

// counter reload when tile is flagged
function renewCounter() {
	$(".counter").text(sapperGame.currentNumberOfMines - $('.flagged').length);
}

// if game is done
function checkForGameEnd() {
	if (sapperGame.gameEnd == "lost") {
		// game is lost
		setTimeout(function() {
			var result = confirm("You have lost this game! Try again?");
			if (result) {
				location.reload();
			} else {
				$("div#field > div").click(function() {
					// remove click listener
				});
			}
		}, 1000);
	} else if (sapperGame.gameEnd == "win") {
		//game is won
		setTimeout(function() {
			var result = confirm("You win! Try again?");
			if (result) {
				location.reload();
			}
		}, 1000);
	}
}