<template>
  <div>.</div>
</template>

<script>
const getOtherQuery = function(query) {
  return Object.keys(query).reduce((acc, cur) => {
    if (cur !== 'redirect') {
      acc[cur] = query[cur]
    }
    return acc
  }, {})
}
export default {
  name: 'MyRedirect',
  created() {
    const { query } = this.$route
    this.$router.push({ path: query.redirect || '/', query: getOtherQuery(query) })
  }
}
</script>
