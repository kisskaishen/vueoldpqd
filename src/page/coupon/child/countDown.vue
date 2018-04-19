<template>
    <div id="countDown">
      <span class="unclaimed">{{str}}<button >待领取</button></span>
    </div>
</template>

<script>
    export default {
        data() {
            return {
              str:'00:00:00'
            }
        },
        props:['timeLeft','index'],
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
            }else if(endTime>0&&endTime<86400){
              h = Math.floor(endTime / 3600);
              m = Math.floor(endTime % 3600 / 60);
              s = endTime % 60;
              h = h<10?'0'+h:h
              m = m<10?'0'+m:m
              s = s<10?'0'+s:s
              self_.str = h + ':' + m + ':'+ s;
            }else{
              self_.str = '00:00:00'
              self_.$emit('countDownOut',self_.index)
            }
          },1000)
        },
        methods: {
        }
    }
</script>

<style lang='scss' scoped>
  @import "../../../style/common";
  #countDown {
    .unclaimed {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: .17rem;
      width: 2.4rem;
      height: .5rem;
      line-height: .5rem;
      border-radius: .25rem;
      border: .02rem solid #105cf6;
      color: #666;
      font-size: .22rem;
      button {
        background-color: #105cf6;
        margin-top:.01rem;
        width: 1.2rem;
        text-align: center;
        height: .5rem;
        line-height: .5rem;
        border-radius: .25rem!important;
        font-size: .24rem;
        color: #fff;
      }
    }
  }
</style>
