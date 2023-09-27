import request from '@/utils/request'
// query: thêm "?" để tránh query bằng undefined sẽ sai url
export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function getVpunks(query) {
  return request({
    url: `/app/vpunks?${query}`,
    method: 'get'
  })
}

export function getChallenges(query) {
  return request({
    url: `/app/challenge01?${query}`,
    method: 'get'
  })
}

export function getMyChallenges(query) {
  return request({
    url: `/app/my-challenge01?${query}`,
    method: 'get'
  })
}

export function registerChallenge(query) {
  return request({
    url: `/app/register-challenge01?${query}`,
    method: 'get'
  })
}

export function claimRewardChallenge(query) {
  return request({
    url: `/app/claim-reward-challenge01?${query}`,
    method: 'get'
  })
}

export function challenge01Winners(query) {
  return request({
    url: `/app/challenge01-winners?${query}`,
    method: 'get'
  })
}

export function game01Leaderboard(query) {
  return request({
    url: `/app/game01-leaderboard?${query}`,
    method: 'get'
  })
}

export function fundingBalance(query) {
  return request({
    url: `/app/funding-balance?${query}`,
    method: 'get'
  })
}

export function fundingWithdraw(query) {
  return request({
    url: `/app/funding-withdraw01?${query}`,
    method: 'get'
  })
}

export function fundingHistory(query) {
  return request({
    url: `/app/funding-history?${query}`,
    method: 'get'
  })
}

export function fundingPending(query) {
  return request({
    url: `/app/funding-pending?${query}`,
    method: 'get'
  })
}
export function fundingPendingUpdate(query) {
  return request({
    url: `/app/funding-pend-update?${query}`,
    method: 'get'
  })
}
