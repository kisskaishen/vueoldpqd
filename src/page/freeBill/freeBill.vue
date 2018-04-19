<template>
  <div id="freeBill">
    这是免单拼页面
    <footerComponent></footerComponent>
  </div>
</template>

<script>
  import Footer from '../../components/footer/footer.vue'

  export default {
    name: 'freeBill',
    data() {
      return {}
    },
    components: {
      'footerComponent': Footer
    },
    mounted() {

    },
    methods: {}
  }
</script>

<style lang='scss' scoped>

</style>
