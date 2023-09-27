/**
 * Created by Tran Van Truong on 10/05/2021.
 */
// VPunks
const errorMessage = {
  ERC721: {
    // 'You cannot bid your auction',
    // 'auction does not exist',
  },
  ERC721Auction: {
    E1: 'there are still some auctions',
    E2: 'transfer to the zero address',
    E3: 'transfer to this contract address',
    E4: 'no excess balance',
    E5: 'transfer amount must be greater than 0',
    E6: 'transfer amount exceeds balance',
    E7: 'unable to send value, recipient may have reverted'
  }
}

/**
 * @param {string} str
 * @returns {string}
 */
export function parseErrorMessage(group, str) {
  let mss = null
  const groupErr = errorMessage[group]
  if (typeof groupErr !== 'object') return mss
  for (const i in groupErr) {
    if (str.includes(` ${i}"`)) {
      mss = groupErr[i]
      break
    }
  }
  return mss
}
