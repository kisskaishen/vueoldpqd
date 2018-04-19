<template>
  <div id="home">
    <span>这是个人中心</span>
    <footerComponent></footerComponent>
  </div>
</template>

<script>
  import Footer from '../../components/footer/footer.vue'
  export default {
    name:'home',
    data() {
      return {}
    },
    components:{
      'footerComponent':Footer
    },
    mounted() {

    },
    methods: {}
  }
</script>

<style lang='scss' scoped>

</style>
