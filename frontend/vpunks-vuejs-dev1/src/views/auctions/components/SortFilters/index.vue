<template>
  <div v-loading="loading" class="drawer-container">
    <div>
      <h3 class="drawer-title" style="margin-top:0;">Search by TokenId</h3>
      <el-input v-model="inputTokenId" size="mini" placeholder="TokenId" style="width:130px;margin-right: 10px;" @change="onInputChange" />
      <el-button size="mini" type="primary" @click="searchByTokenId">Search</el-button>

      <h3 class="drawer-title" style="border-top: 1px solid #e6e6e6;padding-top: 15px;">Sort By</h3>
      <el-radio-group v-model="sortBy">
        <el-radio :label="0">Recently added</el-radio>
        <el-radio :label="1">Lowest tokenId</el-radio>
        <el-radio :label="2">Highest tokenId</el-radio>
        <el-radio :label="3">Lowest price</el-radio>
        <el-radio :label="4">Highest price</el-radio>
        <el-radio :label="5">Lowest rarity score</el-radio>
        <el-radio :label="6">Highest rarity score</el-radio>
      </el-radio-group>

      <h3 class="drawer-title">VPunk Type</h3>
      <el-checkbox v-model="checkAllType" :indeterminate="isIndeterminateType" @change="handleCheckAllTypeChange">All</el-checkbox>
      <div style="margin: 10px 0;" />
      <el-checkbox-group v-model="checkedTypes" @change="handleCheckedTypeChange">
        <el-checkbox v-for="type in allType" :key="type" :label="type">{{ type }}</el-checkbox>
      </el-checkbox-group>

      <h3 class="drawer-title">Attribute Count</h3>
      <el-checkbox v-model="checkAllCount" :indeterminate="isIndeterminateCount" @change="handleCheckAllCountChange">All</el-checkbox>
      <div style="margin: 10px 0;" />
      <el-checkbox-group v-model="checkedCounts" @change="handleCheckedCountChange">
        <el-checkbox v-for="count in allAttCount" :key="count" :label="count" class="attributes-checkbox">{{ count }} attribute</el-checkbox>
      </el-checkbox-group>

      <h3 class="drawer-title">VPunk Attributes</h3>
      <el-checkbox v-model="checkAllAtt" :indeterminate="isIndeterminateAtt" @change="handleCheckAllAttChange">All</el-checkbox>
      <div style="color:#888888;">Select all or up to 10 attributes</div>
      <div style="margin: 10px 0;" />
      <el-checkbox-group v-model="checkedAtts" @change="handleCheckedAttChange">
        <el-checkbox v-for="attributes in allAttributes" :key="attributes" :label="attributes" class="attributes-checkbox">{{ attributes }}</el-checkbox>
      </el-checkbox-group>
      <div style="margin-top:30px;text-align:center;"><el-button size="mini" type="primary" @click="submitSort(true)">My Challenge List</el-button></div>
      <div class="drawer-btn">
        <el-button size="mini" type="primary" @click="submitSort(false)">Submit</el-button>
      </div>
    </div>
  </div>
</template>

<script>
const vpunksTypes = ['Alien', 'Ape', 'Zombie', 'Male', 'Female']
const attributeCount = [0, 1, 2, 3, 4, 5, 6, 7]
const vpunksAttributes = ['3D Glasses', 'Bandana', 'Beanie', 'Big Beard', 'Big Shades', 'Black Lipstick', 'Blonde Bob', 'Blonde Short', 'Blue Eye Shadow', 'Buck Teeth', 'Cap', 'Cap Forward', 'Chinstrap', 'Choker', 'Cigarette', 'Classic Shades', 'Clown Eyes Blue', 'Clown Eyes Green', 'Clown Hair Green', 'Clown Nose', 'Cowboy Hat', 'Crazy Hair', 'Dark Hair', 'Do-rag', 'Earring', 'Eye Mask', 'Eye Patch', 'Fedora', 'Front Beard', 'Front Beard Dark', 'Frown', 'Frumpy Hair', 'Goat', 'Gold Chain', 'Green Eye Shadow', 'Half Shaved', 'Handlebars', 'Headband', 'Hoodie', 'Horned Rim Glasses', 'Hot Lipstick', 'Knitted Cap', 'Luxurious Beard', 'Medical Mask', 'Messy Hair', 'Mohawk', 'Mohawk Dark', 'Mohawk Thin', 'Mole', 'Mustache', 'Muttonchops', 'Nerd Glasses', 'Normal Beard', 'Normal Beard Black', 'Orange Side', 'Peak Spike', 'Pigtails', 'Pilot Helmet', 'Pink With Hat', 'Pipe', 'Police Cap', 'Purple Eye Shadow', 'Purple Hair', 'Purple Lipstick', 'Red Mohawk', 'Regular Shades', 'Rosy Cheeks', 'Shadow Beard', 'Shaved Head', 'Silver Chain', 'Small Shades', 'Smile', 'Spots', 'Straight Hair', 'Straight Hair Blonde', 'Straight Hair Dark', 'Stringy Hair', 'Tassle Hat', 'Tiara', 'Top Hat', 'VR', 'Vampire Hair', 'Vape', 'Welding Goggles', 'Wild Blonde', 'Wild Hair', 'Wild White Hair']

