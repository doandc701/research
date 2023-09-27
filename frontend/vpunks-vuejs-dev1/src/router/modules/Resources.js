/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const resourceRouter = {
  path: '/resources',
  component: Layout,
  redirect: '/resources/partners',
  name: 'Resources',
  meta: {
    title: 'resources',
    icon: 'source'
  },
  children: [
    {
      path: 'partners',
      component: () => import('@/views/resources/partners'),
      name: 'Partners',
      meta: { title: 'partners' }
    },
    {
      path: 'tokenomics',
      component: () => import('@/views/resources/tokenomics'),
      name: 'Tokenomics',
      meta: { title: 'tokenomics' }
    },
    {
      path: 'token&contract',
      component: () => import('@/views/resources/token&contract'),
      name: 'Token & Contract',
      meta: { title: 'tokenContract' }
    },
    {
      path: 'roadmap',
      component: () => import('@/views/resources/roadmap'),
      name: 'Roadmap',
      meta: { title: 'Roadmap' }
    }/*,
    {
      path: 'gallery',
      component: () => import('@/views/resources/gallery'),
      name: 'Gallery',
      meta: { title: 'Gallery' }
    }*/
  ]
}
export default resourceRouter
