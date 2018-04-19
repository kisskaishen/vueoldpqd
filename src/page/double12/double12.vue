<template lang="html">
  <div id="double12">
    <lottery :lottery-show='true' :propsto="propsto" @hidden-dialog='hiddenDialog()' v-if='lotteryCtr' style="z-index:9999"></lottery>

    <div class="toast" v-show="toastCtr">
      <span>今日抽奖机会已用完！</span>
    </div>
    <div class="header">

      <router-link :to="{ name: 'doubleTwelveRules'}" class="activeRules"></router-link>
      <span class="countDown">
        距离新年活动结束还有：
        <span v-if="countDown.day!='0'">
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
      </span>
      <div class="redpacket" @click="getGameInfo">
        <div class="boom">
          <img src="./images/boom_life@2x.png" alt="">
          <img src="./images/boom_right@2x.png" alt="">
        </div>
      </div>
      <!-- <span class="countDown">
        <span v-if="countDown.day!='0'">
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
      </span> -->
      <!-- <router-link class="sencondKill" :to="{ name: 'seckill' }">
      </router-link> -->
      <a class="sencondKill" @click="goSeckill()">

      </a>
      <div class="timeLine">

        <!-- <img :class="['img'+secondActive]" src="../../assets/images/activity_timelump@2x.png" alt=""> -->
        <div :class="['timeLineItem',secondActive==index?'active':'']" @click="timeLineTab(index)" v-for="(item,index) in secondItems">
          <span>{{item.time_name}}</span>
          <span v-if="item.end_time>nowTime&&nowTime>item.start_time" >抢购中</span>
          <span v-else>即将开抢</span>
        </div>
      </div>
      <div class="goodsScroll" v-if="httpCtr" ref="scroll">
        <div class="">
          <div class="goodsSecondItem" v-for="(item,index) in secondItems[secondActive].goods_list" @click="appShowGoodsDetail(item.goods_id,item.activ_type)">
            <span>
              <img :src="item.list_img" alt="">
            </span>
            <div class="goodsInfo">
              <span >{{item.goods_name}}</span>
              <span class="price">
                <span>¥<span>{{item.prom_price}}</span></span>
                <span>¥{{item.market_price}}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <!-- <img class="shadow" src="../../assets/images/activity_shadow@2x.png" alt=""> -->
    </div>
    <div class="body">
      <!-- <img src="../../assets/images/精品优选@2x.png" alt=""> -->
      <div class="" v-for="(item,index) in categoryItems">
        <router-link :to="{ name: 'double12Son', query: {id:item.id} }">
          <img :src="item.logo" alt="">
        </router-link>
        <div class="goodsItem" v-for="(Item,Index) in item.goods_list" @click="appShowGoodsDetail(Item.goods_id,Item.activ_type)">
          <span>
            <img :src="Item.list_img" alt="">
          </span>
          <span class="price">
            ¥<span>{{Item.prom_price}}</span><span>¥{{Item.market_price}}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import lottery from '../../components/lottery/lottery.vue'
