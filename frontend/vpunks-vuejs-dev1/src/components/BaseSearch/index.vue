<template>
  <div :class="{'show':show}" class="header-search">
    <el-input
      ref="headerSearchSelect"
      v-model="inputSearch"
      placeholder="TokenId"
      class="header-search-select"
      @change="onChange"
      @input="onInput"
      @blur="onBlur"
    />
    <svg-icon class-name="search-icon" icon-class="search" @click.stop="click" />
  </div>
</template>

<script>
export default {
  name: 'BaseSearch',
  data() {
    return {
      inputSearch: '',
      show: false
    }
  },
  methods: {
    click() {
      if (!this.show) {
        this.show = true
        this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.focus()
      }
    },
    close() {
      this.$refs.headerSearchSelect && this.$refs.headerSearchSelect.blur()
      this.show = false
    },
    onChange(val) {
      // console.log('onChange', val)
    },
    onInput(val) {
      // console.log('val.length', val.length)
      if (val.length > 0) {
        const res = val.replace(/\D/g, '')
        if (res !== val) {
          this.inputSearch = res
        }
      }
      this.$emit('input', this.inputSearch)
    },
    onBlur() {
      if (this.inputSearch === '') this.close()
    }
  }
}
</script>

<style lang="scss" scoped>
.header-search {
  font-size: 0 !important;

  .search-icon {
    cursor: pointer;
    font-size: 18px;
    vertical-align: middle;
  }

  .header-search-select {
    font-size: 18px;
    transition: width 0.2s;
    width: 0;
    overflow: hidden;
    background: transparent;
    border-radius: 10px;
    display: inline-block;
    vertical-align: middle;

    ::v-deep .el-input__inner {
      border-radius: 0;
      border: 0;
      padding-left: 8px;
      padding-right: 0;
      box-shadow: none !important;
      // border-bottom: 1px solid #d9d9d9;
      vertical-align: middle;
    }
  }

  &.show {
    .header-search-select {
      // width: 210px;
      width: 65%;
      max-width: 210px;
      min-width: 55px;
      margin-right: 10px;
    }
  }
}
</style>
