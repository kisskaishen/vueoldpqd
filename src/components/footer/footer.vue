<template>
    <div id="footer">
      <router-link to="/">
        首页
      </router-link>
      <router-link to="/ranking">
        排行榜
      </router-link>
      <router-link to="/freeBill">
        免单拼
      </router-link>
      <router-link to="/search">
        搜索
      </router-link>
      <router-link to="/userCenter">
        个人中心
      </router-link>
    </div>
</template>

<script>
    export default {
        data() {
            return {}
        },
        mounted() {

        },
        methods: {}
    }
</script>

<style lang='scss' scoped>
  @import "../../style/common";
  #footer {
    position: absolute;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    width: 7.5rem;
    z-index: 9999;
    background-color: pink;
    a {
      width: 25%;
      text-align: center;
      height: .6rem;
      line-height:.6rem;
    }
  }
</style>
