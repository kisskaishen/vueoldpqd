<template lang="html">
  <div id="addRefund" :class="[refundMethods?'hidden':'']">
    <div class="orderDetail">
      <span>订单信息</span>
      <p>退货编号：{{orderSn}}</p>
      <p>商品名称：{{orderInfo.order_info.goods_name}}</p>
      <p>支付金额：{{orderInfo.order_info.order_amount}}</p>
      <p>售后状态：{{orderInfo.order_info.order_service_str}}</p>
      <p>收货人：{{orderInfo.order_info.consignee}}</p>
      <p>收货地址：{{orderInfo.order_info.address_base}}{{orderInfo.order_info.address}}</p>
    </div>
    <div class="refundInfo">
      <div class="refundCommon bottomBorder" @click="refundMethods=true">
        <span class="title">
          <span>*</span>物流公司
        </span>
        <span >
          {{shippingName}}
          <img src="./images/rightArrow.png" alt="">
        </span>
      </div>
      <div class="bottomBorder refundMoney">
        <span class="title">
          <span>*</span>物流单号<span class="money">(请仔细核对物流单号)</span>
        </span>
        <input v-model="shippingOrder" placeholder="请输入物流单号">
      </div>
      <!-- <div class="refundCommon bottomBorder" @click="popupVisible=true">
        <span class="title">
          <span>*</span>退款理由
        </span>
        <span>
          {{refundReason}}
          <img src="./images/rightArrow.png" alt="">
        </span>
      </div> -->
      <div class="refundReason bottomBorder">
        <span>发货说明</span>
        <textarea v-model="description" placeholder="请输入问题可增加退款/退货的成功几率"></textarea>
      </div>
      <div class="upload">
        <span class="title">
          <span>*</span>上传凭证
        </span>
        <ul>
          <li v-for="(item,index) in imgs">
            <img :src="item" alt="">
            <img src="./images/delPic.png" alt="" class="del" @click="delImg(index)">
          </li>
          <li class="addPic" @click="clickUpload">
            <img src="./images/add.png" alt="">
          </li>
        </ul>
        <input  type="file" class="uploadImg" multiple="multiple" accept="image/gif,image/jpeg,image/jpg,image/png" @change="uploadImg"  ref='uploadImg' >
        <p>最多不超过4张照片</br>照片大小不超过5M，支持PNG、JPG格式</p>
      </div>
    </div>
    <button type="button" name="button" @click="upRefundData()">提交申请</button>
    <!-- <mt-popup
      v-model="popupVisible"
      position="bottom">
      <span>退款原因</span>
      <ul>
        <li @click="selected=1">
          <span>七天无理由退款</span>
          <span :class="[selected==1?'selected':'']"></span>
        </li>
        <li @click="selected=2">
          <span>商品破损</span>
          <span :class="[selected==2?'selected':'']"></span>
        </li>
        <li @click="selected=3">
          <span>拍错</span>
          <span :class="[selected==3?'selected':'']"></span>
        </li>
        <li @click="selected=4">
          <span>收到假货</span>
          <span :class="[selected==4?'selected':'']"></span>
        </li>
        <li @click="selected=5">
          <span>商品质量问题</span>
          <span :class="[selected==5?'selected':'']"></span>
        </li>
        <li @click="selected=6">
          <span>不想买了</span>
          <span :class="[selected==6?'selected':'']"></span>
        </li>
        <li @click="selected=7">
          <span>其他</span>
          <span :class="[selected==7?'selected':'']"></span>
        </li>
      </ul>
    </mt-popup> -->
    <mt-popup
      v-model="refundMethods"
      position="bottom">
      <span>物流公司选择</span>
      <ul>
        <li @click="shippingCode=item.shipping_code;shippingName = item.shipping_name" v-for="item in shippingList">
          <span>{{item.shipping_name}}</span>
          <span :class="[shippingCode==item.shipping_code?'selected':'']"></span>
        </li>
      </ul>
    </mt-popup>
  </div>
</template>

