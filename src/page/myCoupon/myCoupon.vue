<template>
  <div id="myCoupon" ref="content">
    <div v-if="from!='toPay'" class="tab">
        <span :class="tab=='unused'?'tabActive':''" @touchstart="tab='unused';state=0;couponItem=[];page=1;totalPage=1;getCouponList()">
          未使用
        </span>
      <span :class="tab=='disabled'?'tabActive':''" @touchstart="tab='disabled';state=1;couponItem=[];page=1;totalPage=1;getCouponList()">
          已使用/已过期
        </span>
    </div>
    <div class="couponItems" :style="{marginTop:marginTop}">
      <!--付款页面优惠券-->
      <div v-if="from=='toPay'" class="couponItem" v-for="(item,index) in couponItem" @click="!(query.conditionMoney - item.condition>=0 && query.money - item.money>=0)?'':goGoodsDetail(item.id,item.coupon_type)">
        <div class="couponItemTop">
          <div class="couponMsg">
              <div class="price">
                <span  :class="['dollar',!(query.conditionMoney - item.condition>=0 && query.money - item.money>=0)?'grayColor':'']">￥</span><span :class="['couponMoney',!(query.conditionMoney - item.condition>=0 && query.money - item.money>=0)?'grayColor':'']">{{item.money.indexOf('.00')==-1?item.money:parseInt(item.money)}}</span>
              </div>
              <div :class="[!(query.conditionMoney - item.condition>=0 && query.money - item.money>=0)?'grayColor':'']">
                满{{parseInt(item.condition)}}可用
              </div>
          </div>
          <div class="couponInfo">
            <div class="couponInfoLeft">
              <div  :class="['couponTitle',!(query.conditionMoney - item.condition>=0 && query.money - item.money>=0)?'grayColor':'']">
                {{item.name}}
              </div>
              <div class="couponRules">
                <p>- 有效期至{{toDate(item.use_end_time)}}</p>
                <p>- 可叠加</p>
              </div>
            </div>
            <div class="couponInfoRight">
              <img :src="item.store_logo" alt="" v-if="from=='toPay'" :class="[!(query.conditionMoney - item.condition>=0 && query.money - item.money>=0)?'gray':'']">
              <span :class="[!(query.conditionMoney - item.condition>=0 && query.money - item.money>=0)?'grayColor':'']" v-if="item.use_end_time-new Date()/1000>86400&&state==0">剩余：{{lessTime(item.use_end_time-(new Date())/1000)}}天</span>
              <countDown v-if="item.use_end_time-new Date()/1000<86400&&state==0" :timeLeft="parseInt(item.use_end_time-(new Date())/1000)" :class="[!(query.conditionMoney - item.condition>=0 && query.money - item.money>=0)?'grayColor':'']"></countDown>
            </div>
          </div>
        </div>
        <div class="couponItemBottom">
          <span>用户：{{decodeURI(userName)}}</span>
          <span>限在{{item.store_name}}使用</span>
        </div>
      </div>
      <!--个人中心优惠券-->
      <div v-if="from!='toPay'" class="couponItem" v-for="(item,index) in couponItem" >
        <div class="couponItemTop">
          <div class="couponMsg">
              <div class="price">
                <span  :class="['dollar',(state==0)?'':'grayColor']">￥</span><span :class="['couponMoney',(state==0)?'':'grayColor']">{{item.money.indexOf('.00')==-1?item.money:parseInt(item.money)}}</span>
              </div>
              <div :class="[(state==0)?'':'grayColor']">
                满{{parseInt(item.condition)}}可用
              </div>
          </div>
          <div class="couponInfo">
            <div class="couponInfoLeft">
              <div  :class="['couponTitle',(state==0)?'':'grayColor']">
                {{item.name}}
              </div>
              <div class="couponRules">
                <p>- 有效期至{{toDate(item.use_end_time)}}</p>
                <p>- 可叠加</p>
              </div>
            </div>
            <div class="couponInfoRight">
              <button v-if="state==0&&from!='toPay'" @click="linkTo(item.store_id)">立即使用</button>
              <button style="background-color:#ccc;" v-if="state==1&&item.is_use==0">已到期</button>
              <button style="background-color:#ccc;" v-if="state==1&&item.is_use==1">已使用</button>
              <span v-if="item.use_end_time-new Date()/1000>86400&&state==0">剩余：{{lessTime(item.use_end_time-(new Date())/1000)}}天</span>
              <countDown v-if="item.use_end_time-new Date()/1000<86400&&state==0" :timeLeft="parseInt(item.use_end_time-(new Date())/1000)" :class="[(state==0&&(query.price-item.condition>=0))?'':'grayColor']"></countDown>
              <span class="grayColor" v-if="state==1&&item.is_use==0">已到期</span>
              <span class="grayColor" v-if="state==1&&item.is_use==1">已使用</span>
            </div>
          </div>
        </div>
        <div class="couponItemBottom">
          <span>用户：{{decodeURI(userName)}}</span>
          <span>限在{{item.store_name}}使用</span>
        </div>
      </div>
    </div>
    <div class="loadingMore">
      <span v-show="page-totalPage!=1">
        <img src="../../assets/images/loading@2x.png" alt="">
        <span>加载中</span>
      </span>
      <span v-if="page-totalPage==1&&from!='toPay'" class="noneData">我是有底线的，别拉了</span>
      <router-link v-if="page-totalPage==1&&from=='toPay'" :to="{path:'/coupon'}">领取优惠券</router-link>
    </div>
    <span v-if="from=='toPay'"  class="doNotCoupon" @click="goGoodsDetail(0,'')">不使用优惠券</span>
    <router-link v-if="from!='toPay'" :to="{path:'/coupon'}" class="doNotCoupon">领取优惠券</router-link>
  </div>
