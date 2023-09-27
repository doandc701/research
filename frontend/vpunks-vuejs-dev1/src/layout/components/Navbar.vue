<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <!--
      <template>
        <lang-select style="font-size:18px" class="right-menu-item hover-effect" />
      </template> -->
      <!--Select a wallet-->
      <el-button v-if="!chainIdError&&address===null" class="btn-connect" @click="selectWallet()">Connect to wallet</el-button>
      <el-button v-else-if="chainIdError" class="btn-wrong" type="danger" @click="checkNetwork()">Wrong Network</el-button>
      <auction-cart v-if="isConnected" class="cart-container right-menu-item hover-effect" />
      <el-dropdown v-show="address!==null" class="avatar-container right-menu-item hover-effect" trigger="click" :style="{ marginRight: avaMarginRight + 'px' }">
        <div class="avatar-wrapper">
          {{ addressV }}
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <div class="btn-connect-drop"><el-button type="info" size="small" plain @click="copyAddress($event)">Copy address</el-button></div>
          <div class="btn-connect-drop"><el-button type="primary" size="small" plain @click="selectWallet()">Add another wallet</el-button></div>
          <router-link to="/my-account/">
            <el-dropdown-item class="item-drop-nav">Your NFTs</el-dropdown-item>
          </router-link>
          <router-link to="/my-account/wallet">
            <el-dropdown-item class="item-drop-nav">Your Wallet</el-dropdown-item>
          </router-link>
        </el-dropdown-menu>
      </el-dropdown>

    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import AuctionCart from '@/components/AuctionCart'
import { isConnected } from '@/utils/validate'
import clip from '@/utils/clipboard' // use clipboard directly
// import LangSelect from '@/components/LangSelect'

