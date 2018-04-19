<template>
    <div id="coupon" >
      <div class="tab">
        <span :class="tab=='platformCoupon'?'tabActive':''" @touchstart="tab='platformCoupon';couponItem=[];type=1;page='';totalPage='';percentages=[];getCouponList();">
          平台优惠券
        </span>
        <span :class="tab=='storeCoupon'?'tabActive':''" @touchstart="tab='storeCoupon';couponItem=[];type=2;page='';totalPage='';percentages=[];getCouponList()">
          商家优惠券
        </span>
      </div>
      <p v-if="couponItem.length==0" class="nullCoupon">暂无优惠券</p>
      <div class="couponItems" >
        <div class="couponItem" v-for="(item,index) in couponItem" @click='goStoreDetail(item.store_id)'>
          <div class="couponItemTop">
            <div class="storeInfo">
              <span class="storeLogo">
                <img :src="item.store_info.store_logo" alt="">
              </span>
              <span class="ellipsis">{{item.store_info.store_name}}</span>
            </div>
            <div class="couponInfo">
              <div class="couponInfoTop">
                <div class="couponInfoTopLeft">
                  <p class="couponTitle">{{item.name}}</p>
                  <p class="unclaimedColor" v-if="item.coupon_type==1">
                    <span>￥</span><span class="count">{{item.money}}</span>
                  </p>
                  <p  v-else-if="item.coupon_type==2">
                    <span>￥</span><span class="count">{{item.money}}</span>
                  </p>
                  <p class="finishedColor" v-else>
                    <span>￥</span><span class="count">{{item.money}}</span>
                  </p>
                </div>
                <div class="couponInfoTopRight">
                  <vm-progress v-if="item.coupon_type==1" type="circle" :percentage="item.percent" :width="0.9*fontSize" :stroke-color="'#105cf6'" :track-color="'#f6f6f6'" :stroke-width="0.1*fontSize">{{item.percent}}%</vm-progress>
                  <vm-progress v-if="item.coupon_type==2" type="circle" :percentage="item.percent" :width="0.9*fontSize" :stroke-color="'#F61027'" :track-color="'#f6f6f6'" :stroke-width="0.1*fontSize">{{item.percent}}%</vm-progress>
                  <vm-progress v-if="item.coupon_type==3" type="circle" :percentage="item.percent" :width="0.9*fontSize" :stroke-color="'#F69D10'" :track-color="'#f6f6f6'" :stroke-width="0.1*fontSize">{{item.percent}}%</vm-progress>
                  <vm-progress v-if="item.coupon_type==4" type="circle" :percentage="item.percent" :width="0.9*fontSize" :stroke-color="'#F69D10'" :track-color="'#f6f6f6'" :stroke-width="0.1*fontSize">{{item.percent}}%</vm-progress>
                  <vm-progress v-if="item.coupon_type==5" type="circle" :percentage="item.percent" :width="0.9*fontSize" :stroke-color="'#F69D10'" :track-color="'#f6f6f6'" :stroke-width="0.1*fontSize">{{item.percent}}%</vm-progress>
                </div>
              </div>
              <span></span>
              <div class="couponInfoBottom">
                <div class="couponRules">
                    <span>- 可叠加使用</span>
                    <span>- 满{{item.condition}}可用</span>
                </div>
                <countDown v-if="item.coupon_type==1" :index="index" :timeLeft="item.left_time" @countDownOut="listenCountDown"></countDown>
                <button v-if="item.coupon_type==2" @click.stop="getReceiveCoupon(item.id,index)">领取</button>
                <button class="finished" v-if="item.coupon_type==3">已领取</button>
                <button class="finished" v-if="item.coupon_type==4">已结束</button>
                <button class="finished" v-if="item.coupon_type==5">已抢光</button>
              </div>
            </div>
          </div>
          <div class="couponItemBottom">
            <span>活动有效期至{{item.end_day}}</span>
            <span v-if='type==1'>如使用多账号套券将取消资格</span>
            <span v-else>每个用户仅限领取一次</span>
          </div>
        </div>
        <div class="loadingMore" v-if="loadingMoreCtr&&page<=totalPage">
          <img src="../../assets/images/loading@2x.png" alt="" >
        </div>
      </div>
    </div>
</template>