export default {
  props: {
    loading: {
      default: false,
      type: Boolean
    }
  },
  data() {
    return {
      // Search by TokenId
      inputTokenId: '',

      // Sort By
      sortBy: 0,

      // VPunk Type
      allType: vpunksTypes,
      checkedTypes: [],
      checkAllType: false,
      isIndeterminateType: true,

      // Attribute Count
      allAttCount: attributeCount,
      checkedCounts: [],
      checkAllCount: false,
      isIndeterminateCount: true,

      // VPunk Attributes
      allAttributes: vpunksAttributes,
      checkedAtts: [],
      checkAllAtt: false,
      isIndeterminateAtt: true
    }
  },
  methods: {
    // Search by TokenId
    onInputChange(val) {
      // console.log('onInputChange', val)
      if (val.length > 0) {
        const res = val.replace(/\D/g, '')
        if (res !== val) {
          this.inputTokenId = res
        }
      }
    },
    searchByTokenId() {
      this.$emit('searchByTokenId', this.inputTokenId)
    },

    // VPunk Type -----------------------------------------------------------
    handleCheckAllTypeChange(val) {
      this.checkedTypes = val ? vpunksTypes : []
      this.isIndeterminateType = false
    },
    handleCheckedTypeChange(value) {
      const checkedCount = value.length
      this.checkAllType = checkedCount === this.allType.length
      this.isIndeterminateType = checkedCount > 0 && checkedCount < this.allType.length
    },
    // end VPunk Type -----------------------------------------------------------

    // Attribute Count -----------------------------------------------------------
    handleCheckAllCountChange(val) {
      this.checkedCounts = val ? attributeCount : []
      this.isIndeterminateCount = false
    },
    handleCheckedCountChange(value) {
      const checkedCount = value.length
      this.checkAllCount = checkedCount === this.allAttCount.length
      this.isIndeterminateCount = checkedCount > 0 && checkedCount < this.allAttCount.length
    },
    // end Attribute Count -----------------------------------------------------------

    // VPunk Attributes -----------------------------------------------------------
    handleCheckAllAttChange(val) {
      this.checkedAtts = val ? vpunksAttributes : []
      this.isIndeterminateAtt = false
    },
    handleCheckedAttChange(value) {
      while (value.length > 10) {
        this.checkedAtts.pop()
      }
      const checkedCount = this.checkedAtts.length
      this.checkAllAtt = checkedCount === this.allAttributes.length
      this.isIndeterminateAtt = checkedCount > 0 && checkedCount < this.allAttributes.length
    },
    // end VPunk Attributes -----------------------------------------------------------

    // submitSort
    submitSort(isChallenge) {
      let query = ''
      if (this.sortBy > 0) query = `order=${this.sortBy}&`
      if (!this.checkAllType && this.checkedTypes.length > 0) query = `${query}type=${this.checkedTypes.toString()}&`
      if (!this.checkAllCount && this.checkedCounts.length > 0) query = `${query}count=${this.checkedCounts.toString()}&`
      if (!this.checkAllAtt && this.checkedAtts.length > 0) {
        const newParam = []
        for (let i = 0; i < this.checkedAtts.length; i++) {
          const index = vpunksAttributes.indexOf(this.checkedAtts[i])
          if (index !== -1) newParam.push(index)
        }
        query = `${query}attr=${newParam.toString()}&`
      }
      if (isChallenge) query = `${query}challenge=true&`
      // console.log('isChallenge: ', isChallenge)
      // console.log('query: ', query)
      // console.log(this.isIndeterminateType)
      this.$emit('sortFiltersSubmit', query, isChallenge)
    }
  }
}
</script>

<style lang="scss" scoped>
.drawer-container {
  min-height: 100vh;
  padding: 24px 24px 124px 24px;
  font-size: 14px;
  line-height: 1.5;
  word-wrap: break-word;

  .el-radio-group .el-radio {
    margin-bottom: 6px;
  }

  .drawer-title {
    margin-bottom: 12px;
    color: rgba(0, 0, 0, .85);
    font-size: 14px;
    line-height: 22px;
  }

  .drawer-item {
    color: rgba(0, 0, 0, .65);
    font-size: 14px;
    padding: 12px 0;
  }

  .drawer-switch {
    float: right
  }
  .drawer-btn {
    position: absolute;
    left: 0;
    bottom: 0;
    z-index: 10;
    width: 100%;
    padding: 20px 0 25px 0;
    background-color: #fff;
    border-top: 1px solid #e6e5e5;
    text-align: center;
  }
  .attributes-checkbox {
    display: block;
  }
}
</style>
