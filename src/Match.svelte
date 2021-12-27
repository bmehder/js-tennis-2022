<script>
  import { scale } from 'svelte/transition'
  import { gamePointEnum } from './utils'

  import State from './state'

  // Component State
  let match
  let isMatchInProgress = true
  let isShowDetails = false

  // Alias variables
  $: currentSet = `set${match.currentSet}`
  $: currentTbSet = `currentSet`

  $: set1P1Score = match.score['p1'].set1
  $: set2P1Score = match.score['p1'].set2
  $: set3P1Score = match.score['p1'].set3
  $: gameP1Score = match.score.p1.game
  $: tiebreakP1Score = match.score['p1'].tiebreak

  $: set1P2Score = match.score['p2'].set1
  $: set2P2Score = match.score['p2'].set2
  $: set3P2Score = match.score['p2'].set3
  $: gameP2Score = match.score.p2.game
  $: tiebreakP2Score = match.score['p2'].tiebreak

  // Instantiate Match class
  const createNewMatch = () => {
    match = new State()
    isMatchInProgress = true
    match.playerToServe = 'p1'
  }
  createNewMatch()

  // 	Predicates
  $: isDeuce = () =>
    match.score['p1'].game === '40' && match.score['p2'].game === '40'

  const isLosersLastScoreIsAd = loserScore => loserScore === 'Ad'

  const isWinnersLastScoreIsAd = winnerScore => winnerScore === 'Ad'

  const isGameOver = winner => match.score[winner].game === '0'

  const isSetOver = () => {
    return (
      (match.score['p1'][currentSet] >= 6 &&
        match.score['p1'][currentSet] - match.score['p2'][currentSet] >= 2) ||
      (match.score['p2'][currentSet] >= 6 &&
        match.score['p2'][currentSet] - match.score['p1'][currentSet] >= 2)
    )
  }

  const isTiebreakFirstPoint = () => match.score.tiebreakPoints === 1

  const isOtherPlayerToServe = () => match.score.tiebreakPoints % 2 !== 0

  const isTiebreakOver = () => {
    return (
      (match.score.p1.tiebreak >= 7 &&
        match.score.p1.tiebreak - match.score.p2.tiebreak >= 2) ||
      (match.score.p2.tiebreak >= 7 &&
        match.score.p2.tiebreak - match.score.p1.tiebreak >= 2)
    )
  }

  const isMatchOver = winner => match.score[winner].setsWon === 2

  const isP1Set1Winner = () => match.score.setWinner.set1 === 'p1'
  const isP1Set2Winner = () => match.score.setWinner.set2 === 'p1'
  const isP1Set3Winner = () => match.score.setWinner.set3 === 'p1'

  const isP2Set1Winner = () => match.score.setWinner.set1 === 'p2'
  const isP2Set2Winner = () => match.score.setWinner.set2 === 'p2'
  const isP2Set3Winner = () => match.score.setWinner.set3 === 'p2'

  $: isPlayer1ToServe = () => match.playerToServe === 'p1'
  $: isPlayer2ToServe = () => match.playerToServe === 'p2'

  $: isSet1 = () => match.currentSet === 1
  $: isSet2 = () => match.currentSet === 2
  $: isSet3 = () => match.currentSet === 3

  $: isTiebreak = () =>
    match.score['p1'][currentSet] === 6 && match.score['p2'][currentSet] === 6

  // Getter Functions
  const getPointLoser = winner => (winner === 'p1' ? 'p2' : 'p1')

  const getTiebreakLoser = winner => (winner === 'p1' ? 'p2' : 'p1')

  const getWinnerScore = winner => match.score[winner].game

  const getLoserScore = loser => match.score[loser].game

  const getPreviousSet = () => match.currentSet - 1

  // Setter Functions
  const setNormalGamePoint = (winner, winnerScore) =>
    (match.score[winner].game = gamePointEnum[winnerScore])

  const setPlayerToServe = () =>
    (match.playerToServe = match.playerToServe === 'p1' ? 'p2' : 'p1')

  const setPlayerToServeAfterTiebreak = () =>
    (match.playerToServe = match.playerToServe === 'p1' ? 'p1' : 'p2')

  const setWinnerForCurrentSet = winner =>
    (match.score.setWinner[currentSet] = winner)

  const setLoserTiebreakScore = winner => {
    const loser = getTiebreakLoser(winner)

    match.score[loser][currentSet + 'TiebreakLoserScore'] =
      match.score[loser].tiebreak
  }

  const setGamePointsToZero = () => {
    match.score['p1'].game = 0
    match.score['p2'].game = 0
  }

  const setTiebreakPointsToZero = () => {
    match.score.p1.tiebreak = 0
    match.score.p2.tiebreak = 0
  }

  const setGameScoreToDeuce = () => {
    match.score.p1.game = '40'
    match.score.p2.game = '40'
  }

  const setWinnerPointToAd = winner => (match.score[winner].game = 'Ad')

  // Resetter Functions
  const resetTiebreakPoints = () => (match.score.tiebreakPoints = 0)

  const resetGameScore = () => {
    setGamePointsToZero()
    setTiebreakPointsToZero()
    setPlayerToServe()
  }

  // Incrementer Functions
  const incrementSetScoreForWinner = winner => match.score[winner][currentSet]++

  const incrementSetsWonForPlayer = winner => match.score[winner].setsWon++

  const incrementCurrentSet = () => match.currentSet++

  const incrementTiebreakScoreForWinner = winner =>
    winner === 'p1' ? match.score.p1.tiebreak++ : match.score.p2.tiebreak++

  const incrementNumberOfTiebreakPoints = () => match.score.tiebreakPoints++

  // Completer Functions
  const completeSet = winner => {
    incrementCurrentSet()
    incrementSetsWonForPlayer(winner)
    setWinnerForCurrentSet(winner)
  }

  const completeTiebreak = winner => {
    setLoserTiebreakScore(winner)
    incrementCurrentSet()
    incrementSetScoreForWinner(winner)
    incrementSetsWonForPlayer(winner)
    setWinnerForCurrentSet(winner)
    setPlayerToServeAfterTiebreak()
    resetTiebreakPoints()
    resetGameScore()
  }

  const completeMatch = () => {
    match.currentSet = getPreviousSet()
    isMatchInProgress = false
    match.playerToServe = null
    return
  }

  // Update Functions
  const updateSet = winner => {
    resetGameScore()

    incrementSetScoreForWinner(winner)

    isSetOver() && completeSet(winner)

    isMatchOver(winner) && completeMatch(winner)
  }

  const updateTiebreak = winner => {
    incrementNumberOfTiebreakPoints()

    incrementTiebreakScoreForWinner(winner)

    isTiebreakOver() && completeTiebreak(winner)

    isMatchOver(winner) && completeMatch(winner)

    if (isTiebreakFirstPoint()) {
      setPlayerToServe()
      return
    }

    isOtherPlayerToServe() && setPlayerToServe()
  }

  // 	Event handlers
  const handleReset = () => createNewMatch()

  const handlePoint = winner => {
    const winnerScore = getWinnerScore(winner)
    const loserScore = getLoserScore(getPointLoser(winner))

    if (isTiebreak()) {
      return updateTiebreak(winner)
    }

    if (isDeuce()) {
      return setWinnerPointToAd(winner)
    }

    if (isLosersLastScoreIsAd(loserScore)) {
      return setGameScoreToDeuce()
    }

    if (isWinnersLastScoreIsAd(winnerScore)) {
      return updateSet(winner)
    }

    setNormalGamePoint(winner, winnerScore)

    isGameOver(winner) && updateSet(winner)
  }