import {getCookie} from '../../config/mUtils'
import router from "../../router"
export default {
  name:'double12',
  data(){
    return {
      arrowShow:3,
      countDown:{
        day:'0',
        hour:'00',
        minutes:'00',
        second:'00'
      },
      activeStatus:0, //0活动未开始  1 活动进行中
      secondItems:[],
      secondActive:0,
      nowTime:'',
      categoryItems:[],
      httpCtr:false,
      lotteryCtr:false,
      propsto:{},
      userId:getCookie('user_id'),
      terminal:getCookie('terminal'),
      toastCtr:false,
      left:'1.4rem',
      // 5.46
    }
  },
  components:{
      lottery,
  },
  mounted(){
    // this.arrowRunning()
    this.getActiveIndex()
    // this.stringToTime(87332)
    // this.animotion()
  },
  methods:{
    animotion(){
      let leftNum = 1.4
      setInterval(() => {
        if(leftNum<5.46){
          leftNum = leftNum+0.3
          this.left = leftNum+'rem'
        }else{
          leftNum = 1.4
        }
      },100)
    },
    getActiveIndex(){
      let that = this
      this.http('get','Activ/index_1212',{},(data) => {
        console.log(data);
        that.stampToTome(data.result.activ_time.start_time,data.result.activ_time.end_time,data.result.now_time)
        that.secondItems = data.result.category_sec
        that.nowTime = data.result.now_time
        that.categoryItems = data.result.category_pick
        this.httpCtr = true
        this.secondActive=0
        let delay = (data.result.category_sec[0].end_time-data.result.now_time+1)*1000
        console.log((data.result.category_sec[0].end_time-data.result.now_time+1)*1000);
        let timer = setTimeout(() => {
          this.getActiveIndex()
        },delay)
      })
    },
    stampToTome(start,end,now){
      let that = this
      if(start>now){//活动未开始
        this.activeStatus = 0
        let string = start-now
        setInterval(function(){
          string--
          that.stringToTime(string)
        },1000)
      }else if(now>start&&end>now){//活动进行中
        this.activeStatus = 1
        let string = end - now
        setInterval(function(){
          string--
          if(string<=0){
            return
          }
          that.stringToTime(string)
        },1000)
      }
    },
    stringToTime(string){
      if(string>=86400){//天
        this.countDown.day=parseInt(string/86400)
      }else{
        this.countDown.day = 0
      }
      let temphour = string%86400
      if(temphour>=3600){//时
        this.countDown.hour = parseInt(temphour/3600)>9?parseInt(temphour/3600):'0'+parseInt(temphour/3600)
      }else {
        this.countDown.hour = '00'
      }
      let tempMin = string%3600
      if(tempMin>=60){//分
        this.countDown.minutes = parseInt(tempMin/60)>9?parseInt(tempMin/60):'0'+parseInt(tempMin/60)
      }else{
        this.countDown.minutes = '00'
      }
      this.countDown.second = string%60>9?string%60:'0'+string%60
    },
    timeLineTab(index){
      this.secondActive = index
      this.$refs.scroll.scrollLeft=0
    },
    getGameInfo:function(){
      // alert(getCookie('terminal'))
      // if(getCookie('terminal')=='i'){
      //   return
      // }
      this.http('get','Activ/get_game_info',{
        user_id:this.userId
      },(data) => {
        if(data.result.is_show==1&&data.result.number>0){
          this.lotteryCtr = true
          this.propsto = data.result
        }
        if(data.result.number==0){
          this.toastCtr = true
          setTimeout(() => {
            this.toastCtr = false
          },1000)
        }
      })
    },
    hiddenDialog:function(val){
      this.lotteryCtr = val
    },
    appShowGoodsDetail:function (goods_id,type) {
      if(this.terminal=='a'){
        window.webview.showGoodsDetails(goods_id,type)
      }else if(this.terminal=='i'){
        window.showGoodsDetails(goods_id,type)
        // window.webkit.messageHandlers.showGoodsDetails.postMessage("getAppUserInfo");
      }else {
        location.href = '../goods_detail.html?goods_id='+goods_id+'&activ_type='+type
      }
    },
    goSeckill(){
      sessionStorage.setItem("location", 0);
      sessionStorage.setItem("locationId", '');
      sessionStorage.setItem("locationStime", null);
      sessionStorage.setItem("locationEtime", null);
      router.push({path:'/seckill'});
    }
  }
}
</script>