export default {
  components: {
    Breadcrumb,
    Hamburger,
    AuctionCart
    // LangSelect
  },
  data() {
    return {
      // general
      debug: false,
      address: null,
      addressV: '',
      showAvaContainer: true,
      avaMarginRight: '10',
      chainIdError: false,
      isConnected: false
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'device'
    ])
  },
  created() {
    this.debug && console.log('created - navbar', window.selectedAccount)
    this.chainIdError = window.chainIdError
    this.isConnected = isConnected([true, false], [true, false]) // checkChainId, checkWallet
    if (!this.isConnected) return
    this.address = window.selectedAccount
    this.addressV = `${this.address.slice(0, 5)}...${this.address.slice(this.address.length - 3)}`
  },
  mounted() {
    // this.debug && console.log('mounted - navbar')
    window.addEventListener('resize', this.handleWindowResize)
    this.handleWindowResize()
  },
  beforeDestroy() {
    // this.debug && console.log('beforeDestroy - navbar')
    window.removeEventListener('resize', this.handleWindowResize)
  },
  methods: {
    // @
    handleWindowResize(event) {
      // this.debug && console.log('innerWidth:', window.innerWidth)
      const w = window.innerWidth
      this.avaMarginRight = w > 560 ? '10' : '0'
      // this.showAvaContainer = w > 450
    },
    // @
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    // @
    copyAddress(event) {
      clip(this.address, event)
    },
    //
    checkNetwork() {
      isConnected([true, true], [false, false]) // checkChainId, checkWallet
    },
    // @
    async selectWallet() {
      this.debug && console.log('selectWallet - connex.version', window.connex.version)
      const txClause = {
        purpose: 'identification',
        payload: {
          type: 'text',
          content: 'Please select a wallet to grant access to DApp.'
        }
      }
      const signArgs = ['cert']
      const requestArgs = []
      if (window.connex.version) requestArgs.push(txClause)
      else signArgs.push(txClause)
      try {
        const signingService = window.connex.vendor.sign(...signArgs)
        signingService.request(...requestArgs).then(async(cert) => {
          this.debug && console.log('cert', cert)
          this.debug && console.log('cert.annex.signer', cert.annex.signer)
          this.address = cert.annex.signer
          this.addressV = `${this.address.slice(0, 5)}...${this.address.slice(this.address.length - 3)}`
          this.$message({
            message: 'Successfully added address',
            type: 'success',
            duration: 1000
          })
          await this.$store.dispatch('user/addWallet', this.address)
          this.$router.push({ path: `/my-redirect?redirect=${this.$router.history.current.path}` })
        }).catch(error => { // sync: user cancelled, sync2: user decline
          if (error.message && error.message.indexOf('TypeError') !== -1) {
            this.$message.error('Oops, Wallet is faulty, please use another wallet.')
            // this.$message.error(error.message)
          }
        })
      } catch (error) {
        this.debug && console.log(error)
        return ''
      }
    },
    selectWallet33() {
      console.log('web3.eth.defaultAccount', window.web3.eth.defaultAccount)
      console.log('web3', window.web3)
      console.log('web3.sha3', window.web3.utils.sha3('test'))
      window.web3.eth.sign(window.web3.eth.defaultAccount, window.web3.utils.sha3('test'), function(err, signature) {
        if (err) console.log('err: ', err)
        console.log('signature: ', signature) // But maybe do some error checking. :-)
      })
    },
    // @
    async selectWallet3() {
      this.debug && console.log('selectWallet - connex.version', window.connex.version)
      const txClause = {
        purpose: 'identification', // agreement
        payload: {
          type: 'text',
          content: 'a'
        }
      }
      const signArgs = ['cert']
      const requestArgs = []
      if (window.connex.version) requestArgs.push(txClause)
      else signArgs.push(txClause)
      try {
        const signingService = window.connex.vendor.sign(...signArgs)
        signingService.request(...requestArgs).then(async(cert) => {
          this.debug && console.log('cert', cert)
          this.debug && console.log('cert.signature', cert.signature)
          this.address = cert.annex.signer
          this.addressV = `${this.address.slice(0, 5)}...${this.address.slice(this.address.length - 3)}`
          this.$message({
            message: 'Successfully added address',
            type: 'success',
            duration: 1000
          })
          await this.$store.dispatch('user/addWallet', this.address)
          this.$router.push({ path: `/my-redirect?redirect=${this.$router.history.current.path}` })
        }).catch(error => { // sync: user cancelled, sync2: user decline
          if (error.message && error.message.indexOf('TypeError') !== -1) {
            this.$message.error('Oops, Wallet is faulty, please use another wallet.')
            // this.$message.error(error.message)
          }
        })
      } catch (error) {
        this.debug && console.log(error)
        return ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.el-dropdown-menu a {
  text-align: center;
}
.el-dropdown-menu {
  .btn-connect-drop {
    display: block;
    margin: 15px 25px;
    text-align: center;
    .el-button {
      background-color: rgb(46, 54, 112);
      color: #fff;
      border: rgb(74, 84, 149);
      border-radius: 10px;
    }
    .el-button:hover {
      background-color: #374189 !important;
    }
  }
}

::v-deep .el-dropdown .el-dropdown-menu .el-dropdown-menu__item:not(.is-disabled):hover, .el-dropdown-menu__item:hover {
    background-color: rgb(46, 54, 112) !important;
    color: #fff;
}
.item-drop-nav {
  color: #fff;
}
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #2E4073;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .1)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .cart-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    position: absolute;
    right: 0;
    height: 100%;
    line-height: 50px;
    background: rgba(46, 64, 115, .75);

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 16px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .15)
        }
      }
    }

    .btn-connect {
      margin: 8px 8px;
      vertical-align: top;
      background: #558C3F;
      border: none;
      color: #fff;
      border-radius: 16px;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
      &:hover {
        background: #6fa758;
      }
    }

    .btn-wrong {
      margin: 8px 8px;
      vertical-align: top;
      border-radius: 16px;
      box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.15);
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 8px;
        padding: 0 8px;
        line-height: 34px;
        position: relative;
        background: #2e993e;
        color: #fff;
        border-radius: 15px;
        -webkit-border-radius: 15px;
        -moz-border-radius: 15px;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
