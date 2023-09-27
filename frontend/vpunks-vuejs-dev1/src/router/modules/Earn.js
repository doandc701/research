/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const earnRouter = {
  path: '/earn',
  component: Layout,
  redirect: '/earn/how-to-earn',
  name: 'Earn',
  meta: {
    title: 'earn',
    icon: 'monetization-on',
    img: 'soon'
  },
  children: [
    /* {
      path: 'how-to-earn',
      component: () => import('@/views/earn/how-to-earn'),
      name: 'HowToEarn',
      meta: { title: 'howToEarn' }
    }, */
    {
      path: 'challenges',
      component: () => import('@/views/earn/challenges'),
      name: 'Challenges',
      meta: { title: 'challenges' }
    }
  ]
}
export default earnRouter
