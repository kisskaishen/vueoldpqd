<template lang="html">
  <div id="loadingMore">
    <span v-show="loadingCtr">
      <img src="./images/loading@2x.png" alt="">
      <span>加载中</span>
    </span>
    <span v-show="!loadingCtr" class="noneData">我是有底线的，别拉了</span>
  </div>
</template>

<script>
export default {
  name:'loading',
  props:['loadingCtr'],
  watch:{
    loadingCtr(val){
      console.log('11111',val)
    }
  }
}
</script>

<style lang="scss">
#loadingMore {
  display: flex;
  justify-content: center;
  align-items: center;
  height: .8rem;
  >span {
    display: flex;
    align-items: center;
    img {
      height: .4rem;
      margin-right: .2rem;
      animation: spin .6s linear infinite;
    }
    span {
      font-size: .26rem;
      color: #666;
    }
    @keyframes spin {
      0%   { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
  .noneData {
    font-size: .22rem;
    color: #666;
  }
  .noneData::before {
    content: '';
    width: 1rem;
    border-top: .01rem solid #666;
    margin-right: .1rem;
  }
  .noneData::after {
    content: '';
    width: 1rem;
    border-top: .01rem solid #666;
    margin-left: .1rem;
  }
}
</style>