<script>
// import { Toast } from 'mint-ui';
import { getCookie } from '../../config/mUtils'
export default {
  name:'userSend',
  data(){
    return{
      shippingCode:'',
      shippingOrder:'',
      shippingName:'',
      description:'',
      refundMethods:false,
      // selected:'1',
      // refundMethodContext:'',
      // refundReason:'七天无理由退款',
      // methodSelected:'1',
      imgs:[],
      // type:this.$route.query.type,
      userId:getCookie('user_id'),
      orderId:this.$route.query.orderId,
      orderInfo:{},
      orderSn:this.$route.query.orderSn,
      shippingList:[],
    }
  },
  mounted(){
    // this.methodsReSet()
    this.getOrderData()
    this.getShippingList()
  },
  methods:{
    getShippingList(){
      this.http('get','index/shipping_list',{},(data) => {
        console.log(data)
        this.shippingList = data.result.shipping_list
        this.shippingCode = this.shippingList[0].shipping_code
        this.shippingName = this.shippingList[0].shipping_name
      })
    },
    // methodsReSet(){
    //   if(this.type == 1){
    //     this.refundMethodContext = '退款退货'
    //     this.methodSelected = '2'
    //   }else{
    //     this.refundMethodContext = '退款'
    //     this.methodSelected = '1'
    //   }
    // },
    clickUpload(){
      this.$refs.uploadImg.value = ''
      this.$refs.uploadImg.click()
    },
    uploadImg(e){
      // console.log(e.target.files)
      let fileImgs = e.target.files
      let parmas = {}
      console.log(fileImgs);
      if(fileImgs.length+this.imgs.length>4){
        this.Toast('最多不能超过四张照片')
        return
      }
      for(let key in fileImgs){
        if(!isNaN(fileImgs.length-key)){
          let objKey = 'picture['+key+']'
          if(fileImgs[key].size/1024/1024>5){
            this.Toast('图片大小不能超过5M');
            return
          }else{
            parmas[objKey] = fileImgs[key]
          }
        }
      }
      for(let key in parmas){
        console.log(key);
      }
      this.http('formdata','index/uploadimage',parmas,(data) => {
        this.imgs = this.imgs.concat(data.result)
        console.log(this.imgs);
      })
    },
    delImg(index){
      this.imgs.splice(index,1)
    },
    getOrderData(){
      this.http('get','user/order_detail',{
        user_id:this.userId,
        order_id:this.orderId
      },(data) => {
        this.orderInfo = data.result
      })
    },
    upRefundData(){
      if(this.shippingOrder==''){
        this.Toast('请填写物流单号')
        return
      }
      if(this.description==''){
        this.Toast('请填写发货说明')
        return
      }
      if(this.imgs.length==0){
        this.Toast('请上传凭证')
        return
      }
      this.http('post','user/order_service_delivery',{
        order_id:this.orderId,
        user_id:this.userId,
        shipping_code:this.shippingCode,
        shipping_name:this.shippingName,
        shipping_order:this.shippingOrder,
        description:this.description,
        proof_imgs:JSON.stringify(this.imgs)
      },(data) => {
        if(data.status==1){
          this.$router.push({
            name:'refundDetail',
            query:{
              orderId:this.orderId
            }
          })
        }else{
          this.Toast(data.msg)
        }
      })
    }
  },
  // watch:{
  //   selected(e){
  //     switch(e){
  //       case 1:
  //       this.refundReason = '七天无理由退款'
  //       break
  //       case 2:
  //       this.refundReason = '商品破损'
  //       break
  //       case 3:
  //       this.refundReason = '拍错'
  //       break
  //       case 4:
  //       this.refundReason = '收到假货'
  //       break
  //       case 5:
  //       this.refundReason = '商品质量问题'
  //       break
  //       case 6:
  //       this.refundReason = '不想买了'
  //       break
  //       case 7:
  //       this.refundReason = '其他'
  //       break
  //     }
  //   },
  //   methodSelected(e){
  //     switch(e){
  //       case 1:
  //       this.refundMethodContext = '退款'
  //       break
  //       case 2:
  //       this.refundMethodContext = '退款退货'
  //       break
  //       case 3:
  //       this.refundMethodContext = '换货'
  //       break
  //     }
  //   }
  // }
}
</script>