<script>
  import {getCookie} from '../../config/mUtils'
  import countDown from './child/countDown.vue'
  import {myToast} from '../../assets/js/toast'
  import index from "../../router/index";
    export default {
      name:'coupon',
        data() {
            return {
              tab:'platformCoupon',
              fontSize:parseInt(document.documentElement.style.fontSize.split('px')[0]),
              percent:0,
              type:1,/* 1 平台优惠券  2 商家优惠券*/
              userId:getCookie('user_id'),
              page:'',
              totalPage:'',
              couponItem:[],
              loadingMoreCtr:false,
              scrollEnabled:true,
              terminal:getCookie('terminal'),
              rem:document.querySelector('html').style.fontSize,
              terminal:getCookie('terminal')
            }
        },
        mounted() {
        let self_=this;
        this.getCouponList();
          document.querySelector('body').onscroll=function (event) {
          self_.loadingMore(event)
          }
        },
      components: {
        'countDown': countDown,
      },
        methods: {
        listenCountDown:function (val) {
          console.log(1);
          console.log(val);
          this.couponItem[val].coupon_type = 2

        },
        goStoreDetail:function(store_id){
          if(this.terminal=='a'){
            if(this.type==2){
              // alert('跳转店铺' + store_id)
              window.webview.showStoreDetails(store_id)
            }else{
            window.webview.getHome()
            }
          }else if(this.terminal=='i'){
            if(this.type==2){
              window.showStoreDetails(store_id)
            }else{
              window.getHome()
            }
          }else {
            if(this.type==2){
              location.href='../shop_detail.html?store_id='+store_id
            }else{
              location.href = '../index.html'
            }
          }

        },
          getCouponList:function () {//获取优惠券列表
            this.loadingMoreCtr = true;
            let self_=this
            this.http('get','coupon/couponList',{
              type:self_.type,
              page:self_.page,
              user_id:self_.userId
            },function (data) {
              self_.scrollEnabled = true
              self_.loadingMoreCtr = false
              self_.page = data.page + 1
              self_.totalPage = data.totalPage
              self_.couponItem=self_.couponItem.concat(data.items)

            })
          },
          getReceiveCoupon:function (id,index) {
            let self_ = this
            this.http('get','User/getReceiveCoupon',{
              user_id:self_.userId,
              coupon_id:id,
              type:self_.type
            },function (data) {
              myToast(data.msg)
              self_.couponItem[index].coupon_type = 3;
            })
          },
          loadingMore:function (event) {//加载更多
            this.loadingMoreCtr = true;
            if(parseInt(document.querySelectorAll('.couponItem')[this.couponItem.length - 1].getBoundingClientRect().bottom) < parseInt(document.querySelector('body').clientHeight) + 2 * parseInt(this.rem)&&this.scrollEnabled&&this.totalPage>=this.page){
              this.scrollEnabled = false
              this.getCouponList();
            }
          },
        },
    }
</script>

<style lang='scss' scoped>
  @import "../../style/common";
#coupon {
  display: flex;
  flex-direction: column;
  .tab {
    display: flex;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    z-index: 999999999999;
    span {
      height: .8rem;
      width: 50%;
      text-align: center;
      line-height:.8rem;
      background-color: #fff;
      font-size: .28rem;
      border-bottom: .03rem solid #fff;
    }
    .tabActive {
      color: #F61027;
      border-bottom: .03rem solid #F61027;
    }
  }
  .nullCoupon {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 2rem;
    color: #aaa;
    font-size: .24rem;

  }
  .couponItems {
    margin-top:.8rem;
    padding: 0 .2rem;
    /*flex: 1;*/
    /*overflow: scroll;*/
    -webkit-overflow-scrolling: touch;
    .couponItem {
      margin-top:.3rem;
      height: 2.8rem;
      background-color: #fbfbfb;
      border-radius: .14rem;
      .couponItemTop {
        height: 2.2rem;
        background-color: #fff;
        border-radius: .14rem;
        display: flex;
        .storeInfo {
          display: flex;
          flex-direction: column;
          padding: .3rem 0;
          border-right: 1px dashed #eee;
          align-items: center;
          justify-content: space-between;
          width: 1.84rem;
          span {
            text-align: center;
            width: 1.5rem;
            font-size: .26rem;
            color: #333;
          }
          .storeLogo {
            height: 1rem;
            width: 1rem;
            border-radius: 1rem;
            overflow: hidden;
            img {
              width: 100%;
              height: 100%;
            }
          }
        }
        .couponInfo {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding:.3rem .4rem .1rem .3rem ;
          /*width: 100%;*/
          flex: 1;
          .couponInfoTop {
            display: flex;
            justify-content: space-between;
            height: 1rem;
            .couponInfoTopLeft {
              .couponTitle {
                font-weight: 600;
                color: #333;
                font-size: .3rem;
              }
              p {
                span {
                  color: #F61027;
                  font-size: .24rem;
                }
                .count {
                  font-size: .6rem;
                  line-height:.6rem;
                }
              }
              .unclaimedColor {
                span {
                  color: #105cf6;
                }
              }
              .finishedColor {
                span {
                  color: #f69d10;
                }
              }
            }
            .couponInfoTopRight {
              padding-right:.15rem;
            }
          }
          .couponInfoBottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .couponRules {
              display: flex;
              flex-direction: column;
              span {
                font-size: .24rem;
                color: #ccc;
                font-family: "Microsoft Yahei";
              }
            }
            button {
              margin-top:.01rem;
              width: 1.2rem;
              text-align: center;
              height: .5rem;
              line-height: .5rem;
              background-color: #F61027;
              border-radius: .25rem;
              font-size: .24rem;
              color: #fff;
            }
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
              }
            }
            .finished {
              background-color: #f69d10;
            }
          }
        }
      }
      .couponItemBottom {
        height:.6rem;
        padding: 0 .2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span {
          font-size: .24rem;
          color: #ccc;
          font-weight: 100;
          font-family: "Microsoft Yahei";
        }
      }
    }
  }
  .loadingMore {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 1rem;
    padding-top:.2rem;
    img {
      height: .4rem;
      width: .4rem;
      animation: rotation 1s linear infinite reverse;
    }
    @keyframes rotation {
      0%   { transform: rotate(360deg); }
      100% { transform: rotate(0deg); }
    }
    span {
      color: #ccc;
      font-size: .24rem;
    }
  }
}
</style>
