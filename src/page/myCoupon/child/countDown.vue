<template>
  <div id="countDown">
    {{str}}
  </div>
</template>

<script>
  export default {
    data() {
      return {
        str:'00:00:00'
      }
    },
    props:['timeLeft'],
    mounted() {
      let self_ = this;
      let endTime = self_.timeLeft;
      let h = 23 ;
      let m = 59 ;
      let s = 59 ;
      setInterval(function () {
        endTime--;
        if(endTime>86400){
          self_.str = '23:59:59'
        }else{
          h = Math.floor(endTime / 3600);
          m = Math.floor(endTime % 3600 / 60);
          s = endTime % 60;
          h = h<10?'0'+h:h
          m = m<10?'0'+m:m
          s = s<10?'0'+s:s
          self_.str = h + ':' + m + ':'+ s;
        }
      },1000)
    },
    methods: {}
  }
</script>

<style lang='scss' scoped>
  @import "../../../style/common";
  #countDown {
    font-size: .24rem;
    color: #f61027;
    width: 100%;
    width: 1rem;
  }
</style>
