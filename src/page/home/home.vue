<template>
  <div id="home">
    <!--导航栏-->
    <swiper :options="swiperOptionNavbar" ref="swiperNavbar" id="navBar" @tauchstart.self="console.log(1);">
      <swiper-slide :class="swiperIndex==0?'active':''">首页</swiper-slide>
      <swiper-slide :class="swiperIndex==index+1?'active':''" v-for="(item,index) in navBarList" :key="item">{{item.name}}</swiper-slide>
    </swiper>
    <div class="tabs">
      <swiper :options="swiperOptionTabs" ref="swiperTabs">
        <swiper-slide class="swiperItem" v-once>
          <div class="banner">
            <swiper :options="swiperOptionBanner">
              <swiper-slide>Slide 1</swiper-slide>
              <swiper-slide>Slide 2</swiper-slide>
              <swiper-slide>Slide 3</swiper-slide>
              <div class="swiper-pagination" slot="pagination"></div>
            </swiper>
          </div>
          这是首页内容
        </swiper-slide >
        <swiper-slide class="swiperItem" v-for="(item,index) in navBarList" :key="item">
          <homeItem :homeItem="item" v-if="swiperIndex===index+1"></homeItem>

        </swiper-slide>
      </swiper>
    </div>
    <!--底部-->
    <footerComponent></footerComponent>
  </div>
</template>

<script>
  import Footer from '../../components/footer/footer.vue'
  import HomeItem from './child/homeItem.vue'
  export default {
    name: 'home',
    data() {
      return {
        swiperOptionNavbar: {//导航栏
          freeMode: true,
          freeModeMomentumRatio: 0.5,
          slidesPerView: 'auto',
          preventClicks:true,//滑动误触
          onClick:this.navBarTap,
        },
        swiperOptionBanner: {
          pagination: '.swiper-pagination',//控制按钮
          paginationClickable: true,
          autoplay: 2000,//自动播放
          loop: true,//循环播放
          autoplayDisableOnInteraction: false,
        },
        swiperOptionTabs: {//tab切换
//          notNextTick: true,
          onSlideChangeStart:this.tabsChange,
        },
        swiperIndex:0,//当前tab
        navBarList:[],
      }
    },
    components: {
      'footerComponent': Footer,
      'homeItem':HomeItem
    },
    computed: {},
    mounted() {
      this.getNavbarData();
    },
    methods: {
      navBarCenter:function (swiper) {
        console.log(swiper)
        console.log(swiper.clickedIndex)
        console.log(swiper.maxTranslate())

        const swiperWidth = swiper.container[0].clientWidth
        const maxTranslate = swiper.maxTranslate();
        const maxWidth = -maxTranslate + swiperWidth / 2
        let slide = swiper.slides[swiper.clickedIndex]
        let slideLeft = slide.offsetLeft
        let slideWidth = slide.clientWidth
        let slideCenter = slideLeft + slideWidth / 2
        // 被点击slide的中心点
        swiper.setWrapperTransition(300)

        if (slideCenter < swiperWidth / 2) {

          swiper.setWrapperTranslate(0)

        } else if (slideCenter > maxWidth) {

          swiper.setWrapperTranslate(maxTranslate)

        } else {

          let nowTlanslate = slideCenter - swiperWidth / 2

          swiper.setWrapperTranslate(-nowTlanslate)

        }
      },
      navBarTap:function () {
        const swiperNavbar = this.$refs.swiperNavbar.swiper; //导航栏
        const swiperTabs = this.$refs.swiperTabs.swiper; //切换内容
        this.navBarCenter(swiperNavbar);//导航栏居中
        this.swiperIndex=swiperNavbar.clickedIndex;//改变当前选中状态
        swiperTabs.slideTo(this.swiperIndex,300,false)//与tabs联动
      },
      tabsChange:function () {
        const swiperNavbar = this.$refs.swiperNavbar.swiper;
        const swiper = this.$refs.swiperTabs.swiper;
        this.swiperIndex=swiper.activeIndex;
        swiperNavbar.clickedIndex=swiper.activeIndex;
        this.navBarCenter(swiperNavbar);//导航栏居中
      },
      getNavbarData:function () {//获取导航信息
        let self_=this;
        this.http('get','index/getexplore',{},function (data) {
//          data =data.substr(1).substring(0, data.length - 2);
//          data = JSON.parse(data);
          self_.navBarList = data.result.cat;
        })
      }
    },
    watch: {}
  }
</script>

<style lang='scss' scoped>
  @import "../../style/common";

  #home {
    height: 100vh;
    overflow: scroll;
    #navBar {
      width: 100%;
      overflow: hidden;
      font: 16px/32px hiragino sans gb, microsoft yahei, simsun;
      border-bottom: 1px solid #f8f8f8;
      .swiper-slide {
        padding: 0 5px;
        letter-spacing: 2px;
        width: 2rem;
        text-align: center;
        transition: all .3s ease;
        display: block;
      }
      .active {
        transform: scale(1.1);
        color: #FF2D2D;
      }
    }
    .tabs {
      .swiper-container {
        .swiper-slide {
          height: 100vh;
          overflow: scroll;
        }
        .banner {
          .swiper-container {
            height: 4rem;
          }
        }
      }
    }
  }
</style>
