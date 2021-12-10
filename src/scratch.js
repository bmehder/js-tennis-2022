if (isDeuce) {
	state.score[winner].game = "Ad"
	return
}
if (state.score[winner].game === "Ad") {
	console.log('Game Over')
	state.score[winner].game = "0"
	state.score[loser].game = "0"
	return
}
if (state.score[loser].game === "Ad") {
	console.log('Game Over')
	state.score[winner].game = "40"
	state.score[loser].game = "40"
	return
}