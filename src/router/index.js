import Vue from 'vue'
import Router from 'vue-router'

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/login', component: () => import('@/views/login/index'), hidden: true },
  { path: '/404', component: () => import('@/views/404'), hidden: true },

  // {
  //   path: '/',
  //   component: Layout,
  //   redirect: '/dashboard',
  //   name: 'Dashboard',
  //   hidden: true,
  //   children: [{
  //     path: 'dashboard',
  //     component: () => import('@/views/dashboard/index')
  //   }]
  // },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [{
      path: 'dashboard',
      component: () => import('@/views/dashboard/index'),
      name: 'dashboard',
      meta: { title: '首页', icon: 'dashboard', noCache: true }
    }]
  },
  {
    path: '/wendang',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Wendang',
        component: () => import('@/views/wendang/index'),
        meta: { title: '文档', icon: 'wendang' }
      }
    ]
  },
  {
    path: '/kebiao',
    component: Layout,
    redirect: '/kebiao/gaozhong',
    name: 'Kebiao',
    meta: { title: '课表管理', icon: 'kebiao' },
    children: [
      {
        path: 'gaozhong',
        name: 'Gaozhong',
        component: () => import('@/views/gaozhong/index'),
        meta: { title: '高中课表', icon: 'gaozhong' }
      },
      {
        path: 'chuzhong',
        name: 'Chuzhong',
        component: () => import('@/views/chuzhong/index'),
        meta: { title: '初中课表', icon: 'chuzhong' }
      },
      {
        path: 'xiaoxue',
        name: 'Xiaoxue',
        component: () => import('@/views/xiaoxue/index'),
        meta: { title: '小学课表', icon: 'xiaoxue' }
      }
    ]
  },
  {
    path: '/jiaoshi',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Jiaoshi',
        component: () => import('@/views/jiaoshi/index'),
        meta: { title: '教师信息', icon: 'jiaoshi' }
      }
    ]
  },
  {
    path: '/xinwen',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Xinwen',
        component: () => import('@/views/xinwen/index'),
        meta: { title: '新闻管理', icon: 'xinwen' }
      }
    ]
  },
  {
    path: '/shipin',
    component: Layout,
    redirect: '/shipin/pc_shipin',
    name: 'Shipin',
    meta: { title: '视频', icon: 'shipin_guanli' },
    children: [
      {
        path: 'pc_shipin',
        name: 'Pc_shipin',
        component: () => import('@/views/pc_shipin/index'),
        meta: { title: '官网视频', icon: 'pc' }
      },
      {
        path: 'xiaochengxu_shipin',
        name: 'Xiaochengxu_shipin',
        component: () => import('@/views/xiaochengxu_shipin/index'),
        meta: { title: '小程序视频', icon: 'xiaochengxu' }
      }
    ]
  },
  {
    path: '/luntan',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Luntan',
        component: () => import('@/views/luntan/index'),
        meta: { title: '论坛', icon: 'luntan' }
      }
    ]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/table',
    name: 'Example',
    meta: { title: '示例', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: '表格', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: '树形图', icon: 'tree' }
      }
    ]
  },

  {
    path: '/form',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Form',
        component: () => import('@/views/form/index'),
        meta: { title: '表单', icon: 'form' }
      }
    ]
  },

  { path: '*', redirect: '/404', hidden: true }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

