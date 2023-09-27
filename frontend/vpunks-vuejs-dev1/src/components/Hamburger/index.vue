<template>
  <div style="padding: 0 15px;" @click="toggleClick">
    <svg :class="{'is-active':isActive}" class="hamburger" width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 21H57" stroke="white" stroke-width="8" stroke-linecap="round" />
      <path d="M15 36H42" stroke="white" stroke-width="8" stroke-linecap="round" />
      <path d="M15 51H57" stroke="white" stroke-width="8" stroke-linecap="round" />
      <path d="M51.8622 37.4311L58.395 40.6975C59.5918 41.2959 61 40.4256 61 39.0875L61 32.9125C61 31.5744 59.5918 30.7041 58.395 31.3025L51.8622 34.5689C50.6829 35.1586 50.6829 36.8414 51.8622 37.4311Z" fill="white" />
    </svg>

  </div>
</template>

<script>
export default {
  name: 'Hamburger',
  props: {
    isActive: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    toggleClick() {
      this.$emit('toggleClick')
    }
  }
}
</script>

<style scoped>
.hamburger {
  display: inline-block;
  vertical-align: middle;
  width: 30px;
  height: 30px;
}

.hamburger.is-active {
  transform: rotate(180deg);
}
</style>