<style lang='scss' scoped>
@import "../../style/common";
#double12 {
  .toast {
    position: fixed;
    z-index:999;
    width:100%;
    display: flex;
    justify-content: center;
    top:6rem;
    span {
      padding: .1rem .2rem;
      background-color: rgba(0,0,0,.6);
      color: #fff;
      border-radius: .08rem;
    }
  }
  .header{
    width: 100%;
    height:16.8rem;
    // background-image: url('../../assets/images/activitydouble12@2x.png');
    background-image: url('./images/newyears_main@2x.png');
    background-size: 100% 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    .activeRules {
      // background-color: rgba(0,0,0,.5);
      height: .5rem;
      width: 1.1rem;
      position: absolute;
      top: 4.49rem;
      right:0;
    }
    .boom{
      // position: absolute;
      width: 5.15rem;
      top:0;
      left: 0;
      img {
        position: absolute;
        top:7.34rem;
        height: .97rem;
        width: .85rem;
      }
      img:first-child {
        left:1.36rem;
      }
      img:last-child {
        right:1.06rem;
      }
    }
    // .textImg {
    //   position: absolute;
    //   height: .4rem;
    //   width: 100%;
    //   top:5.62rem;
    //   display: flex;
    //   justify-content: center;
    //   img {
    //     width: 3.25rem;
    //   }
    // }

    .redpacket {
      height: 1.2rem;
      // background-color: rgba(0,0,0,.5);
      width: 4.5rem;
      margin-top: 6rem;

      // margin-left: -.03rem;
      // display: flex;
      // justify-content: space-between;
      // padding: 0 .2rem;
      // align-items: center;
      // span {
      //   display: flex;
      //   margin-top: -.01rem;
      //   span {
      //     height: .18rem;
      //     width: .08rem;
      //     img {
      //       height: 100%;
      //       z-index: 9;
      //     }
      //   }
      // }
      // span:first-child {
      //   span {
      //     margin-right: .1rem;
      //   }
      // }
      // span:last-child {
      //   span {
      //     margin-left: .1rem;
      //   }
      // }
    }

    .countDown {
      height: .6rem;
      // background-color: rgba(0,0,0,.5);
      background-color: #b22121;
      width: 7.5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #ffaeae;
      font-size: .26rem;
      span {
        color: #fff;
        display: flex;
        font-size: .28rem;
        line-height: .5rem;
        display: flex;
        align-items: center;
        color: #FFAEAE;
        font-size: .24rem;
        span {
          height: .4rem;
          width: .4rem;
          border-radius: .04rem;
          color: #fff;
          margin: 0 .1rem;
          font-weight: bold;
          font-size: .26rem;
          background-image: url('./images/newyears_time@2x.png');
          background-size: 100% 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .sencondKill {
      position: absolute;
      top:12.2rem;
      right: 2.74rem;
      height: .54rem;
      width: 2rem;
      // background-color: rgba(0,0,0,.5);
      margin-top: .82rem;
    }
    .timeLine {
      // background-color: rgba(0,0,0,.4);
      width: 5.8rem;
      height: .96rem;
      margin-top: 1.7rem;
      // margin-left: -.08rem;
      position: relative;
      display: flex;
      // img {
      //   transition: left .5s;
      //   height: 1.14rem;
      //   width: 1.44rem;
      //   position: absolute;
      // }
      // .img0 {
      //   left:0%;
      // }
      // .img1 {
      //   left:20%;
      // }
      // .img2 {
      //   left:40%;
      // }
      // .img3 {
      //   left:60%;
      // }
      // .img4 {
      //   left:80%;
      // }
      >div {
        z-index: 99;
        width:20%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        span:first-child {
          font-size: .3rem;
          color: #1f1f1f;
        }
        span:last-child {
          color: #666;
          font-size: .18rem;
          // font-family: "微软雅黑";
        }

        // .running {
        //   background-color: #fff;
        //   color: #FE7F21!important;
        //   height: .28rem;
        //   width: .72rem;
        //   border-radius: .14rem;
        //   display: flex;
        //   justify-content: center;
        //   align-items: center;
        // }
      }
      .active {
        span:first-child {
          font-size: .3rem;
          color: #fe000b;
        }
        span:last-child {
          color: #fe000b;
          font-size: .18rem;
        }
      }
    }
    .goodsScroll{
      // background-color: rgba(0,0,0,.4);
      width: 5.78rem;
      // height: 2.34rem;
      overflow-x: scroll;
      overflow-y: hidden;
      // display: flex;
      -webkit-overflow-scrolling: touch;
      >div {
        display: flex;
        flex-wrap: nowrap;
        float: left;
        .goodsSecondItem {
          height: 100%;
          width: 1.6rem;
          // border: .04rem solid #900006 ;
          border-radius: .05rem;
          margin-left: .1rem;
          display: flex;
          flex-direction: column;
          // background-color: #fff;
          // float: left;
          >span {
            height: 1.6rem;
            width: 1.6rem;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            // border-radius: .05rem;
            img {
              width: 100%;
              // border-radius: .05rem;
            }
          }
          .goodsInfo {
            width: 1.6rem;
            // padding: .1rem .1rem .1rem .1rem;
            // background-color: #fff;
            display: flex;
            flex-direction: column;
            // justify-content: space-between;
            >span:first-child {
              width:1.6rem!important;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap;
              word-break:keep-all;
              font-size: .26rem;
              color: #333;
              margin-top: .1rem;
              font-family: "微软雅黑";
            }
            .price {
              width: 1.6rem;
              display: flex;
              align-items: baseline;
              overflow: hidden;
              >span:first-child {
                color: #FE000B;
                font-size: .2rem;
                margin-right: .1rem;
                // width: 1.6rem;
                span {
                  font-size: .26rem;
                  color: #FE000B;
                }
              }
              >span:last-child {
                font-size: .2rem;
                color: #ccc;
                text-decoration: line-through;
              }
            }
          }
        }
      }
    }
    .shadow {
      width: .5rem;
      height: 3.5rem;
      position: absolute;
      bottom: 0;
      right:.2rem;
    }
  }
  .body {
    // background-image: url('./images/BG.png');
    background-color: #b22121;
    background-size: 100% 23.04rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    >div {
      width: 7.1rem;
      // height: 8.3rem;
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      background-color: #fff;
      margin-bottom: .5rem;
      // border: .06rem solid #E71F1A;
      // border-radius: .05rem;
      >a {
        width: 4.65rem;
        height: 2.66rem;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        margin-bottom: .15rem;

        img {
          width: 100%;
        }
      }
      .goodsItem {
        height: 2.7rem;
        width: 2.2rem;
        >span:first-child {
          width: 100%;
          height: 2.2rem;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          img {
            width: 100%;
          }
        }
        .price {
          height: .5rem;
          font-size: .22rem;
          color: #F91258;
          display: flex;
          justify-content: center;
          align-items: baseline;
          span:first-child {
            font-size: .3rem;
            color: #F91258;
            margin-right: .05rem;
          }
          span:last-child {
            font-size: .18rem;
            color:#ccc;
            text-decoration: line-through;
          }
        }
      }
    }
  }
}
</style>
