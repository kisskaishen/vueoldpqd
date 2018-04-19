<template>
    <div id="goodsList" >
          <div class="goodsItem" v-for="(item,index) in goodsList" >
            <img v-lazy="item.original" alt="">
            <p>{{item.goods_name}}</p>
            <p>
              <span>￥{{item.prom_price}}</span>
              <span>{{item.prom}}人团</span>
            </p>
          </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
              goodsitems:this.goodsList,
            }
        },
      props:['goodsList'],
        mounted() {
          console.log(this.goodsList);
        },
        methods: {

        }
    }
</script>

<style lang='scss' scoped>
  @import "../../style/common";
  #goodsList {
    display: flex;
    flex-wrap: wrap;
    overflow: auto;
    .goodsItem {
      width: 50%;
      img {
        width: 100%;
      }
    }

  }
</style>
