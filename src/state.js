export default function Match() {
  return {
    currentSet: 1,
    score: {
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
      setWinner: {
        set1: null,
        set2: null,
        set3: null,
      },
    },
  }
}

// export default class Match {
//   constructor() {
//     return {
//       currentSet: 1,
//       score: {
//         player1: {
//           set1: 4,
//           set2: 0,
//           set3: 0,
//           game: '0',
//           setsWon: 0,
//           tiebreak: 0,
//         },
//         player2: {
//           set1: 0,
//           set2: 0,
//           set3: 0,
//           game: '0',
//           setsWon: 0,
//           tiebreak: 0,
//         },
//         setWinner: {
//           set1: null,
//           set2: null,
//           set3: null,
//         },
//       },
//     }
//   }
// }
