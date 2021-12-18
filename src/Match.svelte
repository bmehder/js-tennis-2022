<script>
  import { scale } from 'svelte/transition'
  import { gamePointEnum } from './utils'

  import Match from './state'
  let match = new Match()

  let isMatchInProgress = true
  let tiebreakPoints = 0

  $: currentSet = `set${match.currentSet}`

  // 	Predicates
  const isDeuce = () =>
    match.score['p1'].game === '40' && match.score['p2'].game === '40'

  const isGameOver = winner => match.score[winner].game === '0'

  const isSetOver = () => {
    return (
      (match.score['p1'][currentSet] >= 6 &&
        match.score['p1'][currentSet] - match.score['p2'][currentSet] >= 2) ||
      (match.score['p2'][currentSet] >= 6 &&
        match.score['p2'][currentSet] - match.score['p1'][currentSet] >= 2)
    )
  }

  const isTiebreakOver = () => {
    return (
      (match.score.p1.tiebreak >= 7 &&
        match.score.p1.tiebreak - match.score.p2.tiebreak >= 2) ||
      (match.score.p2.tiebreak >= 7 &&
        match.score.p2.tiebreak - match.score.p1.tiebreak >= 2)
    )
  }

  const isMatchOver = winner => match.score[winner].setsWon === 2

  $: isTiebreak = () =>
    match.score['p1'][currentSet] === 6 && match.score['p2'][currentSet] === 6

  // State Mutation Functions
  const resetGameScore = () => {
    match.score['p1'].game = 0
    match.score['p2'].game = 0
    match.score.p1.tiebreak = 0
    match.score.p2.tiebreak = 0
    match.playerToServe = match.playerToServe === 'p1' ? 'p2' : 'p1'
  }

  const completeMatch = () => {
    const lastSet = match.currentSet - 1
    match.currentSet = lastSet
    isMatchInProgress = false
    match.playerToServe = null
  }

  const updateSet = winner => {
    resetGameScore()

    match.score[winner][currentSet]++

    if (isSetOver()) {
      match.currentSet++
      match.score[winner].setsWon++
      match.score.setWinner[currentSet] = winner
    }

    isMatchOver(winner) && completeMatch(winner)
  }

  const scoreTiebreak = winner => {
    tiebreakPoints++

    winner === 'p1' ? match.score.p1.tiebreak++ : match.score.p2.tiebreak++

    if (isTiebreakOver()) {
      match.score[winner][currentSet]++
      match.currentSet++
      match.score[winner].setsWon++
      match.score.setWinner[currentSet] = winner
      match.playerToServe = winner === 'p1' ? 'p1' : 'p2'
      tiebreakPoints = 0
      resetGameScore()
    }

    isMatchOver(winner) && completeMatch(winner)

    if (tiebreakPoints === 1) {
      match.playerToServe === 'p1'
        ? (match.playerToServe = 'p2')
        : (match.playerToServe = 'p1')

      return
    }

    if (tiebreakPoints % 2 !== 0) {
      match.playerToServe === 'p1'
        ? (match.playerToServe = 'p2')
        : (match.playerToServe = 'p1')
    }
  }

  // 	Event handlers
  const handleReset = () => {
    match = new Match()
    isMatchInProgress = true
    match.playerToServe = 'p1'
  }

  const handlePoint = theWinner => {
    const winner = theWinner
    const loser = winner === 'p1' ? 'p2' : 'p1'
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

    match.score[winner].game = gamePointEnum[winnerScore]

    isGameOver(winner) && updateSet(winner)
  }

  // 	Console Logging
  // $: {
  //   console.clear()
  //   console.log('Current set:', match.currentSet)
  //   console.log('isDeuce:', isDeuce())
  //   console.log('isTiebreak:', isTiebreak())
  //   console.table(match.score)
  // }
</script>

<aside>
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
    <span
      >Player 1{#if match.playerToServe === 'p1'}
        &nbsp; &bull;{/if}</span
    >
    {#key match.score['p1'].set1}
      <div class:bold={match.score.setWinner.set1 === 'p1'} in:scale>
        {match.score['p1'].set1}
      </div>
    {/key}
    {#key match.score['p1'].set2}
      <div class:bold={match.score.setWinner.set2 === 'p1'} in:scale>
        {match.score['p1'].set2}
      </div>
    {/key}
    {#key match.score['p1'].set3}
      <div class:bold={match.score.setWinner.set3 === 'p1'} in:scale>
        {match.score['p1'].set3}
      </div>
    {/key}
    {#key match.score.p1.game}
      {#if isTiebreak()}
        <div class="point" in:scale>
          {match.score['p1'].tiebreak}
        </div>
      {:else}
        <div class="point" class:gray={!isMatchInProgress} in:scale>
          {match.score['p1'].game}
        </div>
      {/if}
    {/key}
    <span
      >Player 2 {#if match.playerToServe === 'p2'}
        &nbsp; &bull;{/if}</span
    >
    {#key match.score['p2'].set1}
      <div class:bold={match.score.setWinner.set1 === 'p2'} in:scale>
        {match.score['p2'].set1}
      </div>
    {/key}
    {#key match.score['p2'].set2}
      <div class:bold={match.score.setWinner.set2 === 'p2'} in:scale>
        {match.score['p2'].set2}
      </div>
    {/key}
    {#key match.score['p2'].set3}
      <div class:bold={match.score.setWinner.set3 === 'p2'} in:scale>
        {match.score['p2'].set3}
      </div>
    {/key}
    {#key match.score.p2.game}
      {#if isTiebreak()}
        <div class="point" in:scale>
          {match.score['p2'].tiebreak}
        </div>
      {:else}
        <div class="point" class:gray={!isMatchInProgress} in:scale>
          {match.score['p2'].game}
        </div>
      {/if}
    {/key}
  </section>

  <footer>
    {#if isMatchInProgress}
      <button on:click={() => handlePoint('p1')}>Player 1</button>
      <button on:click={() => handlePoint('p2')}>Player 2</button>
    {:else}
      <button on:click={() => handleReset()}>Reset</button>
    {/if}
  </footer>
</aside>

<style>
  aside {
    width: 700px;
    margin: auto;
    text-align: center;
  }
  section {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    padding: 0 1rem;
    background: white;
    text-align: center;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.24);
  }
  section:nth-child(1) {
    padding: 0 1.5rem;
    background: #e1e1e1;
    font-weight: bold;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }
  section:nth-child(2) {
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
    margin: 0 0 0.5em 0;
    padding: 1.5rem 2rem;
    background: darkorange;
    color: black;
    border: none;
    font-size: inherit;
    font-family: inherit;
    font-weight: bold;
    border-radius: 8px;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.24);
    user-select: none;
  }
  button:hover {
    transform: scale(0.99);
    transition: all 100ms ease-in-out;
  }
  .highlight {
    background: #ccc;
  }
  .point {
    font-weight: bold;
  }
  .bold {
    font-weight: bold;
  }
  .gray {
    color: lightgrey;
  }
</style>
