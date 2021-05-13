import Layout from '@/layout'

const detailRouter = {
  path: '/detail-manage',
  component: Layout,
  redirect: '/detail-manage/detail-list',
  alwaysShow: true,
  id: 656,
  name: 'detail-manage',
  meta: {
    title: '明细管理',
    icon: 'nested'
  },
  children: [
    {
      path: 'detail-list',
      component: () => import('@/views/detail-manage/detail-list'),
      name: 'detail-list',
      id: 657,
      meta: { title: '明细列表', noCache: true }
    },
  ]
}

export default detailRouter