</template>

<script>
  import {getCookie} from '../../config/mUtils'
  import countDown from './child/countDown.vue'
  export default {
    name:'coupon',
    data() {
      return {
        tab:'unused',
        state:0,/* 0 未使用  1 已使用/已过期*/
        userId:getCookie('user_id'),
        userName:getCookie('user_name'),
        couponItem:[],
        from:this.$route.query.from,
        query:this.$route.query,
        terminal:getCookie('terminal'),
        page:1,
        totalPage:1,
        loadingMoreCtr:true,
        marginTop:this.$route.query.from == 'toPay' ? '0':'1rem'
      }
    },
    components: {
      'countDown': countDown,
    },
    mounted() {
      let self_=this;
      if(this.from=='toPay'){
        this.getNouseCouponList()
      }else{
        this.getCouponList()
      }
      window.addEventListener('scroll',this.loadingMore)
    },
    methods: {
      linkTo:function (store_id) {

        if(this.terminal=='a'){//安卓
          if(store_id==0){
            window.webview.getHome()
          }else{
            // alert('店铺'+store_id)
            window.webview.showStoreDetails(store_id)
          }
        }else if(this.terminal=='i'){//ios
          // window.getHome()
          if(store_id==0){
            window.getHome()
            // location.href = '../index.html'
          }else{
            // location.href = '../shop_detail.html?store_id='+store_id
            window.showStoreDetails(store_id)
          }
        }else {
          if(store_id==0){
            location.href = '../index.html'
          }else{
            location.href = '../shop_detail.html?store_id='+store_id
          }
        }
      },
      getCouponList:function () {//获取优惠券列
        let self_=this
        this.http('get','user/getCouponList',{
          state:self_.state,
          page:this.page,
          pagesize:10,
          user_id:self_.userId
        },function (data) {
          self_.couponItem=self_.couponItem.concat(data.result.items)
          self_.loadingMoreCtr = true
          self_.totalPage = data.result.totalpage
          self_.page = data.result.currentpage+1
        })
      },
      getNouseCouponList:function () {//用户所有优惠券列表
        let self_ = this
        this.http('get','User/getNouseCouponList',{
          user_id:self_.userId,
          store_id:self_.$route.query.store_id,
          page:this.page,
          pagesize:10,
          type:self_.$route.query.couponType
        },function (data) {
          self_.couponItem = self_.couponItem.concat(data.result.items)
          self_.loadingMoreCtr = true
          self_.totalPage = data.result.totalpage
          self_.page = data.result.currentpage+1
        })
      },
      toDate:function (time) {
        time = new Date(time*1000)
        let y = time.getFullYear()
        let m = time.getMonth()+1
        let d = time.getDate()
        return y +'-'+m+'-'+d
      },
      lessTime:function (time) {
        return parseInt(time/86400)
      },
      goGoodsDetail:function (id,type) {//返回购买页
        if(this.query.couponType==1){//平台红包
          this.$route.query.pqd_coupon_list_id = id
          this.$route.query.pqd_coupon_type = type

          // this.$route.query.pqd_coupon_list_id = id
          // this.$route.query.pqd_coupon_name = name
          // this.$route.query.pqd_coupon_price = money
          // this.$route.query.pqd_coupon_type = coupon_type
        }else{//店铺优惠券
          this.$route.query.coupon_list_id = id
          this.$route.query.coupon_type = type
          // this.$route.query.coupon_list_id = id
          // this.$route.query.coupon_name = name
          // this.$route.query.coupon_price = money
          // this.$route.query.coupon_type = coupon_type
        }
        let query = '';
        for(let key in this.$route.query){
          // console.log((key != 'money' && key != 'from' && key != 'coupon_type'));
          if(key != 'money' && key != 'from' && key != 'couponType'){
            query = query + '&' +key+'='+this.$route.query[key]
            // console.log(1);
          }
        }
        location.href = '../topay.html?'+query.substr(1)
      },
      loadingMore(){
        let clientHeight=document.body.clientHeight
        let bottom = this.$refs.content.getBoundingClientRect().bottom
        // console.log(parseInt(this.page)-parseInt(this.totalPage)!=1&&this.loadingMoreCtr&&parseInt(bottom)-parseInt(clientHeight)<100);
        if(parseInt(this.page)-parseInt(this.totalPage)!=1&&this.loadingMoreCtr&&parseInt(bottom)-parseInt(clientHeight)<100){
          this.loadingMoreCtr = false
          // console.log('拉取数据');
          if(this.from=='toPay'){
            this.getNouseCouponList()
          }else{
            this.getCouponList()
          }
        }
      },
    }
  }
