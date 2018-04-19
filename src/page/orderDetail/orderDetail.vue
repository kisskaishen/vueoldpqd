<template lang="html">
  <div id="orderDetail">
    <div class="header">
      <span>
        <span>{{orderInfo.order_info.order_state_str}}</span>
        <span class="countDown" v-if="countDown.day>0">还剩{{countDown.day}}天{{countDown.hour}}小时自动确认收货</span>
        <span class="countDown" v-else>还剩{{countDown.hour}}小时{{countDown.minutes}}小时{{countDown.second}}秒自动确认收货</span>
      </span>
      <img src="./images/钱包.png" alt="">
    </div>
    <div class="address">
      <img src="./images/椭圆4.png" alt="">
      <div class="addressInfo">
        <p>
          <span>收货人：{{orderInfo.order_info.consignee}}</span>
          <span>{{orderInfo.order_info.mobile}}</span>
        </p>
        <p>
          <span>收货地址：</span>
          <span>{{orderInfo.order_info.address_base}}{{orderInfo.order_info.address}}</span>
        </p>
      </div>
    </div>
    <div class="goodsInfo">
      <p class="storeInfo">
        <span>
          <img :src="orderInfo.store_info.store_logo" alt="">
          <span>{{orderInfo.store_info.store_name}}</span>
          <img src="./images/订单-右箭头.png" alt="">
        </span>
        <span>{{orderInfo.order_info.order_state_str}}</span>
      </p>
      <div class="goods">
        <span>
          <img :src="orderInfo.order_info.goods_img" alt="">
        </span>
        <div class="goodsRight">
          <span>{{orderInfo.order_info.goods_name}}</span>
          <span>
            <span class="price">¥{{orderInfo.order_info.goods_price}}</span>
            <span class="marketPrice">¥{{orderInfo.order_info.market_price}}</span>
            <span class="count">x{{orderInfo.order_info.goods_num}}</span>
          </span>
        </div>
      </div>
      <div class="orderBottom">
        <p>
          <span>
            实付：¥<span>{{orderInfo.order_info.order_amount}}</span>(免运费)
          </span>
          <span v-if="orderInfo.order_info.show_order_service==1" @click='linkSelector(orderInfo.order_info.order_service)'>{{orderInfo.order_info.order_service_str}}</span>
        </p>
        <p>
          <router-link :to="{ name: 'chat', query: {storeId:orderInfo.store_info.store_id} }">
            <img src="./images/联系客服.png" alt="">
            联系客服
          </router-link>
          <a :href="'tel:'+orderInfo.store_info.mobile" >
            <img src="./images/拨打电话.png" alt="">
            拨打电话
          </a>
        </p>
      </div>
    </div>

    <div class="payMethods" v-if="orderInfo.show_operate_icon.show_pay==1">
      <p v-if="env==1" @click="payMethods=1">
        <span>
          <img src="./images/img_weixin@2x.png" alt="" >
          <span>微信支付</span>
        </span>
        <span>
          <span :class="[payMethods==1?'active':'']"></span>
        </span>
      </p>
      <p v-if="env==2" @click="payMethods=2">
        <span>
          <img src="./images/qqpay.png" alt="" >
          <span>QQ支付</span>
        </span>
        <span>
          <span :class="[payMethods==2?'active':'']"></span>
        </span>
      </p>
      <p v-if="env==2" @click="payMethods=3">
        <span>
          <img src="./images/icon_pay_zfb.png" alt="">
          <span>支付宝支付</span>
        </span>
        <span>
          <span :class="[payMethods==3?'active':'']"></span>
        </span>
      </p>
    </div>
    <a :href="'../prom_regiment.html?prom_id='+orderInfo.group_info.prom_id" class="prom" v-if="orderInfo.group_info.head_pic">
      <span>
        <img src="./images/拼团.png" alt="">
        <img class="headerPic" :src="orderInfo.group_info.head_pic" alt="">
        <span>?</span>
      </span>
      <span>拼团详情</span>
    </a>
    <div class="orderMsg" >
      <div class="">
        <span>
          订单编号：{{orderInfo.order_info.order_sn}}
        </span>
        <span>
          支付方式：{{orderInfo.order_info.pay_name}}
        </span>
        <span>
          下单时间：{{formatDate(orderInfo.order_info.add_time)}}
        </span>
        <span v-if="orderInfo.order_info.delivery_time">
          发货时间：{{formatDate(orderInfo.order_info.delivery_time)}}
        </span>
        <span v-if="orderInfo.order_info.confirm_time">
          收货时间：{{formatDate(orderInfo.order_info.confirm_time)}}
        </span>
      </div>
    </div>
    <div class="footer" v-if="orderInfo.show_operate_icon.show_cancel==1||orderInfo.show_operate_icon.show_pay==1||orderInfo.show_operate_icon.show_remind==1||orderInfo.show_operate_icon.show_delay==1||orderInfo.show_operate_icon.show_delivery==1||orderInfo.show_operate_icon.show_confirm==1">
      <span class="button" v-if="orderInfo.show_operate_icon.show_cancel==1" @click="cancelOrder(orderId)">取消订单</span>
      <span  v-if="orderInfo.show_operate_icon.show_pay==1" class="redBlack button" @click="finishOrder(orderId)">完成支付</span>
      <span class="button" v-if="orderInfo.show_operate_icon.show_remind==1" @click="remind(orderId)">提醒发货</span>
      <span class="button" v-if="orderInfo.show_operate_icon.show_delay==1" @click="delayOrder(orderId)">延长收货</span>
      <router-link class="button" :to="{ name: 'deliveryDetail', query: {orderId:orderId,type:1} }" v-if="orderInfo.show_operate_icon.show_delivery==1">
        查看物流
      </router-link>
      <span v-if="orderInfo.show_operate_icon.show_confirm==1" class="redBlack button" @click="sureOrder(orderId)">确认收货</span>
    </div>
    <mt-popup
      v-model="popupVisible">
      <p>是否收到货物？</p>
      <p>
        <router-link :to="{name:'addRefund',query:{orderId:this.orderId,type:1}}">
          已收到货
        </router-link>
        <router-link :to="{name:'addRefund',query:{orderId:this.orderId,type:2}}">
          未收到货
        </router-link>
      </p>
    </mt-popup>
  </div>
