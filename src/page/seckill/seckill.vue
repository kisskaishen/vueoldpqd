<template>
  <div class="seckill" ref="content">
    <ul class="timeWr">
      <li v-if="category_sec.length!=0" v-for="(category,index) in category_sec" @click="tab(index,category.start_time,category.end_time,category.id)"  :class="[(index == num?'active':'')]">
        <p class="time">{{category.time_name}}</p>
        <p class="timeinfo" v-if="category.start_time>now_time">即将开抢</p>
        <p class="timeinfo" v-else>抢购中</p>
      </li>
    </ul>
    <div class="limitTimeWr">
      <div v-if="selStime<now_time&&selEtime>now_time">剩余</div>
      <div v-else>距开始</div>

      <span>{{hour}}</span> <i>:</i> <span>{{minutes}}</span> <i>:</i> <span>{{seconds}}</span>
    </div>
    <ul class="goodsWr">
      <li v-for="(item,index) in items"  @click="appShowGoodsDetail(item.goods_id,item.activ_type)">
        <div class="goodsImgWr" :class="item.store_count==0?'over':''">
          <img class="original_img" :src="item.list_img" alt="">
        </div>
        <div class="goodsInfo">
          <div class="goods_name">{{item.goods_name}}</div>
          <div class="ScheduleWr">
            <div class="process soon" v-if="selStime>now_time"></div>
            <div class="process over" v-else-if="item.store_count==0"></div>
            <div class="process now" v-else>
              <span></span>
              <div :style="{width:(100-item.process)+'%'}">
              </div>
            </div>
            <p>剩余{{item.process}}%</p>
          </div>
          <div class="original_price">
            ￥{{item.market_price}}
          </div>

          <div class="good_rightb" v-if="selStime>now_time">
            ￥{{item.prom_price}}<span class="btnrh openmark" @click.stop="setmark(item.goods_id,item.set_push,index,item.activ_category_id)" v-if="item.set_push==0">开团提醒</span><span @click.stop="setmark(item.goods_id,item.set_push,index,item.activ_category_id)" class="btnrh canmark" v-else>取消提醒</span>
          </div>
          <div class="good_rightb salout" v-else-if="item.store_count==0">
            ￥{{item.prom_price}}<span class="btnrh goout">已售罄</span>
          </div>
          <div class="good_rightb saling" v-else>
            ￥{{item.prom_price}}<span class="btnrh going">立即抢购</span>
          </div>
        </div>
      </li>
    </ul>
    <div class="loadingMore">
      <span v-show="page-totalPage!=1">
        <img src="../../assets/images/loading@2x.png" alt="">
        <span>加载中</span>
      </span>
      <span v-show="page-totalPage==1" class="noneData">我是有底线的，别拉了</span>
    </div>
  </div>
</template>

<script>

