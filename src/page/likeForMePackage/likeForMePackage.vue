<template lang="html">
  <div id="likeForMePackage">
    <span class="img">
      <img src="./images/bg.png" alt="">
    </span>
    <div class="redpackage">
      <div class="">
        <p>
          <span>
            <span>通用红包</span>
            <span>满10可用</span>
          </span>
          <span>
            ¥<span>5</span>
          </span>
        </p>
        <p>
          <span>2天后过期</span>
          <span>去使用&nbsp;></span>
        </p>

      </div>
      <span>立即使用</span>
    </div>
    <div class="rules">
      <span>
        <span>活动规则</span>
      </span>
      <p>1.每名用户活动期间只能领用一次红包；</p>
      <p>2.领取的红包账号同下单账号为同一账号；</p>
      <p>3.使用红包需要在拼趣多平台用领取红包的手机号码注册；</p>
      <p>4.红包在订单结算的时候使用，每单仅能使用一张红包，不支持拆开使用；</p>
      <p>5.红包不支持提现；</p>
    </div>
  </div>
</template>

<script>
export default {
  name:'likeForMePackage',
}
</script>

<style lang="scss">
#likeForMePackage {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #fdd73b;
  .img {
    width: 7.5rem;
    height: 5.67rem;
    img {
      width: 7.5rem;
    }
  }
  .redpackage {
    width: 7.1rem;
    height: 3.73rem;
    background-color: #f6f6f6;
    border-radius: .14rem;
    padding: .2rem .2rem .25rem .2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    >div {
      width: 100%;
      background-color: #fff;
      border-radius: .14rem;
      height: 2rem;
      p:first-child {
        padding: .2rem .5rem .3rem .5rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: .01rem solid #eee;
        height: 1.4rem;
        >span:first-child {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          span:first-child {
            font-size: .36rem;
            color: #F61027;
            line-height: .36rem;
          }
          span:last-child {
            font-size: .26rem;
            line-height: .26rem;
            color: #333;
          }
        }
        >span:last-child {
          color: #F61027;
          font-size: .36rem;
          >span {
            font-size: .8rem;
            color: #F61027;
          }
        }
      }
      p:last-child {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 .5rem;
        line-height: .58rem;
        span {
          font-size: .26rem;
          color: #ccc;
          display: flex;
          align-items: center;
        }
      }
    }
    >span {
      height: .88rem;
      width: 6.7rem;
      background-color: #F61027;
      border-radius: .44rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: .3rem;
    }
  }
  .rules {
    height: 3.7rem;
    width: 7.1rem;
    background-color: #f6f6f6;
    margin-bottom: .4rem;
    border-radius: .14rem;
    margin-top: .25rem;
    padding: .18rem;
    >span {
      width: 100%;
      display: flex;
      justify-content: center;
      margin-bottom: .1rem;
      span {
        font-size: .34rem;
        color: #333;
        position: relative;
        &::before {
          content: '';
          height: .01rem;
          width: 2.47rem;
          background-color: #ccc;
          position: absolute;
          top:50%;
          left: -2.67rem;
        }
        &::after {
          content: '';
          height: .01rem;
          width: 2.47rem;
          background-color: #ccc;
          position: absolute;
          top:50%;
          right: -2.67rem;
        }
      }
    }
    p {
      font-size: .26rem;
      color: #999;
      line-height: .46rem;
    }
  }
}
</style>
