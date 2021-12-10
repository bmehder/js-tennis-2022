<script>
  import { match } from './state'
  import { normalGamePointIncrease } from './utils'

  let isInProgress = true

  // 	Predicates
  const isDeuce = () =>
    match.score['player1'].game === '40' && match.score['player2'].game === '40'
  const isGameOver = winner => match.score[winner].game === '0'
  const isSetOver = () => {
    const currentSet = 'set' + match.currentSet
    return (
      (match.score['player1'][currentSet] >= 6 &&
        match.score['player1'][currentSet] -
          match.score['player2'][currentSet] >=
          2) ||
      (match.score['player2'][currentSet] >= 6 &&
        match.score['player2'][currentSet] -
          match.score['player1'][currentSet] >=
          2)
    )
  }
  const isMatchOver = winner => match.score[winner].setsWon === 2

  // State Mutations
  const resetGameScore = () => {
    match.score['player1'].game = '0'
    match.score['player2'].game = '0'
  }

  const updateSet = winner => {
    resetGameScore()
    const currentSet = 'set' + match.currentSet
    match.score[winner][currentSet]++
    if (isSetOver()) {
      match.currentSet++
      match.score[winner].setsWon++
    }
    if (isMatchOver(winner)) {
      alert(`${winner} won the match!`)
      isInProgress = false
    }
  }

  // 	Event handler
  const handlePoint = theWinner => {
    const winner = theWinner
    const loser = winner === 'player1' ? 'player2' : 'player1'
    const winnerScore = match.score[winner].game
    const loserScore = match.score[loser].game

    if (isDeuce()) {
      match.score[winner].game = 'Ad'
      return
    }

    if (loserScore === 'Ad') {
      match.score[winner].game = '40'
      match.score[loser].game = '40'
      return
    }

    if (winnerScore === 'Ad') {
      return updateSet(winner)
    }

    match.score[winner].game = normalGamePointIncrease[winnerScore]

    if (isGameOver(winner)) updateSet(winner)
  }

  // 	Console Logging
  $: {
    console.clear()
    // console.log('Current set:', match.currentSet)
    console.log('Current set:', match.currentSet)
    console.log('isDeuce:', isDeuce())
    console.table(match.score)
  }
</script>

<main>
  <section>
    <div />
    <div>Set 1</div>
    <div>Set 2</div>
    <div>Set 3</div>
    <div>Game</div>
  </section>
  <section>
    <span>Player 1</span>
    <div>{match.score['player1'].set1}</div>
    <div>{match.score['player1'].set2}</div>
    <div>{match.score['player1'].set3}</div>
    <div>{match.score['player1'].game}</div>
    <span>Player 2</span>
    <div>{match.score['player2'].set1}</div>
    <div>{match.score['player2'].set2}</div>
    <div>{match.score['player2'].set3}</div>
    <div>{match.score['player2'].game}</div>
  </section>

  <footer>
    {#if isInProgress}
      <div>
        <button on:click={() => handlePoint('player1')}>Player 1</button>
        <button on:click={() => handlePoint('player2')}>Player 2</button>
      </div>
    {/if}
  </footer>
</main>

<style>
  main {
    width: 500px;
    margin: auto;
    text-align: center;
  }
  section {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  }
  section:first-child {
    background: #f1f1f1;
    font-weight: bold;
  }
  div,
  span {
    padding: 1rem;
  }
  span {
    text-align: left;
  }
  footer {
    display: flex;
    justify-content: center;
    align-items: center;
    /* min-height: 100vh; */
    margin-top: 1rem;
  }
</style>
