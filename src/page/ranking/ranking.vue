<template>
    <div id="ranking">
      这是排行榜页
      <footerComponent></footerComponent>
    </div>
</template>

<script>
  import Footer from '../../components/footer/footer.vue'
    export default {
        name:'ranking',
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