</template>

<script>
import {
  getCookie
} from '../../config/mUtils'
import $ from 'jquery'
export default {
  name: 'orderDetail',
  data() {
    return {
      userId: getCookie('user_id'),
      orderId: this.$route.query.orderId,
      orderInfo: {},
      countDown: {},
      countDownTime: 0,
      popupVisible: false,
      env:1,//1 微信 2 qq
      payMethods:1,//1 微信支付 2 qq支付 3 支付宝支付
    }
  },
  mounted() {
    this.isEnv()
    this.getOrderinfo()
    console.log(document.querySelector('body'))
  },
  methods: {
    isEnv(){
      let u = navigator.userAgent.toLowerCase();
      if (u.indexOf('qq/') != -1) {
        this.env = 2
        this.payMethods = 2
      } else {
        this.env = 1
        this.payMethods = 1
      }
    },
    getOrderinfo() {
      this.http('get', 'user/order_detail', {
        user_id: this.userId,
        order_id: this.orderId
      }, (data) => {
        // console.log(data)
        this.orderInfo = data.result
        this.countDownTime = data.result.order_info.count_down_time
        setInterval(() => {
          this.countDownTime--;
          this.stringToTime(this.countDownTime--)
        }, 1000)
      })
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
    },
    formatDate(nS) { //转换时间
      return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
    },
    linkSelector(type) {
      if (type == 0) { //跳转申请退换货
        this.popupVisible = true //选择是否收到货
      } else { //跳转售后详情
        this.$router.push({
          name: 'refundDetail',
          query: {
            orderId: this.orderId
          }
        })
      }
    },
    cancelOrder(orderId) { //取消订单
      this.http('get', 'user/order_cancel', {
        user_id: this.userId,
        order_id: orderId
      }, (data) => {
        // console.log(data)
        if (data.status == 1) {
          this.Toast(data.result)
          this.getOrderinfo()
        } else {
          this.Toast(data.msg)
        }
      })
    },
    remind(orderId) { //提醒发货
      this.http('get', 'user/order_remind', {
        user_id: this.userId,
        order_id: orderId
      }, (data) => {
        if (data.status == 1) {
          this.Toast(data.result)
        } else {
          this.Toast(data.msg)
        }
      })
    },
    delayOrder(orderId) { //延长收货
      this.http('get', 'user/getIncreaseGoodsTime', {
        user_id: this.userId,
        order_id: orderId
      }, (data) => {
        this.Toast(data.msg)
      })
    },
    sureOrder(orderId) { //确认收货
      this.http('post', 'user/orderConfirm', {
        user_id: this.userId,
        order_id: orderId
      }, (data) => {
        if (data.status == 1) {
          this.Toast('确认收货成功')
          this.getOrderinfo()
        } else {
          this.Toast(data.msg)
        }
      })
    },
    finishOrder(orderId) { //完成支付
      let code = ''
      switch(this.payMethods){
        case 1:
        code = 'weixin'
        break
        case 2:
        code = 'qpay'
        break
        case 2:
        code = 'alipay_wap'
        break
      }
      this.http('get','goods/getCompleteBuy',{
        order_id:orderId,
        wxv:1,
        openid:getCookie('openid'),
        code:code,
        ajax_get:1,
      },(data) => {
        if(!data.status){
          $('body').append(data)
        }else{
          this.Toast(data.msg)
        }
      })
    }
  }
}
</script>

