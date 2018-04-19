<template lang="html">
  <div id="active" ref="content" >
    <div class="header">
      <img :src="categoryInfo.banner" alt="">
      <div class="tab" :style="{backgroundColor:categoryInfo.bg_color}">
        <span :style="{opacity:sortType==0?1:.5}" @click="tab(0)">综合</span>
        <span @click="tab(2)">
          <span :style="{opacity:sortType==1||sortType==2?1:.5}">销量</span>
          <span>
            <img src="../../assets/images/activity_uparrows@2x.png" alt="" :style="{opacity:sortType==1?1:.5}">
            <img src="../../assets/images/activity_downarrows@2x.png" alt="" :style="{opacity:sortType==2?1:.5}">
          </span>
        </span>
        <span @click="tab(3)">
          <span :style="{opacity:sortType==3||sortType==4?1:.5}">价格</span>
          <span>
            <img src="../../assets/images/activity_uparrows@2x.png" alt="" :style="{opacity:sortType==3?1:.5}">
            <img src="../../assets/images/activity_downarrows@2x.png" alt="" :style="{opacity:sortType==4?1:.5}">
          </span>
        </span>
      </div>
    </div>
    <div class="body">
      <div class="goodsItem" v-for="(item,index) in goodsList" @click="appShowGoodsDetail(item.goods_id,item.activ_type)">
        <div class="imgBox">
          <img :src="item.list_img" alt="">
        </div>
        <div class="goodsInfo">
          <p>{{item.goods_name}}</p>
          <p>
            <span>¥<span>{{item.prom_price}}</span></span>
            <span>{{item.prom}}人团</span>
          </p>
        </div>
      </div>
    </div>
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
      categoryInfo:{},
      sortType:0,// 0 综合排序 1 销量升序排列  2 销量降序排序 3 价格升序排列 4 价格降序排列
      goodsList:[],
      page:1,
      totalPage:1,
      loadingMoreCtr:true,
      terminal:getCookie('terminal'),
    }
  },
  mounted(){
    this.getData()
    // this.$refs.content.addEventListener('scroll',this.loadingMore)
    window.addEventListener('scroll',this.loadingMore)
  },
  methods:{
    getData(){
      let sort = '' //'' 综合排序 sales 销量排序 price 价格排序
      let by = '' //'' 综合排序  ASC 升序 DESC 降序
      switch(this.sortType){
        case 0 ://综合排序
          break
        case 1 : //销量升序排列
          sort = 'sales'
          by = 'ASC'
          break
        case 2 : //销量升序排列
          sort = 'sales'
          by = 'DESC'
          break
        case 3 : //价格升序排列
          sort = 'price'
          by = 'ASC'
          break
        case 4 : //价格降序排列
          sort = 'price'
          by = 'DESC'
          break
      }
      this.http('get','Activ/lists_pick',{
        id:this.$route.query.id,
        page:this.page,
        pagesize:15,
        sort:sort,
        by:by,
      },(data) => {
        this.categoryInfo = data.result.category_info
        document.title = data.result.category_info.name
        this.goodsList = this.goodsList.concat(data.result.goods_list.items)
        this.loadingMoreCtr = true
        this.totalPage = data.result.goods_list.totalpage
        this.page = data.result.goods_list.currentpage+1
      })
    },
    tab(type){
      this.goodsList = []
      this.page = 1
      this.totalPage = 1
      if(type==0){
        this.sortType = 0
      }
      if(type == 2){
        if(this.sortType == 2){
          this.sortType = 1
        }else{
          this.sortType = 2
        }
      }
      if(type == 3){
        if(this.sortType == 3){
          this.sortType = 4
        }else{
          this.sortType = 3
        }
      }
      this.getData()
    },
    loadingMore(){
      let clientHeight=document.body.clientHeight
      let bottom = this.$refs.content.getBoundingClientRect().bottom
      if(parseInt(this.page)-parseInt(this.totalPage)!=1&&this.loadingMoreCtr&&parseInt(bottom)-parseInt(clientHeight)<100){
        this.loadingMoreCtr = false
        if(this.page!=1){
          this.getData();
        }

      }
    },
    appShowGoodsDetail:function (goods_id,type) {
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

<style lang='scss' scoped>
@import "../../style/common";

#active {
  .header {
    display: flex;
    flex-direction: column;
    >img {
      width: 100%;
    }
    .tab {
      height: .88rem;
      display: flex;
      >span {
        font-size: .32rem;
        color: #fff;
        font-family: 'PingFang-SC-Medium';
        flex:1;
        display: flex;
        align-items: center;
        justify-content: center;
        span {
          color: #fff;
        }

        span:last-child {
          display: flex;
          flex-direction: column;
          margin-left: .1rem;
          img {
            height: .08rem;
          }
          img:first-child {
            margin-bottom: .06rem;
          }
        }
      }
    }
  }
  .body {
    padding: .2rem .2rem 0 .2rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    background-color: #f6f6f6;
    .goodsItem {
      width: 2.3rem;
      height: 3.5rem;
      .imgBox {
        height: 2.3rem;
        width: 2.3rem;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        img {
          width: 100%;
        }
      }
      .goodsInfo {
        display: flex;
        padding: .14rem .1rem 0 .1rem;
        flex-direction: column;
        justify-content: space-between;
        p:first-child {
          width: 100%;
          overflow: hidden;
          text-overflow:ellipsis;
          white-space: nowrap;
          font-size: .26rem;
          font-family: '微软雅黑'
        }
        p:last-child {
          display: flex;
          justify-content: space-between;
          margin-top: .08rem;
          >span:first-child {
            font-size: .22rem;
            color: #F61027;
            span {
              font-size: .26rem;
              color: #F61027;
              margin-left: .08rem;
            }
          }
          >span:last-child {
            font-size: .22rem;
            color: #ccc;
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
