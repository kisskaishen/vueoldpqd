<template lang="html">
  <div class="Negotiation">
    <div class="" v-for="item in data">
      <div class="roler">
        <span>
          <img :src="item.operate_role_info.role_logo" alt="">
        </span>
        <p>
          <span>{{item.operate_role_info.role_name}}</span>
          <span>{{formatDate(item.create_time)}}</span>
        </p>
      </div>
      <p class="title" v-if="item.operate_title">{{item.operate_title}}</p>
      <div class="item" v-if='item.operate_type_str'>
        <span>
          回复
        </span>
        <p>{{item.operate_type_str}}</p>
      </div>
      <div class="item" v-if='item.shipping_name'>
        <span>
          物流公司
        </span>
        <p>{{item.shipping_name}}</p>
      </div>
      <div class="item" v-if='item.shipping_order'>
        <span>
          物流单号
        </span>
        <p>{{item.shipping_order}}</p>
      </div>
      <div class="item" v-if="item.service_type">
        <span>
          类型
        </span>
        <p>{{item.service_type}}</p>
      </div>
      <div class="item" v-if='item.return_money'>
        <span>
          金额
        </span>
        <p>{{item.return_money}}</p>
      </div>
      <div class="item" v-if='item.reason'>
        <span>
          原因
        </span>
        <p>{{item.reason}}</p>
      </div>
      <div class="item" v-if='item.description'>
        <span>
          说明
        </span>
        <p>{{item.description}}</p>
      </div>
      <div class="item imgs" v-if='item.proof_imgs' >
        <span>
        </span>
        <p>
          <img :src="Item" alt="" v-for="Item in item.proof_imgs">
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import { getCookie } from "../../config/mUtils"
export default {
  name:'Negotiation',
  data(){
    return{
      userId:getCookie('user_id'),
      data:[],
    }
  },
  mounted(){
    this.getData()
  },
  methods:{
    getData(){
      this.http('get','user/order_service_history',{
        user_id:this.userId,
        order_id:this.$route.query.orderId
        // user_id:this.userId,
        // order_id:this.$route.query.orderId
      },(data) => {
        console.log(data)
        this.data = data.result.service_history
      })
    },
    formatDate(nS){//转换时间
      // return new Date(parseInt(nS) * 1000).toLocaleString().replace(/年|月/g, "-").replace(/日/g, " ");
      // newSimpleDateFormat("yyyy-MM-dd HH:mm:ss").
      return (new Date(nS*1000)).toLocaleString().replace(/\//g,'-').replace("上午",'').replace('下午','')
    },
  }
}
</script>

<style lang="scss">
.Negotiation {
  >div {
    margin-top: .15rem;
    padding: .34rem .69rem .35rem .37rem;
    background-color: #fff;
    .roler{
      display: flex;
      height: .65rem;
      margin-bottom: .35rem;
      >span {
        height: .65rem;
        width: .65rem;
        border-radius: 50%;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          width: 100%;
        }
      }
      p {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
        span:first-child {
          font-size: .32rem;
          color: #313131;
          line-height: .32rem;

        }
        span:last-child {
          font-size: .26rem;
          color: #AEAEAE;
          line-height: .26rem;
        }
      }
    }
    >p {
      font-size: .28rem;
      color: #292929;
    }
    .item {
      display: flex;
      span {
        width: 1.4rem;
        font-size: .28rem;
        color: #292929;
      }
      p {
        width: 5.2rem;
        font-size: .28rem;
        color: #292929;
      }
    }
    .imgs {
      margin-top: .2rem;
      p {
        img {
          height: 1.24rem;
          width: 1.24rem;
          border-radius: .05rem;
          margin-right: .14rem;
        }
      }
    }
  }
}
</style>