</script>

<style lang='scss' scoped>
  @import "../../style/common";
  #myCoupon {
    /*height: 100%;*/
    display: flex;
    flex-direction: column;
    .tab {
      display: flex;
      justify-content: space-between;
      position: fixed;
      top:0;
      left:0;
      width: 100vw;
      z-index: 9999999;
      span {
        height: .8rem;
        width: 50%;
        text-align: center;
        line-height:.8rem;
        background-color: #fff;
        font-size: .28rem;
        border-bottom: .03rem solid #fff;
        color: #ccc;
      }
      .tabActive {
        color: #F61027;
        border-bottom: .03rem solid #F61027;
      }
    }
    .couponItems {
      margin-top:.8rem;
      // margin-bottom:1rem;
      padding: 0 .2rem;
      flex: 1;
      overflow: scroll;
      -webkit-overflow-scrolling: touch;
      .couponItem {
        margin-top:.3rem;
        height: 2.6rem;
        background-color: #fbfbfb;
        border-radius: .14rem;
        .couponItemTop {
          height: 2rem;
          background-color: #fff;
          border-radius: .14rem;
          display: flex;
          .couponMsg {
            display: flex;
            flex-direction: column;
            padding: .54rem 0;
            border-right: 1px dashed #eee;
            align-items: center;
            justify-content: space-between;
            width: 1.84rem;
            .price {
              height: .6rem;
              .dollar {
                font-size: .24rem;
                color: #f61027;
              }
              .couponMoney {
                font-size: .46rem;
                color: #f61027;
                line-height: .4rem;
              }
            }
            div {
              font-size: .22rem;
              color: #333;
              font-family: "Microsoft Yahei";
            }
          }
          .couponInfo {
            display: flex;
            justify-content: space-between;
            padding:.4rem .5rem .3rem .3rem;
            flex: 1;
            .couponInfoLeft {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              .couponTitle {
                font-size: .3rem;
                color: #333;
              }
              .couponRules {
                height: .8rem;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                p {
                  font-size: .24rem;
                  color: #ccc;
                }
              }
            }
            .couponInfoRight {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: center;
              padding-bottom: .06rem;
              button {
                margin-top:.01rem;
                padding: 0 .24rem;
                text-align: center;
                height: .56rem;
                line-height: .56rem;
                background-color: #F61027;
                border-radius: .3rem;
                font-size: .24rem;
                color: #fff;
              }
              span {
                font-size: .24rem;
                color: #f61027;
                font-family: "Microsoft Yahei";
              }
              img {
                height: .64rem;
                width: .64rem;
                border-radius: .1rem;
              }
              .gray {
                -webkit-filter: grayscale(100%);
                -moz-filter: grayscale(100%);
                -ms-filter: grayscale(100%);
                -o-filter: grayscale(100%);
                filter: grayscale(100%);
                filter: gray;
                opacity: .4;
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
    .grayColor {
      color: #ccc!important;
    }
    .doNotCoupon {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100vw;
      height: 1rem;
      width: 100%;
      background-color: #fff;
      text-align: center;
      line-height:1rem;
      // color: #fff;
      font-size: .34rem;
      background-color: #fff;
    }
    a {
      background-color:#F61027!important;
      color: #fff;
      font-size: .34rem;
    }
    .loadingMore {
      display: flex;
      justify-content: center;
      align-items: center;
      height: .8rem;
      margin-bottom: 1rem;
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
      a {
        color: red;
        background-color: rgba(0,0,0,.0)!important;
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
  }
</style>
