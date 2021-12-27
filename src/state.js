export default function Match() {
  return {
    currentSet: 1,
    playerToServe: 'p1',
    score: {
      p1: {
        set1: 4,
        set1TiebreakLoserScore: 0,
        set2: 0,
        set2TiebreakLoserScore: 0,
        set3: 0,
        set3TiebreakLoserScore: 0,
        game: '0',
        setsWon: 0,
        tiebreak: 0,
      },
      p2: {
        set1: 4,
        set1TiebreakLoserScore: 0,
        set2: 0,
        set2TiebreakLoserScore: 0,
        set3: 0,
        set3TiebreakLoserScore: 0,
        game: '0',
        setsWon: 0,
        tiebreak: 0,
      },
      setWinner: {
        set1: null,
        set2: null,
        set3: null,
      },
      tiebreakPoints: 0,
    },
  }
}
