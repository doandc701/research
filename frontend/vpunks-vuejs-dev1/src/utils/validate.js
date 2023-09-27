/**
 * Created by PanJiaChen on 16/11/18.
 */
import Vue from 'vue'
import { network } from '@/settings'
/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'editor']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} url
 * @returns {Boolean}
 */
export function validURL(url) {
  const reg = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
  return reg.test(url)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validLowerCase(str) {
  const reg = /^[a-z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUpperCase(str) {
  const reg = /^[A-Z]+$/
  return reg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validAlphabets(str) {
  const reg = /^[A-Za-z]+$/
  return reg.test(str)
}

/**
 * @param {string} email
 * @returns {Boolean}
 */
export function validEmail(email) {
  const reg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return reg.test(email)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function isString(str) {
  if (typeof str === 'string' || str instanceof String) {
    return true
  }
  return false
}

/**
 * @param {Array} arg
 * @returns {Boolean}
 */
export function isArray(arg) {
  if (typeof Array.isArray === 'undefined') {
    return Object.prototype.toString.call(arg) === '[object Array]'
  }
  return Array.isArray(arg)
}

// tvt
export function isConnected(checkChainId, checkWallet) {
  if (checkChainId && window.chainIdError) {
    if (checkChainId[1]) {
      Vue.prototype.$alert(`Please connect to the appropriate ${network} network.`, 'Wrong Network', {
        confirmButtonText: 'OK',
        type: 'warning'
      }).catch(() => {})
    }
    if (checkChainId[0]) return false
  }

  if (checkWallet && window.selectedAccount === null) {
    if (checkWallet[1]) {
      Vue.prototype.$alert('Please connect your wallet.', 'Missing wallet address', {
        confirmButtonText: 'OK',
        type: 'warning'
      }).catch(() => {})
    }
    if (checkWallet[0]) return false
  }
  return true
}
/*
// tham khảo
export function isValidDate2(dateString) {
  // First check for the pattern
  if (!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) return false

  // Parse the date parts to integers
  var parts = dateString.split('/')
  var day = parseInt(parts[1], 10)
  var month = parseInt(parts[0], 10)
  var year = parseInt(parts[2], 10)

  // Check the ranges of month and year
  if (year < 1000 || year > 3000 || month === 0 || month > 12) return false

  var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

  // Adjust for leap years
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) monthLength[1] = 29

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1]
}
//  DD/MM/YYYY or DD-MM-YYYY
export function isValidDate(dateString) {
  var dateformat = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
  // Match the date format through regular expression
  if (dateString.match(dateformat)) {
    // Test which seperator is used '/' or '-'
    var opera1 = dateString.split('/')
    var opera2 = dateString.split('-')
    // Extract the string into month, date and year
    if (opera1.length > 1) {
      var pdate = dateString.split('/')
    } else if (opera2.length > 1) {
      var pdate = dateString.split('-')
    }
    var dd = parseInt(pdate[0])
    var mm = parseInt(pdate[1])
    var yy = parseInt(pdate[2])
    // Create list of days of a month [assume there is no leap year by default]
    var ListofDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    if (mm === 1 || mm > 2) {
      if (dd > ListofDays[mm - 1]) {
        return false
      }
    }
    if (mm === 2) {
      var lyear = false
      if ((!(yy % 4) && yy % 100) || !(yy % 400)) {
        lyear = true
      }
      if ((lyear === false) && (dd >= 29)) {
        return false
      }
      if ((lyear === true) && (dd > 29)) {
        return false
      }
    }
    return true
  } else {
    return false
  }
} */
