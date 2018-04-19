<template lang="html">
  <div class="refundDetail">
    <div class="header">
      <p>{{orderServiceStatus.service_title}}</p>
      <div class="refundTime" v-if='orderServiceStatus.count_down_time'>
        <p>退款时间:</span>
        <p>
          剩余
          <span v-if="countDown.day">
            <span>{{countDown.day}}</span>天
          </span>
          <span>
            <span>{{countDown.hour}}</span>时
          </span>
          <span>
            <span>{{countDown.minutes}}</span>分
          </span>
          <span>
            <span>{{countDown.second}}</span>秒
          </span>
        </p>
        <p>{{orderServiceStatus.service_descript}}</p>
      </div>
      <div class="address" v-if='orderServiceStatus.store_shipping_address'>
        <p>退货地址:</p>
        <p>
          {{orderServiceStatus.store_shipping_address.store_consignee}}（{{orderServiceStatus.store_shipping_address.store_mobile}}）
        </p>
        <p>
          {{orderServiceStatus.store_shipping_address.store_address_base}}{{orderServiceStatus.store_shipping_address.store_address_base}}
        </p>
      </div>
      <div class="button">
        <button type="button" name="button" v-if="orderServiceStatus.show_cancel_service_apply=='1'" @click="cancelAfter()">取消申请</button>
        <router-link :to="{ name: 'userSend', query: {orderId:orderId,orderSn:orderServiceInfo.order_service_sn} }" v-if="orderServiceStatus.show_order_service_delivery=='1'">
          我要发货
        </router-link>
        <router-link :to="{ name: 'deliveryDetail', query: {orderId:orderId,type:2} }" v-if="orderServiceStatus.show_service_delivery_detail==1">
          查看物流
        </router-link>
        <button type="button" name="button" v-if="orderServiceStatus.show_order_service=='1'" @click="popupVisible=true">再次申请</button>
        <router-link :to="{ name: 'addNegotiation', query: {orderId:orderId} }" v-if="orderServiceStatus.show_order_appeal=='1'">
          申请平台介入
        </router-link>
        <router-link :to="{ name: 'moneyGo', query: {orderId:orderId} }" v-if="orderServiceStatus.show_where_money=='1'">
          钱款去向
        </router-link>
      </div>
    </div>
    <router-link class="" :to="{ name: 'Negotiation', query: {orderId:this.orderId} }">
      <span>协商记录</span>
      <img src="./images/右箭头-退货.png" alt="">
    </router-link>
    <div class="refundInfo">
      <p>退款信息</p>
      <router-link class="refundItem goodsName" :to="{ name: '', query: {} }" >
        <span>
          店铺名称
          <span>{{storeInfo.store_name}}</span>
        </span>
        <img src="./images/右箭头-退货.png" alt="">
      </router-link>
      <div class="refundItem">
        <span>商品名称</span>
        <p>{{orderServiceInfo.goods_name}}</p>
      </div>
      <div class="refundItem">
        <span>退款类型</span>
        <p>{{orderServiceInfo.service_type}}</p>
      </div>
      <div class="refundItem">
        <span>退款金额</span>
        <p>{{orderServiceInfo.return_money}}</p>
      </div>
      <div class="refundItem">
        <span>退款原因</span>
        <p>{{orderServiceInfo.reason}}</p>
      </div>
      <div class="refundItem">
        <span>退款说明</span>
        <p>{{orderServiceInfo.description}}</p>
      </div>
      <div class="refundItem imgs">
        <p>上传图片</span>
        <div >
          <img :src="item" alt="" v-for="item in orderServiceInfo.proof_imgs">
        </div>
      </div>
      <div class="refundItem">
        <span>申请时间</span>
        <p>{{formatDate(orderServiceInfo.order_apply_time)}}</p>
      </div>
      <div class="refundItem">
        <span>退款单号</span>
        <p>{{orderServiceInfo.order_sn}}</p>
      </div>
    </div>
    <mt-popup
      v-model="popupVisible">
      <p>是否收到货物？</p>
      <p>
        <!--<router-link :to="{name:'addRefund',query:{orderId:this.orderId,type:1}}">-->
          <a :href="'https://wx.pinquduo.cn/after_sales_apply.html?order_id='+orderId+'&goods_name='+orderServiceInfo.goods_name+'&goods_img='+orderServiceInfo.goods_img+'&order_amount='+orderServiceInfo.order_amount+'&isget=1'">
              已收到货
          </a>
        <!--</router-link>-->
        <!--<router-link :to="{name:'addRefund',query:{orderId:this.orderId,type:2}}">-->
          <a :href="'https://wx.pinquduo.cn/after_sales_apply.html?order_id='+orderId+'&goods_name='+orderServiceInfo.goods_name+'&goods_img='+orderServiceInfo.goods_img+'&order_amount='+orderServiceInfo.order_amount+'&isget=0'">
              未收到货
          </a>
        <!--</router-link>-->
      </p>
    </mt-popup>
  </div>
</template>

<script>
import {getCookie} from '../../config/mUtils'