<style lang="scss">

#addRefund {
  padding-top: .15rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  .orderDetail {
    padding: .34rem .2rem .22rem .47rem;
    width: 7.5rem;
    // height: 2.6rem;
    background-color: #fff;
    // margin-bottom: .15rem;
    display: flex;
    flex-direction: column;
    span {
      font-size: .3rem;
      color: #313131;
      line-height: .31rem;
      padding-bottom: .36rem;
    }
    p {
      font-size: .24rem;
      color: #242424;
    }
  }
  .refundInfo {
    background-color: #fff;
    padding: 0 .2rem;
    margin-top: .2rem;
    width: 100vw;
    .refundMoney {
      height: 1.74rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 .3rem;
      .title {
         .money {
          font-size: .22rem;
          color: #7a7a7a;
          margin-left: .1rem;
        }
      }
      input {
        width: 100%;
        margin-top: .2rem;
        height: .4rem;
        padding-left: .25rem;
      }
    }
    .refundReason {
      height: 4rem;
      padding: .4rem .3rem;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      textarea {
        height: 2.7rem;
        width: 100%;
        resize: none;
        background-color: #f0f0f0;
        padding: .3rem;
      }
    }
    .upload {
      height:3.64rem;
      padding: .4rem .3rem .6rem .3rem;
      ul {
        display: flex;
        margin-top: .35rem;
        li {
          height: 1.12rem;
          width: 1.12rem;
          margin-right: .2rem;
          border-radius: .05rem;
          position: relative;
          img {
            width: 100%;
            height: 100%;
            border-radius: .05rem;
          }
          .del {
            position: absolute;
            top: -.1rem;
            right:-.1rem;
            height: .25rem;
            width: .25rem;
            border-radius: 0;
          }
        }
        .addPic {
          border: .01rem solid #DD1B1B;
          display: flex;
          justify-content: center;
          align-items: center;
          img {
            height: .3rem;
            width: .3rem;
          }
        }
      }
      .uploadImg {
        display: none;
      }
    }
    p {
      margin-top: .25rem;
      font-size: .22rem;
      color: #7a7a7a;
    }
  }
  .refundCommon {
    height: 1.13rem;
    padding: 0 .3rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span:last-child {
      font-size: .28rem;
      color: #212121;
      display: flex;
      align-items: center;
    }
    img {
      width: .15rem;
      margin-left: .25rem;
    }
  }
  .title {
    display: flex;
    align-items: center;
    color: #000;
    font-size: .3rem;
    span {
      margin-right: .1rem;
      color:#DD1B1B;
    }
  }
  .bottomBorder {
    border-bottom: .01rem solid #efefef;
  }
  button {
    margin-top: .6rem;
    margin-bottom: .5rem;
    width: 6.56rem;
    height: .72rem;
    background-color: #E02E24;
    color: #fff;
    font-size: .3rem;
  }
  .v-modal {
    opacity: .3;

  }
  .mint-popup-bottom{
    height: 8.1rem;
    width: 100vw;
    background-color: #fff;
    display: flex;
    padding: .35rem .4rem;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    >span {
      color: #212121;
      margin-bottom: .46rem;
      font-family: 'PingFang-SC-Medium';
    }
    ul {
      width: 100%;
      // display: flex;
      height: 6.4rem;
      overflow-y: scroll;
      // flex-direction: column;
      li {
        width: 100%;
        padding: 0 .2rem;
        height: .94rem!important;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span:first-child {
          font-size: .28rem;
          color: #212121;
          font-family: 'PingFang-SC-Regular';
        }
        span:last-child {
          height: .4rem;
          width: .4rem;
          border-radius: .2rem;
          border: .01rem solid #aaa;
        }
        .selected {
          background-color: #aaa;
        }
      }
      li+li {
        border-top: .01rem solid #d6d6d6;
      }
    }
  }
  // .refundMethods1 {
  //   height: 3.6rem;
  // }
  // .refundMethods2 {
  //   height: 2.6rem;
  // }
}
.hidden {
  height: 100vh;
  overflow: hidden;
}
</style>
