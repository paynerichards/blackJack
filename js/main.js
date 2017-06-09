var deck;
var newDeck = function(){
	$.ajax({
		method:"GET",
		url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6",
		success: function(response){
			deck = response.deck_id
			// console.log(deck)
		}
	})
}

newDeck();

var gambler = {
	hand: [],
	score: 0,
	handDisplay: $('.gamblerCards')
}

var dealer = {
	hand: [],
	score: 0,
	handDisplay: $('.dealerCards')
}



var remain;

var newCards = function(player, amount){
	$.ajax({
		method:"GET",
		url: "https://deckofcardsapi.com/api/deck/" + deck + "/draw/?count=" + amount,
		success: function(response){
			for(var i = 0; i < amount; i++){
				player.hand.push(response.cards[i])
				remain = response.remaining
				player.handDisplay.append('<img class=card src="' + response.cards[i].image + '">')
			}
			tallyScore(player)
			// console.log(player.hand)
		}
	})
}

var tallyScore = function(player){
	player.score = 0
	for(var i = 0; i < player.hand.length; i++) {
		var val = player.hand[i].value
		if(val === "JACK" || val === "KING" || val === "QUEEN"){
			player.score = player.score + 10
			// console.log("score" + player.score)
		}else if(val === 'ACE'){
			if(player.score <= 10){
				player.score = player.score + 11
				// console.log("score" + player.score)
			}else if(player.score > 10){
				player.score = player.score + 1
				// console.log("score" + player.score)
			}
		}
		else player.score += Number(val)
			
	}console.log("score" + player.score)
	// console.log(player.score)
}

var checkWin = function(){

}

var newRound = function(){
	dealer.hand = [];
	gambler.hand = [];
	newCards(gambler, 2);
	newCards(dealer, 2);
	;
	}

$('#dealBtn').click(function(){
	
	if(gambler.hand.length === 0 && dealer.hand.length === 0){
		newRound();
	}else if(gambler.score >= 21 || dealer.score >=21){
		$('.card').remove()
		newRound();

	}
	
})

$('#hitBtn').click(function(){
	if(gambler.hand.length >= 2 && gambler.score < 21 && dealer.score < 21){
		// gambler.score = 0
		newCards(gambler, 1)
	}

})


