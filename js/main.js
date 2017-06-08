var deck;
var newDeck = function(){
	$.ajax({
		method:"GET",
		url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6",
		success: function(response){
			deck = response.deck_id
			console.log(deck)
		}
	})
}

newDeck();

var dealerHand = [];
var playerHand = [];
var remain;

var newCards = function(hand, amount){
	$.ajax({
		method:"GET",
		url: "https://deckofcardsapi.com/api/deck/" + deck + "/draw/?count=" + amount,
		success: function(response){
			for(var i = 0; i < amount; i++){
				hand.push(response.cards[i])
				remain = response.remaining
			}
		}
	})
}

var checkWin = function(hand){
	var score = 0;
	for(var i = 0; i < hand.length; i++) {
		var val = hand[i].value
		if(val === "JACK" || val === "KING" || val === "QUEEN"){
			score = score + 10
		}else if(val === 'ACE'){
			score = score + 11
		}else score = score + Number(val)
	}
	console.log(score)
}

$('#dealBtn').click(function(){
	if(playerHand.length === 0 & dealerHand.length === 0){
		newCards(playerHand, 2);
		newCards(dealerHand, 2);
		console.log(playerHand);
		console.log(dealerHand);
	}
	checkWin(playerHand);
	checkWin(dealerHand);
})

$('#hitBtn').click(function(){
	if(playerHand.length >= 2){
		newCards(playerHand, 1)
		console.log(playerHand)
	}
})


