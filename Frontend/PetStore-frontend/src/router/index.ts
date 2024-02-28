import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    meta: {
      title: 'Home - PawPose'
    },
    component: () => import(/* webpackChunkName: "auth.login" */ '../views/Home.vue'),
  },
  {
    path: '/login',
    name: 'auth.login',
    meta: {
      noAuth: true,
      title: 'Login - PawPose'
    },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "auth.login" */ '../views/auth/Login.vue')
  },
  {
    path: '/register',
    name: 'auth.register',
    meta: {
      noAuth: true,
      title: 'Join us - PawPose'
    },
    component: () => import('../views/auth/Register.vue')
  },
  {
    path: '/cart',
    name: 'shopping-cart',
    meta: {
      title: 'Shopping Cart - PawPose'
    },
    component: () => import('../views/shoppingCart/ShoppingCart.vue')
  },
  {
    path: '/product/:productId',
    props: true,
    name: 'product.product-page',
    meta: {
      title: 'Product - PawPose'
    },
    component: () => import('../views/product/Product.vue')
  },
  {
    path: '/user',
    props: true,
    name: 'user.frame',
    component: () => import('../views/user/UserFrame.vue'),
    redirect: { name: 'user.orders' },
    meta: {
      requireAuth: true,
      title: 'Orders - PawPose'
    },
    children: [
      {
        path: 'orders',
        props: true,
        name: 'user.orders',
        meta: {
          requireAuth: true,
          title: 'Orders - PawPose'
        },
        component: () => import('../views/user/order/OrderList.vue')
      },
      {
        path: 'order/:orderId',
        props: true,
        name: 'user.orderDetail',
        meta: {
          requireAuth: true,
          title: 'Orders - PawPose'
        },
        component: () => import('../views/user/order/OrderDetail.vue')
      },
      {
        path: 'settings/address',
        name: 'user.settings.address',
        meta: {
          requireAuth: true,
          title: 'Address Book - PawPose'
        },
        component: () => import('../views/user/settings/Address.vue')
      },
      {
        path: 'settings/security',
        name: 'user.settings.security',
        meta: {
          requireAuth: true,
          title: 'Login & Security - PawPose'
        },
        component: () => import('../views/user/settings/Security.vue')
      }
    ]
  },
  {
    path: '/checkout',
    name: 'checkout',
    meta: {
      requireAuth: true,
      title: 'Checkout - PawPose'
    },
    component: () => import('../views/checkout/CheckoutFrame.vue')
  },
  {
    path: '/search',
    name: 'search',
    props: true,
    component: () => import('../views/store/SearchResult.vue'),
    meta: {
      title: 'Search - PawPose'
    }
  },
  {
    path: '/tag/:tagId',
    name: 'tagPage',
    props: true,
    meta: {
      title: 'Tag - PawPose'
    },
    component: () => import('../views/store/TagPage.vue')
  },
  {
    path: '/404',
    name: 'notFoundPage',
    meta: {
      title: 'Page Not Found - PawPose'
    },
    component: () => import('../views/common/NotFoundPage.vue')
  },
  { path: '*', redirect: { name: 'notFoundPage' } }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
