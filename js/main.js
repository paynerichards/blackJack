var deck;
var newDeck = function(){
	$.ajax({
		method:"GET",
		url: "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6",
		success: function(response){
			deck = response.deck_id
			console.log(response.deck_id)
		}
	})
}

newDeck();

var gambler = {
	name: 'gambler',
	hand: [],
	score: 0,
	handDisplay: $('.gamblerCards'),
	wins: 0,
	stand: false
}

var dealer = {
	name: 'dealer',
	hand: [],
	score: 0,
	handDisplay: $('.dealerCards'),
	wins: 0,
	secondCard: false
}

var gameOver = false;

var remain;

var newCards = function(player, amount){
	$.ajax({
		method:"GET",
		url: "https://deckofcardsapi.com/api/deck/" + deck + "/draw/?count=" + amount,
		success: function(response){
			for(var i = 0; i < amount; i++){
				player.hand.push(response.cards[i])
				remain = response.remaining
				player.handDisplay.append('<img class="card" src="' + response.cards[i].image + '">')
			}
			tallyScore(player);
			emptyDeck();
			if(gambler.score >= 21 || dealer.score >= 21){
				checkWin();
			}
			else if(dealer.score >= 17 && gambler.stand === true){
				checkWin();
			}
			hideCard();
			
		}
	})
}

var emptyDeck = function(){
	if(remain < 4){
		newDeck()
	}
}


var tallyScore = function(player){
	player.score = 0;
	for(var i = 0; i < player.hand.length; i++) {
		var val = player.hand[i].value
		if(val === "JACK" || val === "KING" || val === "QUEEN"){
			player.score = player.score + 10
		}else if(val === 'ACE'){
			if(player.score <= 10){
				player.score = player.score + 11
			}else if(player.score > 10){
				player.score = player.score + 1
			}
		}
		else player.score += Number(val)
			
	}console.log(player.name + " score: " + player.score)
}

var checkWin = function(){
	if(gambler.score > 21 || (dealer.score > gambler.score && dealer.score <= 21) && gameOver === false){
		console.log('dealer Win');
		dealer.wins++
		$('#dealerScore').text('Dealer: ' + dealer.wins)
		// alert('Dealer Wins :(')
		gameOver = true;
	}else if(dealer.score > 21 || (gambler.score >= dealer.score && gambler.score <= 21) && gameOver === false){
		console.log('gambler Win');
		gambler.wins++
		$('#gamblerScore').text('Player: ' + gambler.wins)
		// alert('Player Wins!')
		gameOver = true;
	}
}

var newRound = function(){
	dealer.hand = [];
	gambler.hand = [];
	newCards(gambler, 2);
	newCards(dealer, 2);
	gambler.stand = false;
	gameOver = false;
}

var hideCard = function(){
	if(dealer.hand.length === 2 && gambler.hand.length === 2 && gameOver === false){
		$($('.card')[1]).hide()
		dealer.handDisplay.append('<img id="hiddenCard" src="media/cardBack.jpg">')
	}else if(dealer.hand.length === 2 && gameOver === false){
		$($('.card')[1]).hide()		
	}

	else{
		$('#hiddenCard').remove()
		$($('.card')[1]).show()

	}
}


$('#dealBtn').click(function(){
	
	if(gambler.hand.length === 0 && dealer.hand.length === 0){
		console.log('deal')	
		newRound();
	}else if(gameOver === true){
		$('.card').remove()
		console.log('deal')
		newRound();
		gameOver = false;

	}

	
})

$('#hitBtn').click(function(){
	
	if(gambler.hand.length >= 2 && gambler.score < 21 && dealer.score < 21 && gameOver === false){
		console.log('hit');
		newCards(gambler, 1);
	}

})

$('#standBtn').click(function(){
	if(dealer.score < 17 && gambler.score <= 21 && gameOver === false){
		console.log('stand');
		newCards(dealer, 1);
	}
	else if( gameOver === false){
		console.log('stand');
		checkWin()
		hideCard()
	}
	gambler.stand = true;
})






// gambler.score > dealer.score &&

















