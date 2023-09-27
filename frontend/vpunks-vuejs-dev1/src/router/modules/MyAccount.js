/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const tableRouter = {
  path: '/my-account',
  component: Layout,
  redirect: '/my-account/my-profile',
  name: 'MyAccount',
  meta: {
    title: 'myAccount',
    icon: 'user'
  },
  children: [
    {
      path: 'my-profile',
      component: () => import('@/views/my-account/my-profile'),
      name: 'MyProfile',
      meta: { title: 'My Profile' }
    },
    /* {
      path: 'nfts',
      component: () => import('@/views/my-account/index'),
      name: 'MyNFTs',
      meta: { title: 'NFTs' }
    },
    {
      path: 'running-auctions',
      component: () => import('@/views/my-account/running-auctions'),
      name: 'YourRunningAuctions',
      meta: { title: 'Running Auctions' }
    },
    {
      path: 'finished-auctions',
      component: () => import('@/views/my-account/finished-auctions'),
      name: 'YourFinishedAuctions',
      meta: { title: 'Finished Auctions' }
    },
    {
      path: 'bid-offer',
      component: () => import('@/views/my-account/bid-offer'),
      name: 'BidOffer',
      meta: { title: 'Bid / Offer', img: 'new' }
    },
    {
      path: 'staking',
      component: () => import('@/views/my-account/staking'),
      name: 'YourStaking',
      meta: { title: 'Staking' }
    }, */
    {
      path: 'wallet',
      component: () => import('@/views/my-account/wallet'),
      name: 'Wallet',
      meta: { title: 'Wallet' }
    },
    {
      path: 'claim',
      component: () => import('@/views/my-account/claim'),
      name: 'Claim',
      meta: { title: 'Claim VPU' }
    }
  ]
}
export default tableRouter
