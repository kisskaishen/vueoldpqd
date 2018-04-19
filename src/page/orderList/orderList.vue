<template lang="html">
  <div class="orderList">
    <div class="tab">
      <span :class="[type==0?'active':'']" @click="tabClick(0)">
        全部
      </span>
      <span :class="[type==1?'active':'']" @click="tabClick(1)">
        拼团中
      </span>
      <span :class="[type==2?'active':'']" @click="tabClick(2)">
        待发货
      </span>
      <span :class="[type==3?'active':'']" @click="tabClick(3)">
        待收货
      </span>
      <span :class="[type==4?'active':'']" @click="tabClick(4)">
        待付款
      </span>
      <span :class="[type==5?'active':'']" @click="tabClick(5)">
        已完成
      </span>
      <span :class="[type==6?'active':'']" @click="tabClick(6)">
        售后
      </span>
    </div>
    <ul
      class="orderItems"
      v-infinite-scroll="loadMore"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="600" ref='scroll'>
      <li v-for = "item in orderItems" class="orderItem">
        <p class="store">
          <span>
            <img :src="item.store_info.store_logo" alt="">
            <span>{{item.store_info.store_name}}</span>
            <img src="./images/订单-右箭头.png" alt="">
          </span>
          <span>{{item.order_info.order_state_str}}</span>
        </p>
        <router-link class="goodsInfo" :to="{ name: 'orderDetail', query: {orderId:item.order_info.order_id} }">
          <span>
            <img :src="item.order_info.goods_img" alt="">
          </span>
          <div class="right">
            <div class="top">
              <p>{{item.order_info.goods_name}}</p>
              <div class="">
                <span class="price">¥{{item.order_info.goods_price}}</span>
                <span class="marketPrice">¥{{item.order_info.market_price}}</span>
                <span class="count">x{{item.order_info.num}}</span>
              </div>
            </div>
            <p v-if="item.order_info.show_order_service==1">{{item.order_info.order_service_str}}</p>
          </div>
        </router-link>
        <div class="bottom">
          <p>
            <span>共计{{item.order_info.num}}件商品</span>
            <span>合计
              <span>¥{{item.order_info.order_amount}}</span>元
            </span>
            <span>(含运费¥0.00)</span>
          </p>
          <div class="button">
            <span class="buttonItem" v-if="item.show_operate_icon.show_cancel==1" @click="cancelOrder(item.order_info.order_id)">取消订单</span>
            <router-link class="buttonItem redBlack" v-if="item.show_operate_icon.show_pay==1" :to="{ name: 'orderDetail', query: {orderId:item.order_info.order_id} }">完成支付</router-link>
            <span class="buttonItem" v-if="item.show_operate_icon.show_remind==1" @click="remind(item.order_info.order_id)">提醒发货</span>
            <span class="buttonItem" v-if="item.show_operate_icon.show_delay==1" @click="" @click="delayOrder(item.order_info.order_id)">延长收货</span>
            <router-link class="buttonItem" v-if="item.show_operate_icon.show_delivery==1" :to="{ name: 'deliveryDetail', query: {orderId:item.order_info.order_id} }">查看物流</router-link>
            <span class="buttonItem redBlack" v-if="item.show_operate_icon.show_confirm==1"  @click="sureOrder(item.order_info.order_id)">确认收货</span>
          </div>
        </div>
      </li>
      <loading :loadingCtr="loadingCtr" ></loading>
    </ul>
  </div>
</template>

<script>
import {
  getCookie
} from '../../config/mUtils'
import loading from '../../components/loading/loading.vue'
export default {
  name: 'orderList',
  data() {
    return {
      type: this.$route.query.type || 0, //0 全部 1 拼团中 2 待发货 3 待收货 4 待付款 5 已完成 6 售后
      userId: getCookie('user_id'),
      page: 1,
      totalPage: 2,
      orderItems: [],
      loading: false,
      loadingCtr: true,
    }
  },
  components: {
    loading,
  },
  mounted() {
    console.log(this.$route.query.type)
    this.type = this.$route.query.type || 0
    console.log(this.type)
    this.tabClick(this.type)

  },
  methods: {
    getList() {
      this.http('get', 'user/order_list', {
        user_id: this.userId,
        type: this.type,
        page: this.page,
        pagesize: 10
      }, (data) => {
        this.orderItems = this.orderItems.concat(data.result.items)
        this.page = parseInt(data.result.currentpage) + 1
        this.totalPage = data.result.totalpage
        this.loading = false
        if (data.result.nextpage <= 1) {
          this.loadingCtr = false
        } else {
          this.loadingCtr = true
        }
      })
    },
    tabClick(index) {
      this.type = index
      this.orderItems = []
      this.page = 1
      this.totalPage = 2
      this.getList()
    },
    loadMore() {
      this.loading = true
      if (this.page <= this.totalPage) {
        this.getList()
      } else {
        this.loadingCtr = false;
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
          this.orderItems = []
          this.page = 1
          this.totalPage = 2
          this.getList()
        } else {
          this.Toast(data.msg)
        }
      })
    },
    remind(orderId){//提醒发货
      this.http('get','user/order_remind',{
        user_id: this.userId,
        order_id: orderId
      },(data) => {
        if(data.status==1){
          this.Toast(data.result)
        }else{
          this.Toast(data.msg)
        }
      })
    },
    delayOrder(orderId){//延长收货
      this.http('get','user/getIncreaseGoodsTime',{
        user_id:this.userId,
        order_id:orderId
      },(data) => {
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
          this.orderItems = []
          this.page = 1
          this.totalPage = 2
          this.getList()
        } else {
          this.Toast(data.msg)
        }
      })
    },

  }
}
</script>

