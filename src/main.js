// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
require('swiper/dist/css/swiper.css')
import Vue from 'vue'
import App from './App'
import router from './router'
import http from './config/http/axios.config'  //配置全局axios
import './assets/js/oauthLogin'  //全局登陆
import './assets/js/rem'  //引入自适应布局rem
import { Lazyload,InfiniteScroll,Toast,Popup,MessageBox } from 'mint-ui'//懒加载 无限加载
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueWechatTitle from 'vue-wechat-title'
import Progress from 'vue-multiple-progress'
Vue.component(Progress.name, Progress)
Vue.use(Lazyload)
Vue.use(InfiniteScroll)
Vue.use(VueAwesomeSwiper)
Vue.use(VueWechatTitle)
Vue.component(Popup.name, Popup);
Vue.prototype.http=http;
Vue.prototype.Toast = Toast;
Vue.config.productionsTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
