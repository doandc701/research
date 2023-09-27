/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const collectionRouter = {
  path: '/collections',
  component: Layout,
  redirect: '/collections/vpunks-og',
  name: 'Collection',
  meta: {
    title: 'collections',
    icon: 'collections'
  },
  children: [
    {
      path: 'vpunks-og',
      component: () => import('@/views/collections/vpunks-og'),
      name: 'VPunksOG',
      meta: { title: 'vpunkOg' }
    },
    {
      path: 'item-details/:address/:tokenId/',
      component: () => import('@/views/collections/item-details'),
      name: 'ItemDetails',
      meta: { title: 'Item Details' },
      hidden: true
    },
    {
      path: 'weapons',
      component: () => import('@/views/collections/weapons'),
      name: 'Weapons',
      meta: { title: 'weapons', img: 'soon' }
    }
  ]
}
export default collectionRouter
