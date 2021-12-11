<script>
  import { scale, fly } from 'svelte/transition'
  import { match } from './state'
  import { normalGamePointIncrease } from './utils'
  import Todo from './Todo.svelte'

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

  const completeMatch = winner => {
    const lastSet = match.currentSet - 1
    match.currentSet = lastSet
    alert(`${winner} won the match!`)
    isInProgress = false
  }

  const updateSet = winner => {
    resetGameScore()

    match.score[winner][currentSet]++

    if (isSetOver()) {
      match.currentSet++
      match.score[winner].setsWon++
    }

    if (isMatchOver(winner)) {
      completeMatch(winner)
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
      completeMatch(winner)
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
    <div class:highlight={match.currentSet === 1}>Set 1</div>
    <div class:highlight={match.currentSet === 2}>Set 2</div>
    <div class:highlight={match.currentSet === 3}>Set 3</div>
    {#if isTiebreak()}
      <div>TB</div>
    {:else}
      <div>Game</div>
    {/if}
  </section>

  <section>
    <span>Player 1</span>
    {#key match.score['player1'].set1}
      <div in:scale>{match.score['player1'].set1}</div>
    {/key}
    {#key match.score['player1'].set2}
      <div in:scale>{match.score['player1'].set2}</div>
    {/key}
    {#key match.score['player1'].set3}
      <div in:scale>{match.score['player1'].set3}</div>
    {/key}
    {#key match.score.player1.game && match.score.player1.tiebreak}
      {#if isTiebreak()}
        <div class="point" in:scale>{match.score['player1'].tiebreak}</div>
      {:else}
        <div class="point" in:scale>{match.score['player1'].game}</div>
      {/if}
    {/key}
    <span>Player 2</span>
    {#key match.score['player2'].set1}
      <div in:scale>{match.score['player2'].set1}</div>
    {/key}
    {#key match.score['player2'].set2}
      <div in:scale>{match.score['player2'].set2}</div>
    {/key}
    {#key match.score['player2'].set3}
      <div in:scale>{match.score['player2'].set3}</div>
    {/key}
    {#key match.score.player2.game && match.score.player2.tiebreak}
      {#if isTiebreak()}
        <div class="point" in:scale>{match.score['player2'].tiebreak}</div>
      {:else}
        <div class="point" in:scale>{match.score['player2'].game}</div>
      {/if}
    {/key}
  </section>

  <footer>
    {#if isInProgress}
      <button on:click={() => handlePoint('player1')}>Player 1</button>
      <button on:click={() => handlePoint('player2')}>Player 2</button>
    {:else}
      <button on:click={() => handleReset() && (isInProgress = true)}
        >Reset</button
      >
    {/if}
  </footer>
  <!-- <Todo /> -->
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
    padding: 0 1rem;
    background: white;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.24);
  }
  section:nth-child(2) {
    padding: 0 1.5rem;
    background: #f1f1f1;
    font-weight: bold;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  section:nth-child(3) {
    padding: 1.5em;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
  div,
  span {
    padding: 1.5rem 1rem;
  }
  span {
    padding: 1.5rem;
    font-weight: bold;
    text-align: left;
  }
  footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    gap: 1rem;
  }
  button {
    width: 100%;
    padding: 1rem 2rem;
    background: #f1f1f1;
    font-weight: bold;
    border-radius: 8px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.24);
  }
  .highlight {
    background: #ddd;
  }
  .point {
    font-weight: bold;
  }
  .bold {
    font-weight: bold;
  }
  @media screen and (max-height: 400px) {
    header {
      display: none;
    }
  }
</style>
