/** When your routing table is too long, you can split it into small modules **/

import Layout from '@/layout'

const statsRouter = {
  path: '/stats',
  component: Layout,
  redirect: '/stats/rankings',
  name: 'Stats',
  meta: {
    title: 'stats',
    icon: 'bar-chart',
    img: 'soon'
  },
  children: [
    {
      path: 'rankings',
      component: () => import('@/views/stats/rankings'),
      name: 'Rankings',
      meta: { title: 'rankings' }
    },
    {
      path: 'activity',
      component: () => import('@/views/stats/activity'),
      name: 'Activity',
      meta: { title: 'activity' }
    }
  ]
}
export default statsRouter
