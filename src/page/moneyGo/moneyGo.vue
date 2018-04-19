<template lang="html">
  <div class="moneyGo">
    <div class="header">
      <p>
        <span>退款金额</span>
        <span>¥{{refundData.return_money}}</span>
      </p>
      <p>
        <span>退换账户</span>
        <span>{{refundData.return_way}}</span>
      </p>
    </div>
    <div class="items">
      <div class="item" v-for="item in refundData.return_history">
        <p>
          <span>{{item.title}}</span>
          <span>{{formatDate(item.time)}}</span>
        </p>
        <p class="text">{{item.text}}</p>
        <span>
          <span></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getCookie } from '../../config/mUtils'
export default {
  data(){
    return{
      userId:getCookie('user_id'),
      orderId:'',
      refundData:{},
    }
  },
  mounted(){
    this.getData()
  },
  methods: {
    getData(){
      this.http('get','user/order_refund_history',{
        user_id:this.userId,
        order_id:this.$route.query.orderId
      },(data) => {
        // console.log(data)
        this.refundData = data.result
      })
    },
    formatDate(nS){//转换时间
      return new Date(parseInt(nS) * 1000).toLocaleString().replace(/\//g,'-').replace("上午",'').replace('下午','')
    },
  }
}
</script>

<style lang="scss">
.moneyGo {
  .header {
    padding: 0 .4rem;
    background-color: #fff;
    height: 1.2rem;
    margin-bottom: .15rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    p {
      display: flex;
      justify-content: space-between;
      align-items: center;
      span {
        font-size: .26rem;
        color: #9D9D9D;
      }
    }
    p:first-child {
      span:last-child {
        color:#DF2D24;
      }
    }
    p:last-child {
      span:last-child {
        color: #181818;
      }
    }
    p+p {
      margin-top: .1rem;
    }
  }
  .items {
    background-color: #fff;
    padding: 0 .3rem 0 1rem;
    .item {
      padding: .3rem 0;
      position: relative;
      >span {
        position: absolute;
        height: .3rem;
        width: .3rem;
        border: .01rem solid #D0D0D0;
        border-radius: 50%;
        background-color: #fff;
        top:.45rem;
        left:-.54rem;
      }
      p {
        font-size: .24rem;
        color: #9D9D9D;
        display: flex;
        justify-content: space-between;
        span:first-child {
          font-size: .26rem;
        }
        span:last-child {
          font-size: .24rem;
        }
      }
      .text {
        margin-top: .3rem;
      }
      &::before {
        content: '';
        height: 100%;
        position: absolute;
        width: .04rem;
        left: -.4rem;
        top:.5rem;
        background-color: #D0D0D0;
      }
    }
    .item:last-child {
      &::before {
        width: 0;
        background-color: #fff;
      }
      >span {
        display:flex;
        justify-content: center;
        align-items: center;
        >span {
          // top:calc(50% - .1rem);
          // left: calc(50% - .1rem);
          // position: absolute;
          height: .2rem;
          width: .2rem;
          background-color: #E02E24;
          border-radius: 50%;
        }
      }
    }
  }


}
</style>