</script>

<span><input type="checkbox" bind:checked={isShowDetails} /></span>

<aside>
  <section>
    <div />
    <div class:highlight={isSet1()}>Set 1</div>
    <div class:highlight={isSet2()}>Set 2</div>
    <div class:highlight={isSet3()}>Set 3</div>
    {#if isTiebreak()}
      <div>TB</div>
    {:else}
      <div>Game</div>
    {/if}
  </section>

  <section>
    <span
      >Player 1
      {#if isPlayer1ToServe()}
        &nbsp; &bull;
      {/if}
    </span>
    {#key set1P1Score}
      <div class:bold={isP1Set1Winner()} in:scale>
        {set1P1Score}
        {#if match.score.p1.set1TiebreakLoserScore !== 0}
          <sup>{match.score.p1.set1TiebreakLoserScore}</sup>
        {/if}
      </div>
    {/key}
    {#key set2P1Score}
      <div class:bold={isP1Set2Winner()} in:scale>
        {set2P1Score}
        {#if match.score.p1.set2TiebreakLoserScore !== 0}
          <sup>{match.score.p1.set2TiebreakLoserScore}</sup>
        {/if}
      </div>
    {/key}
    {#key set3P1Score}
      <div class:bold={isP1Set3Winner()} in:scale>
        {set3P1Score}
        {#if match.score.p1.set3TiebreakLoserScore !== 0}
          <sup>{match.score.p1.set3TiebreakLoserScore}</sup>
        {/if}
      </div>
    {/key}
    {#key gameP1Score}
      {#if isTiebreak()}
        <div class="point" in:scale>
          {tiebreakP1Score}
        </div>
      {:else}
        <div class="point" class:gray={!isMatchInProgress} in:scale>
          {gameP1Score}
        </div>
      {/if}
    {/key}
    <span
      >Player 2
      {#if isPlayer2ToServe()}
        &nbsp; &bull;
      {/if}
    </span>
    {#key set1P2Score}
      <div class:bold={isP2Set1Winner()} in:scale>
        {set1P2Score}
        {#if match.score.p2.set1TiebreakLoserScore !== 0}
          <sup>{match.score.p2.set1TiebreakLoserScore}</sup>
        {/if}
      </div>
    {/key}
    {#key set2P2Score}
      <div class:bold={isP2Set2Winner()} in:scale>
        {set2P2Score}
        {#if match.score.p2.set2TiebreakLoserScore !== 0}
          <sup>{match.score.p2.set2TiebreakLoserScore}</sup>
        {/if}
      </div>
    {/key}
    {#key set3P2Score}
      <div class:bold={isP2Set3Winner()} in:scale>
        {set3P2Score}
        {#if match.score.p2.set3TiebreakLoserScore !== 0}
          <sup>{match.score.p2.set3TiebreakLoserScore}</sup>
        {/if}
      </div>
    {/key}
    {#key gameP2Score}
      {#if isTiebreak()}
        <div class="point" in:scale>
          {tiebreakP2Score}
        </div>
      {:else}
        <div class="point" class:gray={!isMatchInProgress} in:scale>
          {gameP2Score}
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

{#if isShowDetails}
  <details open transition:scale>
    <summary>Log info</summary>
    <p>Current Set: {match.currentSet}</p>
    <p>Is Deuce: {isDeuce()}</p>
    <p>Is Tiebreak: {isTiebreak()}</p>
    <pre>{JSON.stringify(match.score, null, 2)}</pre>
  </details>
{/if}

<style>
  span input {
    opacity: 0;
    position: absolute;
    top: 1em;
    left: 1em;
  }
  span:hover input {
    opacity: 1;
  }
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
  details {
    width: 700px;
    margin: auto;
    padding: 2em;
    background: white;
  }
  details p,
  details pre {
    margin-left: 2rem;
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
