<template>
    <div id="active"  >
      <div class="banner">
        <router-link to="/coupon">立即领取</router-link>
      </div>
      <div class="groups">
        <div class="line">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <router-link :to="{path:'/parallelSession',query:{id:item.id,title:item.name}}" class="groupItem" v-for="(item,index) in groupItems" :key="item.id">
          <div class="img">
            <img :src="item.logo" alt="">
          </div>
          <div class="bottom">
            <span>{{item.name}}</span>
            <span class="circle circleLeft"></span>
            <span class="circle circleRight"></span>
          </div>
        </router-link>
      </div>
      <div class="recommend">
        <div class="recommendTitle">
            <span class="line"></span><span class="circle"></span>
            <span class="text">为你推荐</span>
            <span class="circle"></span><span class="line"></span>
        </div>
        <div class="recommendItems">
          <div  class="recommendItem" v-for="(item,index) in goodsItems" @click
            ="appShowGoodsDetail(item.goods_id)">
            <div class="img">
              <img :src="item.list_img" alt="">
            </div>
            <div class="bottom">
              <div class="goodsName ellipsis-2">
                {{item.goods_name}}
              </div>
              <div class="goodsInfo">
                <span class="price">￥<span>{{item.prom_price}}</span></span>
                <span class="prom">{{item.prom}}人团</span>
              </div>
            </div>
          </div>
          <div class="loadingMore" v-if="loadingMoreCtr&&page<=totalPage">
            <img src="../../assets/images/loading@2x.png" alt="" >
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {getCookie} from '../../config/mUtils'
    export default {
      name:'active',
        data() {
            return {
              groupItems:[],
              goodsItems:[],
              page:'',
              totalPage:'',
              loadingMoreCtr:false,
              scrollEnabled:true,
              terminal:getCookie('terminal'),
              rem:parseInt(document.querySelector('html').style.fontSize.split('p')[0])
            }
        },
        mounted() {
        let self_ = this
          this.getActiveIndex();
          document.querySelector('body').onscroll=function () {
            self_.loadingMore()
          }
        },
        methods: {
          getActiveIndex:function () {
            let self_ = this
            this.loadingMoreCtr = true
            this.http('get','Activ/index',{
              page:self_.page
            },function (data) {
              self_.scrollEnabled = true
              self_.loadingMoreCtr = false
              self_.page = data.result.goods.currentpage + 1
              self_.totalPage = data.result.goods.totalpage
              self_.groupItems = data.result.category
              self_.goodsItems = self_.goodsItems.concat(data.result.goods.items)
            })
          },
          loadingMore:function () {//加载更多
            this.loadingMoreCtr = true;
            if(document.querySelectorAll('.recommendItem')[this.goodsItems.length - 1].getBoundingClientRect()){
              let startRequst = parseInt(document.querySelectorAll('.recommendItem')[this.goodsItems.length - 1].getBoundingClientRect().bottom) < parseInt(document.querySelector('body').clientHeight) + 4 * parseInt(this.rem)
              if(startRequst&&this.scrollEnabled&&this.totalPage>=this.page){
                this.scrollEnabled = false
                this.getActiveIndex();
              }
            }
          },
          appShowGoodsDetail:function (goods_id) {
            if(this.terminal=='a'){
              window.webview.showGoodsDetails(goods_id)
            }else if(this.terminal=='i'){
              window.showGoodsDetails(goods_id)
            }else {
              location.href = '../goods_detail.html?goods_id='+goods_id
            }
          }
        }
    }
</script>

<style lang='scss' scoped>
  @import "../../style/common";
  #active {
    background-color: #7022e5;
    -webkit-overflow-scrolling: touch;
    .banner {
      height: 7.6rem;
      display: flex;
      align-items: flex-end;
      margin-bottom:.46rem;
      background: url(../../assets/images/activity_impression@2x.png);
      background-size: 100%;
      position: relative;
        a {
          height: .6rem;
          width: 1.4rem;
          border-radius: .3rem;
          background-color: rgba(0,0,0,0);
          color: #FFFFFF;
          font-size: .26rem;
          line-height: .6rem;
          text-align: center;
          position: absolute;
          right: .7rem;
          bottom: .5rem;
      }
    }
    .groups {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      padding: 0 .2rem;
      position: relative;
      .line {
        position: absolute;
        display: flex;
        width: 100%;
        justify-content: space-around;
        left: 0;
        top: -.44rem;
        span {
          height: .44rem;
          width: .11rem;
          background-color: #F98100;
          border-radius: .055rem;
        }
      }
      .groupItem {
        height: 3rem;
        width: 2.2rem;
        background-color: #fff;
        border-radius: .1rem;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;
        margin-bottom: .3rem;
        padding: .1rem .5rem 0 .5rem;
        .img {
          height: 2.2rem;
          width: 2.1rem;
          /*background-color: hotpink;*/
          border-radius: .1rem;
          img {
            height: 100%;
            width: 100%;
          }
        }
        .bottom {
          width: 2.2rem;
          height: .7rem;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
          position: relative;
          span {
            color: #333;
            font-size: .26rem;
          }
          .circle {
            position: absolute;
            height:.36rem;
            width: .36rem;
            border-radius: .18rem;
            border: .04rem solid #FFC822;
          }
          .circleLeft {
            left: -.1rem;
            bottom: -.1rem;
          }
          .circleRight {
            right: -.2rem;
            top:.2rem;
          }
        }
      }
    }
    .recommend {
      .recommendTitle {
        padding: .4rem 0 .6rem 0;
        display: flex;
        justify-content: center;
        align-items: center;
        .text {
          font-size: .4rem;
          color: #fff;
          padding: 0 .2rem;
        }
        .line {
          width: 1rem;
          height: 0;
          border-bottom: .02rem solid #fff;
        }
        .circle {
          height: .1rem;
          width: .1rem;
          border-radius: .05rem;
          border: .02rem solid #fff;
        }
      }
      .recommendItems {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        padding: .2rem;
        .loadingMore {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
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
        .recommendItem {
          height: 4.84rem;
          width: 3.45rem;
          background-color: #fff;
          border-radius: .1rem;
          padding: .1rem .05rem 0 .05rem;
          margin-bottom: .2rem;
          .img {
            height: 3.35rem;
            width: 3.35rem;
            /*background-color: hotpink;*/
            border-radius: .1rem;
            img {
              height: 100%;
              width: 100%;
            }
          }
          .bottom {
            width: 100%;
            height: 1.4rem;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: .1rem .1rem;
            .goodsName {
              height: .7rem;
              font-size: .26rem;
              color: #333;
              position: relative;
              display: flex;
              img {
                position: absolute;
                width: .8rem;
                top:.05rem
              }
            }
            .goodsInfo {
              display: flex;
              justify-content: space-between;
              align-items: center;
              .price {
                font-size: .22rem;
                color: #F61027;
                span {
                  font-size: .3rem;
                  color: #F61027;
                }
              }
              .prom {
                font-size: .22rem;
                color: #ccc;
              }
            }
          }
        }
      }
    }
  }
</style>
