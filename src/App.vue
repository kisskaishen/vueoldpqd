<template>
  <div id="app">
    <router-view v-wechat-title="$route.meta.title"></router-view>
  </div>
</template>

<script>
  export default {
  name: 'app',
    data () {
      return {
        msg: 'Welcome to Your Vue.js App'
      }
    },
    mounted:function () {
    },
}
</script>

<style lang="scss" >
@import "./style/common";
.mint-toast-text {
  color: #fff!important;
}
  #app {
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    position: relative;
  }
.my-toast {
  background-color: #fff;
  padding:.16rem .4rem!important;
  background-color: #000;
  span {
    color: #fff;
  }
}
</style>
