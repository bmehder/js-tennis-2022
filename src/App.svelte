<script>
	import { match } from './state'
	import { normalGamePointIncrease } from './utils'
	
// 	Predicates
	const isDeuce = () => match.score['player1'].game === "40" && match.score['player2'].game === "40"
	const isGameOver = (winner) => match.score[winner].game === '0'
	const isSetOver = () => {
		
	}
	
// State Mutations
	const resetGameScore = () => {
		match.score['player1'].game = "0"
		match.score["player2"].game = "0"
	}
	
	const updateSet = (winner) => {
		resetGameScore()
		const currentSet = 'set' + match.currentSet
		match.score[winner][currentSet]++
		if (isSetOver()) match.currentSet++
	}
	
// 	Event handler
	const handlePoint = (theWinner) => {
		const winner = theWinner
		const loser = (winner === 'player1') ? 'player2' : 'player1'
		const winnerScore = match.score[winner].game
		const loserScore = match.score[loser].game
		
		if (isDeuce()) {
			match.score[winner].game = "Ad"
			return
		}
		
		if (loserScore === "Ad") {
			match.score[winner].game = "40"
			match.score[loser ].game = "40"
			return
		}
		
		if (winnerScore === "Ad") {
			return updateSet(winner)
		}
		
		match.score[winner].game = normalGamePointIncrease[winnerScore]
		
		if (isGameOver(winner))	updateSet(winner)
	}
	
// 	Console Logging
	$: {
		console.clear()
		console.log('Current set:', match.currentSet)
		console.log('isDeuce:', isDeuce())
		console.table(match.score)
	}
</script>

<button on:click={() => handlePoint('player1')}>Player 1</button>
<button on:click={() => handlePoint('player2')}>Player 2</button>
