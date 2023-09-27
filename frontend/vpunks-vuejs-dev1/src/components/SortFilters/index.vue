<template>
  <el-row style="display:flex; justify-content:flex-end">
    <!-- Filter -->
    <div class="filter-mc">
      <el-button type="success" round @click="dialogFilter = true"><span><svg-icon icon-class="union" style="vertical-align: bottom;margin-right:5px;" /></span> {{ filtersTitle }}</el-button>
      <el-dialog
        :visible.sync="dialogFilter"
        width="40%"
        top="5vh"
        :before-close="handleClose"
      >
        <div slot="title">
          <span style="padding-right: 20px; font-size: 20px;">Filters</span>
          <el-button size="mini" type="primary" style="width: 100px" round @click="clearFilter">Reset</el-button>
        </div>
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
        <div style="color:rgb(188 147 147);">Select all or up to 10 attributes</div>
        <div style="margin: 10px 0;" />
        <el-checkbox-group v-model="checkedAtts" @change="handleCheckedAttChange">
          <el-checkbox v-for="attributes in allAttributes" :key="attributes" :label="attributes" class="attributes-checkbox">{{ attributes }}</el-checkbox>
        </el-checkbox-group>

        <div slot="footer">
          <div class="drawer-btn" style="text-align:center">
            <el-button type="warning" style="color: #000; font-weight: 700;" round @click="dialogProperties = true">Add sort</el-button>
            <el-button type="primary" round @click="submitSort">Submit</el-button>
          </div>
        </div>
      </el-dialog>
    </div>
    <!-- end: Filter -->

    <!-- Sorting -->
    <div class="properties">
      <el-button type="success" round @click="dialogProperties = true"><span><svg-icon icon-class="fill" style="vertical-align: bottom;margin-right:5px;" /></span> <span class="hide">{{ sortTitle }}</span></el-button>
      <el-dialog
        title="Sort by"
        :visible.sync="dialogProperties"
        width="30%"
        :before-close="handleClose"
      >
        <el-radio-group v-model="sortBy">
          <!-- điều kiện để hiển thị sortby -->
          <el-radio v-for="radio in optionRadio[location]" :key="radio.id" :label="radio.id">{{ radio.title }}</el-radio>
        <!-- điều kiện để hiển thị sortby -->
        </el-radio-group>
        <span slot="footer" class="dialog-footer">
          <el-button type="warning" round style="color: #000" @click="(dialogFilter = true) && (dialogProperties = false) ">Add Filters</el-button>
          <el-button type="primary" round @click="submitSort">Submit</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- end: Sorting -->
  </el-row>
</template>