<style lang="scss">
.orderList {
    height: 0.74rem;
    width: 7.5rem;
    background-color: #fff;
    .tab {
        display: flex;
        justify-content: space-between;
        height: 100%;
        margin-bottom: 0.15rem;
        span {
            flex: 1;
            text-align: center;
            line-height: 0.74rem;

            font-size: 0.26rem;
            color: #282828;
        }
        .active {
            color: #F81028;
            position: relative;
            &::after {
                position: absolute;
                content: '';
                height: 0.04rem;
                width: 0.8rem;
                background-color: #F81028;
                bottom: 0;
                left: calc(50% - .4rem);
            }
        }
    }
    .orderItems {
        .orderItem {
            height: 3.9rem;
            width: 7.5rem;
            background-color: #fff;
            margin-bottom: 0.15rem;
            .store {
                height: 0.6rem;
                width: 7.5rem;
                background-color: #fff;
                display: flex;
                justify-content: space-between;
                padding: 0 0.38rem 0 0.3rem;
                align-items: center;
                > span:first-child {
                    display: flex;
                    align-items: center;
                    img:first-child {
                        height: 0.3rem;
                        width: 0.3rem;
                    }
                    img:last-child {
                        height: 0.18rem;
                    }
                    span {
                        font-size: 0.25rem;
                        color: #363636;
                        margin: 0 0.15rem;
                    }
                }
                > span:last-child {
                    font-size: 0.25rem;
                    color: #DD1B1B;
                    font-weight: bold;
                }
            }
            .goodsInfo {
                height: 1.76rem;
                background-color: #f8f8f8;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0.2rem 0.35rem 0.2rem 0.2rem;
                > span:first-child {
                    height: 1.38rem;
                    width: 1.38rem;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    overflow: hidden;
                    margin-right: 0.2rem;
                    img {
                        width: 100%;
                    }
                }
                .right {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    height: 100%;
                    width: 5.4rem;
                    .top {
                        display: flex;
                        justify-content: space-between;
                        p {
                            width: 4rem;
                            height: 0.5rem;
                            font-size: 0.23rem;
                            color: #363636;
                        }
                        > div {
                            display: flex;
                            flex-direction: column;
                            align-items: flex-end;
                            span {
                                width: 1.2rem;
                                overflow: hidden;
                                display: flex;
                                justify-content: flex-end;

                            }
                            .price {
                                font-size: 0.3rem;
                                color: #DD1B1B;
                                font-weight: bold;
                            }
                            .marketPrice {
                                font-size: 0.26rem;
                                color: #838383;
                                text-decoration: line-through;
                            }
                            .count {
                                font-size: 0.2rem;
                                color: #838383;
                            }
                        }
                    }
                    > p {
                        display: flex;
                        justify-content: flex-end;
                        font-size: 0.24rem;
                        color: #DD1B1B;
                    }
                }
            }
            .bottom {
                padding: 0 0.2rem;
                p {
                    height: 0.66rem;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    padding-right: 0.15rem;
                    > span {
                        font-size: 0.24rem;
                        color: #363636;
                        margin-left: 0.2rem;
                        display: flex;
                        align-items: center;
                        span {
                            font-size: 0.26rem;
                            color: #DD1B1B;
                        }
                    }
                }
                .button {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    height: 0.86rem;
                    border-top: 0.01rem solid #EFEFEF;
                    padding-right: 0.15rem;
                    .buttonItem {
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
            }
        }
    }
}
</style>