import {getCookie} from '../../config/mUtils'
export default {
  data(){
    return {
      items:[],
      category_sec:[],
      now_time:null,
      num:0,
      selStime:null,
      selEtime:null,
      hour:'00',
      minutes:'00',
      seconds:'00',
      timer:null,
      page:1,
      id:'',
      index:0,
      loadingMoreCtr:false,
      totalPage:1,
      terminal:getCookie('terminal'),
      localTime:null,
      currenTime:null,
      timeDiff:null,
    }
  },
  mounted(){
    if(!sessionStorage.getItem("location")){
      sessionStorage.setItem("location", 0);
      sessionStorage.setItem("locationId", '');
      sessionStorage.setItem("locationStime", null);
      sessionStorage.setItem("locationEtime", null);

      //this.index=0;
    }
    this.num=sessionStorage.getItem("location");
    this.id=sessionStorage.getItem("locationId");
    this.selStime=sessionStorage.getItem("locationStime");
    this.selEtime=sessionStorage.getItem("locationEtime");
    this.getList();
    window.addEventListener('scroll',this.loadingMore);
  },
  methods:{
    getList(){
      //document.cookie="user_id=123";
      this.http('get','Activ/lists_sec',{
        user_id:getCookie('user_id'),
        page:this.page,
        id:this.id
      },(data) => {
        ////console.log(data);
        let arr = data.result.goods_list.items;

        data.result.goods_list.items.forEach((item,index) => {
          if(item.store_count==0){
            arr[index].process = 0;
          }else{
            arr[index].process = parseInt((item.store_count/(parseInt(item.sales)+parseInt(item.store_count)))*100);
          }
          //item.

        })
        this.now_time=parseInt(data.result.now_time);
        // this.localTime=new Date().getTime();

        this.timeDiff=this.now_time-parseInt(new Date().getTime()/1000);
        ////console.log(this.timeDiff);
        this.items=this.items.concat(arr);
        this.category_sec=data.result.category_sec;
        this.totalPage=data.result.goods_list.totalpage;
        this.page++;
        this.loadingMoreCtr = true;
        clearInterval(this.timer);

        if(!this.selStime||this.num==0){
          //console.log(123213123);
          this.selStime=data.result.category_sec[0].start_time;
          this.selEtime=data.result.category_sec[0].end_time;
          this.id=data.result.category_sec[0].id;
          if(this.selStime>=this.now_time){
            this.setInTime(this.now_time,this.selStime);
          }else{
            this.setInTime(this.now_time,this.selEtime);
          }

        }else{
          //console.log("this.selStime",this.selStime);

          this.setInTime(this.now_time,this.selStime);
        }

      })
    },
    tab(index,stime,etime,id) {
      this.num=index;
      this.items=[];

      // var showTab = window.location.hash;
      // //console.log(showTab);
      //////console.log(',,,',index);
      this.selStime=parseInt(stime);
      this.selEtime=parseInt(etime);
      sessionStorage.setItem("location", index);
      sessionStorage.setItem("locationId", id);
      sessionStorage.setItem("locationStime", this.selStime);
      sessionStorage.setItem("locationEtime", this.selEtime);
      //console.log(this.selStime,sessionStorage.getItem("locationStime"));
      clearInterval(this.timer);
      this.hour='00';
      this.minutes='00';
      this.seconds='00';

      //this.setInTime(this.now_time,this.selEtime);

      this.page=1;
      this.id=id;

      this.getList(this.id,this.page,index);

    },
    setInTime(now_time,end_time){
      // let timeover = end_time-now_time;
      let self = this;

      this.timer = setInterval(function(){
        ////console.log(self.timeDiff);
        //console.log(self.timeDiff);
        now_time = parseInt(new Date().getTime()/1000)+self.timeDiff;

        let timeover = end_time-now_time;
        ////console.log(timeover);
        let hours = timeover%86400;
        //////console.log(hours);
        self.hour = parseInt(hours/3600)>9?parseInt(hours/3600):'0'+parseInt(hours/3600);

        let minutes = timeover%3600;

        self.minutes = parseInt(minutes/60)>9?parseInt(minutes/60):'0'+parseInt(minutes/60);

        self.seconds = timeover%60>9?timeover%60:'0'+timeover%60;
        timeover--;

        if(timeover<=0){
          //////console.log(timeover);
          //////console.log(timeover);
          clearInterval(this.timer);
          sessionStorage.setItem("location", 0);
          sessionStorage.setItem("locationId", '');
          sessionStorage.setItem("locationStime", null);
          sessionStorage.setItem("locationEtime", null);
          window.location.reload();

        }
      },1000)

      //////console.log(timeover);
    },
    setmark(goods_id,cancel,index,activ_category_id){
      this.http('get','Activ/activ_set_push',{
        user_id:getCookie('user_id'),
        goods_id:goods_id,
        cancel:cancel,
        activ_category_id:activ_category_id
      },(data) => {
        ////console.log(data);
        this.items[index].set_push=data.result.set_push;
      })
    },
    loadingMore(){
      let clientHeight=document.body.clientHeight
      let bottom = this.$refs.content.getBoundingClientRect().bottom
      if(parseInt(this.page)-parseInt(this.totalPage)!=1&&this.loadingMoreCtr&&parseInt(bottom)-parseInt(clientHeight)<100){
        this.loadingMoreCtr = false
        this.getList();
      }
    },
    appShowGoodsDetail (goods_id,type) {
      // alert('限时秒杀')
      if(this.terminal=='a'){
        window.webview.showGoodsDetails(goods_id,type)
      }else if(this.terminal=='i'){
        window.showGoodsDetails(goods_id,type)
      }else {
        location.href = '../goods_detail.html?goods_id='+goods_id+'&activ_type='+type
      }
    }
  }
}
</script>

