<script>
  export let match, isDeuce, isTiebreak

  $: {
    console.clear()
    console.log('Current set:', match.currentSet)
    console.log('isDeuce:', isDeuce())
    console.log('isTiebreak:', isTiebreak())
    console.table(match.score)
  }
</script>