export default {
  name:'refundDetail',
  data(){
    return{
      userId:getCookie('user_id'),
      orderId:this.$route.query.orderId,
      orderServiceInfo:{},
      groupInfo:{},
      orderServiceStatus:{},
      storeInfo:{},
      countDown:{
        day:'00',
        hour:'00',
        minutes:'00',
        second:'00'
      },
      popupVisible: false,
    }
  },
  mounted(){
    this.getRefundDetail()
  },
  methods:{
    getRefundDetail(){
      this.http('get','user/order_service_detail',{
        user_id:this.userId,
        order_id:this.orderId
      },(data) => {
        console.log(data);
        this.groupInfo = data.result.group_info
        this.orderServiceInfo = data.result.order_service_info
        this.orderServiceStatus = data.result.order_service_status
        this.storeInfo = data.result.store_info
        let countDownTime = data.result.order_service_status.count_down_time||0
        setInterval(() => {
          countDownTime--;

          this.stringToTime(countDownTime)
        },1000)
      })
    },
    formatDate(nS){//转换时间
      return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    },
    stringToTime(string) {
      if (string >= 86400) { //天
        this.countDown.day = parseInt(string / 86400)
      } else {
        this.countDown.day = 0
      }
      let temphour = string % 86400
      if (temphour >= 3600) { //时
        this.countDown.hour = parseInt(temphour / 3600) > 9 ? parseInt(temphour / 3600) : '0' + parseInt(temphour / 3600)
      } else {
        this.countDown.hour = '00'
      }
      let tempMin = string % 3600
      if (tempMin >= 60) { //分
        this.countDown.minutes = parseInt(tempMin / 60) > 9 ? parseInt(tempMin / 60) : '0' + parseInt(tempMin / 60)
      } else {
        this.countDown.minutes = '00'
      }
      this.countDown.second = string % 60 > 9 ? string % 60 : '0' + string % 60
      console.log(this.countDown)
    },
    cancelAfter(){//取消申诉/售后
      this.http('get','user/cancel_service_apply',{
        user_id:this.userId,
        order_id:this.orderId
      },(data) => {
        if(data.status==1){
           let r = confirm('取消退货/退款后，您将无法再次进行退款/退货申请，请确认是否取消')
            if (r) {
                this.Toast(data.result)
                this.getRefundDetail()
            } else {

            }

        }else{
          this.Toast(data.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.refundDetail {
  .header {
    padding: .5rem .5rem .4rem .5rem;
    background-color: #DD1B1B;
    >p {
      font-size: .4rem;
      font-weight: bold;
      color: #fff;
      text-align: center;
      font-family: 'PingFang-SC-Medium';
    }
    >div {
      margin-top: .5rem;
      >p {
        font-size: .22rem;
        color: #fff;
        font-weight: bold;
        font-family: 'PingFang-SC-Medium';
        display: flex;
        span {
          font-size: .22rem;
          color: #fff;
          font-weight: bold;
          font-family: 'PingFang-SC-Medium';
          display: flex;
          span {
            height: .36rem;
            width: .36rem;
            border-radius: .05rem;
            background-color: #fff;
            font-size: .26rem;
            color: #DD1B1B;
            display: flex;
            justify-content: center;
            align-items: center;
            margin: 0 .05rem;
          }
        }
      }
    }
    .button {
      display: flex;
      justify-content: center;

      // padding: 0 1.3rem;
      a,button{
        height: .65rem;
        background-color: #fff;
        border-radius: .1rem;
        color: #DD1B1B;
        padding: 0 .3rem;
        font-size: .24rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        margin: 0 .7rem;
      }
    }
  }
  >a {
    height: 1rem;
    width: 7.5rem;
    padding: 0 .5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #fff;
    margin: .15rem 0;
    span {
      font-size: .3rem;
      color: #313131;
    }
    img {
      height: .26rem;
    }
  }
  .refundInfo {
    background-color: #fff;
    padding: .35rem .2rem 0 .2rem;

    >p {
      font-size: .36rem;
      color: #313131;
      padding-bottom: .2rem;
      font-weight: bold;
      padding-left: .3rem;
    }
    .refundItem {
      padding: .4rem .3rem;
      display: flex;
      justify-content: space-between;
      // align-items: center;
      >span {
        font-size: .3rem;
        color: #313131;
      }
      >p {
        width: 4.94rem;
        font-size: .26rem;
        color: #6A6A6A;
      }

    }
    .goodsName {
      align-items: center;
      >img {
        height: .26rem;
      }
      >span {
        font-size: .3rem;
        color: #313131;
        >span {
          font-size: .26rem;
          color: #393939;
          margin-left: .2rem;
        }
      }
    }
    .imgs {
      flex-direction: column;
      >div {
        width: 100%;
        margin: .32rem 0;
        img {
          height: 1.3rem;
          width: 1.3rem;
          margin-right: .08rem;
        }
      }

    }
    .refundItem+.refundItem{
      border-top: .01rem solid #EFEFEF;
    }
  }
  .mint-popup {
      width: 5rem;
      height: 3rem;
      border-radius: 0.1rem;
      p:first-child {
          height: 2rem;
          text-align: center;
          line-height: 2rem;
          color: #b2b2b2;
      }
      p:last-child {
          display: flex;
          box-sizing: border-box;
          border-top: 0.02rem solid #f8f8f8;
          a {
              flex: 1;
              height: 1rem;
              line-height: 1rem;
              text-align: center;
              box-sizing: border-box;
          }
          a+a {
              position: relative;
              &::before {
                  content: '';
                  position: absolute;
                  left: 0;
                  top: 0;
                  height: calc(100% - .02rem);
                  width: 0.02rem;
                  background-color: #f8f8f8;
              }
          }
          a:first-child {
              color: #b2b2b2;
          }
          a:last-child {
              color: #E02E24;

          }
      }
  }
}
</style>
