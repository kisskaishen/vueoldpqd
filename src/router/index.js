import Vue from 'vue'
import Router from 'vue-router'
const home = r => require.ensure([], () => r(require('@/page/home/home')), 'home')
const ranking = r => require.ensure([], () => r(require('@/page/ranking/ranking')), 'ranking')
const freeBill = r => require.ensure([], () => r(require('@/page/freeBill/freeBill')), 'freeBill')
const search = r => require.ensure([], () => r(require('@/page/search/search')), 'search')
const userCenter = r => require.ensure([], () => r(require('@/page/userCenter/userCenter')), 'userCenter')
const chat = r => require.ensure([], () => r(require('@/page/chat/chat')), 'chat')
const editorAdr = r => require.ensure([], () => r(require('@/page/editorAdr/editorAdr')), 'editorAdr')
const coupon = r => require.ensure([], () => r(require('@/page/coupon/coupon')), 'coupon')
const afterSales = r => require.ensure([], () => r(require('@/page/afterSales/afterSales')), 'afterSales')
const userSend = r => require.ensure([], () => r(require('@/page/userSend/userSend')), 'userSend')
const platformInvolved = r => require.ensure([], () => r(require('@/page/platformInvolved/platformInvolved')), 'platformInvolved')
const refundDetail = r => require.ensure([], () => r(require('@/page/refundDetail/refundDetail')), 'refundDetail')
const myCoupon = r => require.ensure([], () => r(require('@/page/myCoupon/myCoupon')), 'myCoupon')
const active = r => require.ensure([], () => r(require('@/page/active/active')), 'active')
const parallelSession = r => require.ensure([], () => r(require('@/page/parallelSessions/parallelSessions')), 'parallelSession')
const redPacket = r => require.ensure([], () => r(require('@/page/redPacket/redPacket')), 'redPacket')
const double12 = r => require.ensure([], () => r(require('@/page/double12/double12')), 'double12')
const double12Son = r => require.ensure([], () => r(require('@/page/double12Son/double12Son')), 'double12Son')
const doubleTwelveRules = r => require.ensure([], () => r(require('@/page/doubleTwelveRules/doubleTwelveRules')), 'doubleTwelveRules')
const seckill = r => require.ensure([], () => r(require('@/page/seckill/seckill')), 'seckill')
const addRefund = r => require.ensure([], () => r(require('@/page/addRefund/addRefund')), 'addRefund')
const orderDetail = r => require.ensure([], () => r(require('@/page/orderDetail/orderDetail')), 'orderDetail')
const likeForMe = r => require.ensure([], () => r(require('@/page/likeForMe/likeForMe')), 'likeForMe')
const likeForMePackage = r => require.ensure([], () => r(require('@/page/likeForMePackage/likeForMePackage')), 'likeForMePackage')
const orderList = r => require.ensure([], () => r(require('@/page/orderList/orderList')), 'orderList')
const deliveryDetail = r => require.ensure([], () => r(require('@/page/deliveryDetail/deliveryDetail')), 'deliveryDetail')
const Negotiation = r => require.ensure([], () => r(require('@/page/Negotiation/Negotiation')), 'Negotiation')
const addNegotiation = r => require.ensure([], () => r(require('@/page/addNegotiation/addNegotiation')), 'addNegotiation')
const moneyGo = r => require.ensure([], () => r(require('@/page/moneyGo/moneyGo')), 'moneyGo')
const activityWuyi = r => require.ensure([], () => r(require('@/page/activity/wuyi')), 'activityWuyi')
const activityRules = r => require.ensure([], () => r(require('@/page/activity/rules')), 'activityRules')
const activityMoreList = r => require.ensure([], () => r(require('@/page/activity/moreList')), 'activityMoreList')
Vue.use(Router)

