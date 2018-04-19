<template lang="html">
  <div class="deliveryDetail">
    <div class="orderDetail" v-if="type==2">
      <span>订单信息</span>
      <p>订单编号：{{deliveryData.order_info.order_sn}}</p>
      <p>商品名称：{{deliveryData.order_info.goods_name}}</p>
      <p>支付金额：{{deliveryData.order_info.order_amount}}</p>
      <p>售后状态：{{deliveryData.order_info.order_service}}</p>
    </div>
    <div class="goodsInfo">
      <span>
        <img :src="deliveryData.order_info.goods_img" alt="">
      </span>
      <div class="">
        <span>
          物流单号：{{deliveryData.logistics.shipping_order}}
        </span>
        <span>
          物流公司：{{deliveryData.logistics.logistics_name}}
        </span>
        <span>
          物流电话：{{deliveryData.logistics.logistics_mobile}}
        </span>
        <span>
          物流状态：<span>{{deliveryData.logistics.ischeck}}</span>
        </span>
      </div>
    </div>
    <div class="address" v-if='type==1'>
      <img src="./images/椭圆4.png" alt="">
      <span>收货地址：</span>
      <p>{{deliveryData.order_info.address_base}}{{deliveryData.order_info.address}}</p>
    </div>
    <div class="expressItems">
      <div :class="['expressItem',index==0?'first':'']" v-for='(item,index) in expressInfo'>
        <p>{{item.context}}</p>
        <p class="lastChild">{{item.time}}</p>
        <span>
          <span v-if="index==0"></span>
          <span v-if="index==0"></span>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import { getCookie } from "../../config/mUtils"
export default {
  name:'deliveryDetail',
  data(){
    return{
      expressInfo:[],
      deliveryData:{},
      type:this.$route.query.type,//1 商家发货物流 2 买家发货物流
    }
  },
  mounted(){
    if(this.$route.query.type==1){//卖家发货
      this.getDate()
    }else{//买家发货
      this.getBuyerData()
    }


  },
  methods:{
    getDate(){//拉取商家发货物流详情
      this.http('get','user/order_delivery_detail',{
        order_id:this.$route.query.orderId,
        user_id:getCookie('user_id')
      },(data) => {
        this.deliveryData = data.result
        this.expressInfo = data.result.logistics.express_info
      })
    },
    getBuyerData(){//拉取买家物流详情
      this.http('get','user/service_delivery_detail',{
        order_id:this.$route.query.orderId,
        user_id:getCookie('user_id')
      },(data) => {
        this.deliveryData = data.result
        this.expressInfo = data.result.logistics.express_info
      })
    }
  }
}
</script>

<style lang="scss">
.deliveryDetail {
  .orderDetail {
    padding: .34rem .2rem .22rem .47rem;
    height: 2.6rem;
    background-color: #fff;
    margin-bottom: .15rem;
    display: flex;
    flex-direction: column;
    span {
      font-size: .3rem;
      color: #313131;
      line-height: .31rem;
      padding-bottom: .36rem;
    }
    p {
      font-size: .24rem;
      color: #242424;
    }
  }
  .goodsInfo {
    height: 1.8rem;
    width: 7.5rem;
    background-color: #fff;
    padding: .15rem .38rem;
    display: flex;
    >span {
      height: 1.5rem;
      width: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      img {
        width: 100%;
      }
    }
    >div {
      display: flex;
      flex-direction: column;
      margin-left: .27rem;
      height: 100%;
      justify-content: center;
      >span {
        font-size: .26rem;
        color: #292929;
        span {
          color: #DF2D24;
          font-size: .26rem;
        }
      }
    }
  }
  .address {
    display: flex;
    padding: .23rem .56rem .27rem .43rem;
    background-color: #fff;
    margin: .15rem 0;
    img {
      height: .36rem;
      width: .3rem;
      margin-right: .26rem;
    }
    span {
      display: flex;
      font-size: .26rem;
      color: #181818;
    }
    p {
      font-size: .26rem;
      color: #181818;
    }
  }
  .expressItems {
    padding-left: 1rem;
    padding-top: .27rem;
    padding-right: .2rem;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    position: relative;
    &::before {
      content: '';
      position: absolute;
      height: .02rem;
      width: 7.1rem;
      left: .2rem;
      top: 0;
      background-color: #f8f8f8;
    }
    .expressItem {
      padding-bottom: .74rem;
      position: relative;
      >span {
        position: absolute;
        height: .2rem;
        width: .2rem;
        background-color: #D0D0D0;
        border-radius: 50%;
        left: -.48rem;
        top: .15rem;
      }
      p:first-child {
        font-size: .26rem;
        color: #000;
      }
      .lastChild {
        font-size: .24rem;
        color: #9D9D9D;
        // color: red;
      }
      &::before {
        content: '';
        position: absolute;
        left:-.4rem;
        top:.27rem;
        height: 100%;
        width: .04rem;
        background-color: #D0D0D0;
      }
    }
    .expressItem:first-child {
      p:first-child {
        color: #13C635;
      }
      >span {
        width: .24rem;
        height: .24rem;
        background-color: rgba(224,46,36,.4);
        left: -.5rem;
        span:first-child {
          position: absolute;
          left: .02rem;
          top: .02rem;
          width: .2rem;
          height: .2rem;
          background-color: #E02E24;
          border-radius: 50%;
        }
        span:last-child {
          width: .04rem;
          height: .3rem;
          background-color: #E02E24;
          position: absolute;
          top:.2rem;
          left:.1rem;
        }

      }
    }
    .expressItem:last-child {
      &::before {
        width: 0;
      }
    }
  }
}
</style>
