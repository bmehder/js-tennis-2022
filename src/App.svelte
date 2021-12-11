<script>
  import { match } from './state'
  import { normalGamePointIncrease } from './utils'

  let isInProgress = true

  $: currentSet = 'set' + match.currentSet

  // 	Predicates
  const isDeuce = () =>
    match.score['player1'].game === '40' && match.score['player2'].game === '40'

  const isGameOver = winner => match.score[winner].game === '0'

  const isSetOver = () => {
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

  $: isTiebreak = () =>
    match.score['player1'][currentSet] === 6 &&
    match.score['player2'][currentSet] === 6

  // State Mutation Functions
  const resetGameScore = () => {
    match.score['player1'].game = '0'
    match.score['player2'].game = '0'
    match.score.player1.tiebreak = 0
    match.score.player2.tiebreak = 0
  }

  const updateSet = winner => {
    resetGameScore()

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

  const scoreTiebreak = winner => {
    winner === 'player1'
      ? match.score.player1.tiebreak++
      : [match.score.player2.tiebreak++]

    if (
      (match.score.player1.tiebreak >= 7 &&
        match.score.player1.tiebreak - match.score.player2.tiebreak >= 2) ||
      (match.score.player2.tiebreak >= 7 &&
        match.score.player2.tiebreak - match.score.player1.tiebreak >= 2)
    ) {
      match.score[winner][currentSet]++
      match.currentSet++
      match.score[winner].setsWon++
      resetGameScore()
    }

    if (isMatchOver(winner)) {
      alert(`${winner} won the match!`)
      isInProgress = false
    }
  }

  // 	Event handlers
  const handleReset = () => {
    match.currentSet = 1
    match.score = {
      player1: {
        set1: 0,
        set2: 0,
        set3: 0,
        game: '0',
        setsWon: 0,
        tiebreak: 0,
      },
      player2: {
        set1: 0,
        set2: 0,
        set3: 0,
        game: '0',
        setsWon: 0,
        tiebreak: 0,
      },
    }
    return true
  }

  const handlePoint = theWinner => {
    const winner = theWinner
    const loser = winner === 'player1' ? 'player2' : 'player1'
    const winnerScore = match.score[winner].game
    const loserScore = match.score[loser].game

    if (isTiebreak()) {
      scoreTiebreak(winner)
      return
    }

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
    console.log('Current set:', match.currentSet)
    console.log('isDeuce:', isDeuce())
    console.log('isTiebreak:', isTiebreak())
    console.table(match.score)
  }
</script>

<aside>
  <header><h1>JS Tennis 2022</h1></header>

  <section>
    <div />
    <div>Set 1</div>
    <div>Set 2</div>
    <div>Set 3</div>
    {#if isTiebreak()}
      <div>TB</div>
    {:else}
      <div>Game</div>
    {/if}
  </section>

  <section>
    <span>Player 1</span>
    <div>{match.score['player1'].set1}</div>
    <div>{match.score['player1'].set2}</div>
    <div>{match.score['player1'].set3}</div>
    {#if isTiebreak()}
      <div>{match.score['player1'].tiebreak}</div>
    {:else}
      <div>{match.score['player1'].game}</div>
    {/if}
    <span>Player 2</span>
    <div>{match.score['player2'].set1}</div>
    <div>{match.score['player2'].set2}</div>
    <div>{match.score['player2'].set3}</div>
    {#if isTiebreak()}
      <div>{match.score['player2'].tiebreak}</div>
    {:else}
      <div>{match.score['player2'].game}</div>
    {/if}
  </section>

  <footer>
    {#if isInProgress}
      <div>
        <button on:click={() => handlePoint('player1')}>Player 1</button>
        <button on:click={() => handlePoint('player2')}>Player 2</button>
      </div>
    {:else}
      <div>
        <button on:click={() => handleReset() && (isInProgress = true)}
          >Reset</button
        >
      </div>
    {/if}
  </footer>
</aside>

<style>
  aside {
    width: 600px;
    margin: auto;
    text-align: center;
  }
  header {
    padding: 2rem;
    text-align: center;
  }
  h1 {
    font-size: 2rem;
  }
  section {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    background: white;
  }
  section:nth-child(2) {
    background: #f1f1f1;
    font-weight: bold;
  }
  div,
  span {
    padding: 1.5rem 1rem;
  }
  span {
    text-align: left;
  }
  footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
  }
  button {
    padding: 1rem 2rem;
    background: #f1f1f1;
  }
</style>