export default new Router({
  routes: [
      {
          path: '/activity/wuyi',
          component: activityWuyi,
          meta:{
              title:'五一活动专场'
          }
      },
      {
          path: '/activity/rules',
          component: activityRules,
          meta:{
              title:'五一活动规则'
          }
      },
      {
          path: '/activity/moreList',
          component: activityMoreList,
          meta:{
              title:'五一活动模块'
          }
      },
    {
      path: '/',
      name: 'home',
      component: home
    },
    {
      path:'/ranking',
      name:'ranking',
      meta:{
        title:'排行榜',
      },
      component:ranking
    },
    {
      path:'/freeBill',
      name:'freeBill',
      meta:{
        title:'免单拼',
      },
      component:freeBill
    },
    {
      path:'/search',
      name:'search',
      meta:{
        title:'搜索',
      },
      component:search
    },
    {
      path:'/userCenter',
      name:'userCenter',
      component:userCenter
    },
    {
      path:'/chat',
      name:'chat',
      component:chat
    },
    {
      path:'/editorAdr',
      meta:{
        title:'地址管理',
      },
      name:'editorAdr',
      component:editorAdr
    },
    {
      path:'/coupon',
      meta:{
        title:'领取优惠券',
      },
      name:'coupon',
      component:coupon
    },
    {
      path:'/afterSales',
      meta:{
        title:'退款/售后',
      },
      name:'afterSales',
      component:afterSales
    },
    {
      path:'/userSend',
      meta:{
        title:'买家发货',
      },
      name:'userSend',
      component:userSend
    },
    {
      path:'/platformInvolved',
      meta:{
        title:'平台介入',
      },
      name:'platformInvolved',
      component:platformInvolved
    },
    {
      path:'/refundDetail',
      meta:{
        title:'售后详情',
      },
      name:'refundDetail',
      component:refundDetail
    },
    {
      path:'/myCoupon',
      meta:{
        title:'我的优惠券',
      },
      name:'myCoupon',
      component:myCoupon
    },
    {
      path:'/active22',
      meta:{
        title:'活动会场',
      },
      name:'active22',
      component:active
    },
    {
      path:'/parallelSession',
      meta:{
        title:'活动分会场',
      },
      name:'parallelSession',
      component:parallelSession
    },
    {
      path:'/redPacket',
      meta:{
        title:'红包新玩法',
      },
      name:'redPacket',
      component:redPacket
    },
    {
      path:'/double12',
      meta:{
        title:'活动会场',
      },
      name:'double12',
      component:double12
    },
    {
      path:'/double12Son',
      meta:{
        title:'分会场',
      },
      name:'double12Son',
      component:double12Son
    },
    {
      path:'/doubleTwelveRules',
      meta:{
        title:'活动规则',
      },
      name:'doubleTwelveRules',
      component:doubleTwelveRules
    },
    {
      path:'/seckill',
      meta:{
        title:'限时秒杀',
      },
      name:'seckill',
      component:seckill
    },
    {
      path:'/addRefund',
      meta:{
        title:'申请退款',
      },
      name:'addRefund',
      component:addRefund
    },
    {
      path:'/orderDetail',
      meta:{
        title:'订单详情',
      },
      name:'orderDetail',
      component:orderDetail
    },
    {
      path:'/likeForMe',
      meta:{
        title:'拼趣多-为我助力',
      },
      name:'likeForMe',
      component:likeForMe
    },
    {
      path:'/likeForMePackage',
      meta:{
        title:'拼趣多',
      },
      name:'likeForMePackage',
      component:likeForMePackage
    },
    {
      path:'/orderList',
      meta:{
        title:'我的订单',
      },
      name:'orderList',
      component:orderList
    },
    {
      path:'/deliveryDetail',
      meta:{
        title:'物流详情',
      },
      name:'deliveryDetail',
      component:deliveryDetail
    },
    {
      path:'/Negotiation',
      meta:{
        title:'协商记录',
      },
      name:'Negotiation',
      component:Negotiation
    },
    {
      path:'/addNegotiation',
      meta:{
        title:'申请平台介入',
      },
      name:'addNegotiation',
      component:addNegotiation
    },
    {
      path:'/moneyGo',
      meta:{
        title:'钱款去向',
      },
      name:'moneyGo',
      component:moneyGo
    },
  ]
})