<style lang="scss">
#orderDetail {
    .header {
        height: 1.65rem;
        width: 100vw;
        background-color: #E02E24;
        display: flex;
        align-items: center;
        padding: 0 0.9rem 0 0.8rem;
        justify-content: space-between;
        span {
            display: flex;
            flex-direction: column;
            span {
                font-size: 0.4rem;
                font-family: "PingFang-SC-Medium";
                font-weight: bolder;
                color: #fff;
            }
            .countDown {
                font-size: 0.22rem;
                font-family: "PingFang-SC-Medium";
                font-weight: bolder;
                color: #fff;
            }
        }

        img {
            height: 1rem;
            width: 1rem;
        }
    }
    .address {
        height: 1.35rem;
        width: 100vw;
        margin-top: 0.05rem;
        background-color: #fff;
        display: flex;
        align-items: center;
        padding: 0.18rem 0.2rem 0.18rem 0.37rem;
        img {
            width: 0.3rem;
            height: 0.37rem;
        }
        .addressInfo {
            height: 100%;
            width: 6.2rem;
            margin-left: 0.4rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            p:first-child {
                padding-right: 0.2rem;
                display: flex;
                justify-content: space-between;
                color: #222;
                span:first-child {
                    font-size: 0.28rem;
                }
                span:last-child {
                    font-size: 0.26rem;
                }
            }
            p:last-child {
                display: flex;
                span {
                    color: #181818;
                    font-size: 0.24rem;
                }
                span:first-child {
                    width: 1.5rem;
                }
            }
        }
    }
    .goodsInfo {
        background-color: #fff;
        margin-top: 0.15rem;
        .storeInfo {
            display: flex;
            height: 0.6rem;
            justify-content: space-between;
            align-items: center;
            padding: 0 0.3rem;
            > span:first-child {
                overflow: hidden;
                display: flex;
                align-items: center;
                img:first-child {
                    width: 0.32rem;
                    border-radius: 0.16rem;
                }
                img:last-child {
                    width: 0.1rem;
                    height: 0.18rem;
                }
                > span {
                    margin: 0 0.14rem;
                    font-size: 0.25rem;
                    color: #363636;
                }
            }
            span:last-child {
                font-size: 0.25rem;
                color: #41D214;
            }
        }
        .goods {
            background-color: #f8f8f8;
            height: 1.76rem;
            padding: 0 0.35rem 0 0.2rem;
            display: flex;
            justify-content: space-between;
            align-items: center;
            > span {
                width: 1.38rem;
                height: 1.38rem;
                margin-right: 0.2rem;
                img {
                    height: 100%;
                }
            }
            .goodsRight {
                height: 100%;
                padding-top: 0.24rem;
                display: flex;
                justify-content: space-between;
                > span:first-child {
                    width: 4rem;
                    height: 0.6rem;
                    line-height: 0.3rem;
                    font-size: 0.23rem;
                    color: #363636;
                    table-layout: fixed;
                    word-break: break-all;
                    overflow: hidden;
                }
                > span:last-child {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    width: 1.2rem;
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    overflow: hidden;
                    height: 100%;
                    .price {
                        font-size: 0.3rem;
                        color: #DD1B1B;
                        font-weight: bold;
                    }
                    .marketPrice {
                        font-size: 0.26rem;
                        color: #838383;
                        text-decoration: line-through;
                        font-weight: bold;
                    }
                    .count {
                        font-size: 0.2rem;
                        color: #838383;
                        margin-top: 0.2rem;
                    }
                }
            }
        }
        .orderBottom {
            background-color: #fff;
            height: 1.83rem;
            p:first-child {
                height: 0.86rem;
                padding: 0 0.26rem 0 0.35rem;
                display: flex;
                justify-content: space-between;
                align-items: center;
                position: relative;
                > span:last-child {
                    height: 0.5rem;
                    border: 0.01rem solid #8c8c8c;
                    border-radius: 0.05rem;
                    padding: 0 0.25rem;
                    font-size: 0.26rem;
                    color: #8c8c8c;
                    line-height: 0.5rem;
                }
                > span:first-child {
                    font-size: 0.25rem;
                    color: #838383;
                    border: none;
                    span {
                        font-size: 0.28rem;
                        color: #DD1B1B;
                        margin: 0 0.1rem;
                    }
                }
                &::after {
                    content: '';
                    position: absolute;
                    width: 7.1rem;
                    height: 0.01rem;
                    background-color: #EFEFEF;
                    bottom: 0;
                    left: 0.2rem;
                }
            }
            p:last-child {
                height: 0.97rem;
                display: flex;
                justify-content: space-between;
                padding: 0.18rem 0;
                a {
                    flex: 1;
                    display: flex;
                    height: 100%;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.27rem;
                    color: #363636;
                    img {
                        height: 0.38rem;
                        margin-right: 0.2rem;
                    }
                }
                a+a {
                    border-left: 0.01rem solid #EFEFEF;
                }
            }
        }
    }
    .prom {
        background-color: #fff;
        height: 0.97rem;
        margin-top: 0.15rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.35rem 0 0.25rem;
        > span:first-child {
            display: flex;
            align-items: center;
            img:first-child {
                height: 0.37rem;
            }
            .headerPic {
                height: 0.47rem;
                width: 0.47rem;
                border: 0.02rem solid #838383;
                border-radius: 50%;
                overflow: hidden;
                margin-left: 0.2rem;
            }
            span {
                height: 0.47rem;
                width: 0.47rem;
                border: 0.02rem dashed #838383;
                border-radius: 50%;
                margin-left: -.1rem;
                background-color: #fff;
                text-align: center;
                line-height: 0.47rem;
                color: #838383;
            }
        }
        > span:last-child {
            height: 0.5rem;
            width: 1.5rem;
            color: #DD1B1B;
            border: 0.01rem solid #DD1B1B;
            border-radius: 0.05rem;
            font-size: 0.26rem;
            text-align: center;
            line-height: 0.5rem;
        }

    }
    .orderMsg {
        padding: 0.3rem;
        display: flex;
        background-color: #fff;
        margin-top: 0.15rem;
        div {
            display: flex;
            flex-direction: column;
            span {
                font-size: 0.24rem;
                color: #626262;
                line-height: 0.4rem;
            }
        }
        > span {
            height: 0.34rem;
            width: 0.71rem;
            text-align: center;
            line-height: 0.34rem;
            border: 0.01rem solid #626262;
            font-size: 0.24rem;
            color: #626262;
            border-radius: 0.1rem;
            margin-left: 0.4rem;
        }
    }
    .payMethods {
      margin: .15rem 0;
      background-color: #fff;
      padding: .1rem .3rem;
      p {
        display: flex;
        justify-content: space-between;
        padding: .1rem 0;
        align-items: center;
        >span:first-child {
          display: flex;
          align-items: center;
          img {
            height: .4rem;
            width: .4rem;
            margin-right: .2rem;
          }
          span {
            font-size: .3rem;
          }
        }
        >span:last-child {
          height: .3rem;
          width: .3rem;
          border-radius: 50%;
          border: .01rem solid #ccc;
          display: flex;
          justify-content: center;
          align-items: center;
          span {
            height: .22rem;
            width: .22rem;
            border-radius: 50%;
          }
          .active {
            background-color: #DD1B1B;
          }
        }
      }
    }
    .footer {
        display: flex;
        justify-content: flex-end;
        padding-right: 0.45rem;
        height: 1rem;
        align-items: center;
        position: fixed;
        bottom: 0;
        left: 0;
        width: 7.5rem;
        background-color: #fff;
        .button {
            height: 0.5rem;
            padding: 0 0.24rem;
            font-size: 0.26rem;
            color: #DD1B1B;
            border: 0.01rem solid #DD1B1B;
            margin-left: 0.3rem;
            border-radius: 0.05rem;
            line-height: 0.5rem;
        }
        .redBlack {
            background-color: #DD1B1B;
            color: #fff;
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