<style lang="scss">
  .seckill{
    .timeWr{
      height: .9rem;
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      li{
        flex: 1;
        align-items: center;
        justify-content: center;
        p{
          text-align: center;
          font-size: .2rem;
          color: rgba(31,31,31,1);
        }
        .time{
          font-size: .32rem;
        }
      }
      li.active{
        p{
          color: rgba(239,57,74,1);
        }
        .time{
          font-size: .4rem;
        }
      }
    }

    .limitTimeWr{
      height: .88rem;
      border-bottom: .02rem solid rgba(240,240,240,1);
      text-align: center;
      justify-content: center;
      align-items: center;
      display: flex;

      div{
        color: rgba(31,31,31,1);
        font-size: .26rem;
        margin-right: .2rem;
      }
      span{
        width: .37rem;
        height: .4rem;
        line-height: .4rem;
        color: rgba(255,255,255,1);
        font-size: .26rem;
        display: inline-block;
        background: url('../../assets/images/timebg.png') no-repeat;
        background-size: 100%;
        &:first-child{
          margin-left: .25rem;
        }
      }
      i{
        font-weight: normal;
        margin: 0 .06rem;
      }
    }

    .goodsWr{
      //height: 2.54rem;
      li{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-bottom: .1rem;
        .goodsImgWr{
          width: 2.54rem;
          height: 2.54rem;
          position: relative;
          &.over{
            &:after{
              position: absolute;
              content: '';
              top: .91rem;
              left: .48rem;
              width: 1.6rem;
              height: .72rem;
              background: url('../../assets/images/saleout.png') no-repeat center;
              background-size: 98%;
            }
          }
          img{
            width: 2.54rem;
            height: 2.54rem;
          }
        }
        .goodsInfo{
          flex: 1;
          height: 2.54rem;
          margin-left: .25rem;
          margin-right: .3rem;
          border-bottom: .01rem solid rgba(240,240,240,1);
          display: flex;
          flex-direction: column;
          .goods_name{
            width: 3.95rem;
            height: .68rem;
            font-size: .26rem;
            color: rgba(0,0,0,1);
            overflow : hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          .ScheduleWr{
            height: .7rem;
            //flex: 1;
            display: flex;
            align-items: center;
            p{
              font-size: .22rem;
              margin-left: .28rem;
            }
            .process{
              width: 2.01rem;
              height: .31rem;
              display: inline-block;
              background: url('../../assets/images/goingbg.png') no-repeat ;
              background-size: 100%;
              position: relative;

              &.soon{
                background: url('../../assets/images/openbg.png') no-repeat ;
                background-size: 100%;
              }
              &.over{
                background: url('../../assets/images/overbg.png') no-repeat ;
                background-size: 100%;
              }
              &.now{
                span{
                  position: absolute;
                  width: 100%;
                  height: 100%;
                  left: 0;
                  top: 0;
                  background: url('../../assets/images/wh_bg.png') no-repeat ;
                  background-size: 100%;
                  z-index: 9;
                }
                div{
                  height: 100%;
                  border-radius: .05rem;
                  background: -webkit-linear-gradient(left, #fea436 , #fe4426);
                }
              }
            }

          }
          .original_price{
            height: .16rem;
            flex: 1;
            font-size: .20rem;
            color: rgba(161,161,161,1);
            text-decoration: line-through;
          }
          .good_rightb{
            height: .52rem;
            font-size: .38rem;
            display: flex;
            color: #EF394A;
            justify-content: space-between;
            margin-bottom: .2rem;
            &.salout{
              color: #cdcdcd;
            }
            .btnrh{
              display: inline-block;
              width: 1.6rem;
              height: .52rem;
              text-align: center;
              line-height: .52rem;
              font-size: .24rem;
              background-color: rgba(239,57,74,1);
              color: #fff;
              border-radius: .05rem;
              &.openmark{
                background-color: rgba(5,200,37,1)
              }
              &.canmark{
                color: rgba(5,200,37,1);
                background-color: #fff;
                border:1px solid rgba(5,200,37,1);
              }
              &.goout{
                background-color: rgba(205,205,205,1);
              }
            }
          }
        }
      }
    }
    .loadingMore {
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
  }
</style>
