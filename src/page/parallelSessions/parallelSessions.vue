<template>
    <div id="parallelSession"  :style="{backgroundColor:style.backgroundColor}">
      <div class="banner" >
        <img :src="style.bannerSrc" alt="">
      </div>
      <div class="recommendItems">
        <div  class="recommendItem" v-for="(item,index) in goodsItems" @click="appShowGoodsDetail(item.goods_id)">
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
</template>

<script>
  import {getCookie} from '../../config/mUtils'
    export default {
      name:'parallelSession',
        data() {
            return {
              goodsItems:[],
              page:'',
              totalPage:'',
              loadingMoreCtr:false,
              scrollEnabled:true,
              style:{},
              terminal:getCookie('terminal'),
              rem:document.querySelector('html').style.fontSize
            }
        },
        created(){
          switch (parseInt(this.$route.query.id)){
            case 1 ://美妆护肤
            this.style={
              backgroundColor:'#e74731',
              bannerSrc:require('../../assets/images/baokuan@2x.png')
            }
            break;
            case 2 ://服装箱包
              this.style={
                backgroundColor:'#b2aaa1',
                bannerSrc:require('../../assets/images/xinxuan@2x.png')
              }
              break;
            case 3 ://数码电器
              console.log('chenggong');
              this.style={
                backgroundColor:'#f78c9b',
                bannerSrc:require('../../assets/images/baonuan@2x.png')
              }
              break;
            case 4 ://食品饮料
              this.style={
                backgroundColor:'#de2757',
                bannerSrc:require('../../assets/images/neiyi@2x.png')
              }
              break;
            case 5 ://生鲜水果
              this.style={
                backgroundColor:'#c9915e',
                bannerSrc:require('../../assets/images/bibai@2x.png')
              }
              break;
            case 6 ://家居生活
              this.style={
                backgroundColor:'#2b87e5',
                bannerSrc:require('../../assets/images/jingpin@2x.png')
              }
              break;
            case 7 ://家纺家具
              this.style={
                backgroundColor:'#9a4de9',
                bannerSrc:require('../../assets/images/pinzhi@2x.png')
              }
              break;
            case 8 ://海淘专区
              this.style={
                backgroundColor:'#ffd148',
                bannerSrc:require('../../assets/images/nvwang@2x.png')
              }
              break;
            case 9 ://母婴玩具
              this.style={
                backgroundColor:'#2270ff',
                bannerSrc:require('../../assets/images/nande@2x.png')
              }
              break;
          }
        },
        mounted() {
          let self_ = this
          this.$route.meta.title = this.$route.query.title
          this.getGoodsList();
          document.querySelector('body').onscroll=function () {
            self_.loadingMore()
          }
        },
        methods: {
          getGoodsList:function () {
            let self_ = this;
            this.loadingMoreCtr = true
            this.http('get','Activ/lists',{
              page:self_.page,
              id:self_.$route.query.id
            },function (data) {
              console.log(data);
              self_.scrollEnabled = true
              self_.loadingMoreCtr = false
              self_.page = data.result.goods.currentpage + 1
              self_.totalPage = data.result.goods.totalpage
              self_.goodsItems = self_.goodsItems.concat(data.result.goods.items)
            })
          },
          loadingMore:function () {//加载更多
            this.loadingMoreCtr = true;
            if(parseInt(document.querySelectorAll('.recommendItem')[this.goodsItems.length - 1].getBoundingClientRect().bottom) < parseInt(document.querySelector('body').clientHeight) + 8 * parseInt(this.rem)&&this.scrollEnabled&&this.totalPage>=this.page){
              this.scrollEnabled = false
              this.getGoodsList();
            }
          },
          appShowGoodsDetail:function (goods_id) {//跳转到app详情页
            if(this.terminal=='a'){
              // alert(goods_id)
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
  #parallelSession {
    -webkit-overflow-scrolling: touch;
    .banner {
      height: 3rem;
      img {
        width: 100%;
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
</style>