<script>
import SvgIcon from '@/components/SvgIcon/index.vue'
const vpunksTypes = ['Alien', 'Ape', 'Zombie', 'Male', 'Female']
const attributeCount = [0, 1, 2, 3, 4, 5, 6, 7]
const vpunksAttributes = ['3D Glasses', 'Bandana', 'Beanie', 'Big Beard', 'Big Shades', 'Black Lipstick', 'Blonde Bob', 'Blonde Short', 'Blue Eye Shadow', 'Buck Teeth', 'Cap', 'Cap Forward', 'Chinstrap', 'Choker', 'Cigarette', 'Classic Shades', 'Clown Eyes Blue', 'Clown Eyes Green', 'Clown Hair Green', 'Clown Nose', 'Cowboy Hat', 'Crazy Hair', 'Dark Hair', 'Do-rag', 'Earring', 'Eye Mask', 'Eye Patch', 'Fedora', 'Front Beard', 'Front Beard Dark', 'Frown', 'Frumpy Hair', 'Goat', 'Gold Chain', 'Green Eye Shadow', 'Half Shaved', 'Handlebars', 'Headband', 'Hoodie', 'Horned Rim Glasses', 'Hot Lipstick', 'Knitted Cap', 'Luxurious Beard', 'Medical Mask', 'Messy Hair', 'Mohawk', 'Mohawk Dark', 'Mohawk Thin', 'Mole', 'Mustache', 'Muttonchops', 'Nerd Glasses', 'Normal Beard', 'Normal Beard Black', 'Orange Side', 'Peak Spike', 'Pigtails', 'Pilot Helmet', 'Pink With Hat', 'Pipe', 'Police Cap', 'Purple Eye Shadow', 'Purple Hair', 'Purple Lipstick', 'Red Mohawk', 'Regular Shades', 'Rosy Cheeks', 'Shadow Beard', 'Shaved Head', 'Silver Chain', 'Small Shades', 'Smile', 'Spots', 'Straight Hair', 'Straight Hair Blonde', 'Straight Hair Dark', 'Stringy Hair', 'Tassle Hat', 'Tiara', 'Top Hat', 'VR', 'Vampire Hair', 'Vape', 'Welding Goggles', 'Wild Blonde', 'Wild Hair', 'Wild White Hair']
export default {
  name: 'SortFilters',
  components: { SvgIcon },
  props: {
    loading: {
      default: false,
      type: Boolean
    },
    location: {
      default: 'location', // market | location | my-account
      type: String
    },
    sortActivedId: {
      default: 0, // 0 > 6
      type: Number
    }
  },
  data() {
    return {
      // Dialog Properties
      dialogProperties: false,
      sortBy: 0,
      dialogFilter: false,
      //  Filter
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
      isIndeterminateAtt: true,
      sortTitle: 'Default',
      filtersTitle: 'Properties',
      optionRadio: {
        'default': [
          { id: 1, title: 'ID: Low to High' },
          { id: 2, title: 'ID: High to Low' },
          { id: 5, title: 'Rank: Low to High' },
          { id: 6, title: 'Rank: High to Low' }
        ],
        'collected': [
          { id: 0, title: 'Default' },
          { id: 1, title: 'ID: Low to High' },
          { id: 2, title: 'ID: High to Low' },
          { id: 5, title: 'Rank: Low to High' },
          { id: 6, title: 'Rank: High to Low' }
        ],
        'market': [
          { id: 0, title: 'Recently added' },
          { id: 1, title: 'ID: Low to High' },
          { id: 2, title: 'ID: High to Low' },
          { id: 3, title: 'Price: Low to High' },
          { id: 4, title: 'Price: High to Low' },
          { id: 5, title: 'Rank: Low to High' },
          { id: 6, title: 'Rank: High to Low' }
        ]
      }
    }
  },
  created() {
    this.sortBy = this.sortActivedId
    const sortItem = this.optionRadio[this.location].find((item) => {
      return item.id === this.sortBy
    })
    if (sortItem !== undefined) this.sortTitle = sortItem.title
  },
  mounted() {
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    handleWindowResize(event) {
      window.innerWidth < 450 ? this.filtersTitle = '' : this.filtersTitle = 'Properties'
    },
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
    submitSort() {
      const json = {
        order: this.sortBy,
        type: this.checkedTypes,
        count: this.checkedCounts,
        attr: this.checkedAtts
      }
      let query = ''
      if (this.sortBy > 0) query = `order=${this.sortBy}&`
      // console.log('optionRadio', this.optionRadio[this.location], this.sortBy)
      const sortItem = this.optionRadio[this.location].find((item) => {
        return item.id === this.sortBy
      })
      if (sortItem !== undefined) this.sortTitle = sortItem.title
      // console.log(this.allType)
      // console.log(this.allAttCount)
      // console.log(this.allAttributes)
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
      //   if (isChallenge) query = `${query}challenge=true&`
      // console.log('isChallenge: ', isChallenge)
      // console.log('query: ', query)
      // console.log(this.isIndeterminateType)
      this.$emit('sortFiltersSubmit', query, json)
      this.dialogProperties = false
      this.dialogFilter = false
    },
    handleClose(done) {
      done()
    },
    // clear Fill
    clearFilter() {
      this.checkedTypes = this.checkedCounts = this.checkedAtts = []
    }
  }
}
</script>

<style lang="scss">
.properties {
  .el-dialog {
    width: 50% !important;
    max-width: 450px !important;
  }
  .diag-properties {
    margin-top: 2vh;
  }
  & .el-radio {
    font-size: 16px;
    display: block;
    line-height: 30px;
    margin-bottom: 2px;
    color:#fff;
  }
  .dialog-footer {
    display: flex;
    justify-content: space-between;
    .el-button {
      width: 100%;
      max-width: 180px;
      border: 1px solid transparent;
      font-weight: 900;
    }
  }
}
.filter-mc {
  margin-right:10px;
  .el-dialog__wrapper {
    height: auto;
    overflow: hidden;
    display: flex;

    .el-dialog {
      max-width: 450px !important;
      max-height: 90%;
      .el-dialog__body {
        height: calc( 100% - 59px - 67px );
        overflow-y: scroll;
        .el-checkbox {
          display: block;
          font-size: 16px;
          display: block;
          line-height: 30px;
          margin-bottom: 2px;
          color:#fff;
        }
      }
    }
  }
  .el-dialog__body::-webkit-scrollbar {
    width: 5px;
    background-color: #103260;
  }
  .el-dialog__body::-webkit-scrollbar-thumb {
    width: 5px;
    background: #103260;
  }
  .el-dialog__body::-webkit-scrollbar-track {
      background: #445686;
  }
}
.drawer-btn {
  display: flex;
  justify-content: space-around;
  .el-button {
    display: flex;
    justify-content: center;
    align-items: center;
    max-width: 50%;
    white-space: nowrap;
    padding-inline: 26.4px;
    min-width: auto;
  }
}
@media screen and (max-width: 470px) {
  .el-row {
    // justify-content: center !important;
  }
  .el-message-box__wrapper .el-message-box {
      width: unset;
  }
  .properties {
    .hide {
      display: none;
    }
  }
}

@media screen and (max-width:780px) {
  .properties {
    .el-dialog {
      width: 95% !important;
      max-width: 500px;
    }
  }
  .filter-mc {
    .el-dialog {
      width: 90% !important;
    }
  }
}
@media screen and (min-width: 780px) and (max-width:1375px) {
  .filter-mc {
    .el-dialog {
      width: 70% !important;
    }
  }
}
</style>

