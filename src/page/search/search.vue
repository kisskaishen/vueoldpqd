<template>
  <div id="search">
    <span>这是搜索页</span>
    <footerComponent></footerComponent>
  </div>
</template>

<script>
  import Footer from '../../components/footer/footer.vue'
  export default {
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
