<template>
    <div class="homeItem" v-infinite-scroll="loadMore"
         infinite-scroll-disabled="loading"
         infinite-scroll-distance="100">
        <div class="sort">
          <a v-for="(item,index) in homeItem.cat2" v-if="index<=6">
            <img v-lazy="item.img" alt="">
            <p>{{item.name}}</p>
          </a>
          <a>
            ...
          </a>
        </div>
      <goodsList :goodsList="goodsList"></goodsList>
    </div>
</template>

<script>
  import GoodsList from '../../../components/common/goodsList.vue'
    export default {
        data() {
            return {
              goodsList:[],
              currentpage:0,
              loading:false
            }
        },
        props:['homeItem'],
        mounted() {
//          console.log(this.homeItem);
        },
      components:{
          goodsList:GoodsList,
        },
        methods: {
          loadMore() {//无限加载
//            console.log(1);
            this.loading = true;
            console.log(this.loading);
            let self_=this;
            this.http('get','goods/getMore',{
              page:self_.currentpage+1,
              pagesize:20,
              id:self_.homeItem.id
            },function (data) {
//              data =data.substr(1).substring(0, data.length - 2);
//              data = JSON.parse(data);
//              console.log(data);
              self_.goodsList = self_.goodsList.concat(data.result.items);
              self_.currentpage=data.result.currentpage;
              if(self_.currentpage!==data.result.totalpage){
                self_.loading = false;
                console.log(self_.loading);
              }
            })
//            console.log(1);
          }
        }
    }
</script>

<style lang='scss' scoped>
    @import "../../../style/common";
  .homeItem {
    width: 100%;
    height: 100vh;
    overflow: auto;
    .sort {
      width:100%;
      display: flex;
      flex-wrap: wrap;
      a {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        width: 25%;
        height: 2rem;
        img {
          height: 1rem;
        }
        p {
          width: 100%;
          text-align: center;
        }
      }
    }
  }
</style>
