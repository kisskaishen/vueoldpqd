<template lang="html">
  <div id="addRefund" :class="[popupVisible?'hidden':'']">
    <div class="goodsInfo">
      <span>退款商品</span>
      <div class="">
        <span>
          <img :src="orderInfo.order_info.goods_img" alt="">
        </span>
        <span>
          {{orderInfo.order_info.goods_name}}
        </span>
      </div>
    </div>
    <div class="refundInfo">
      <div class="refundCommon bottomBorder" @click="refundMethods=true">
        <span class="title">
          <span>*</span>退款方式
        </span>
        <span >
          {{refundMethodContext}}
          <img src="./images/rightArrow.png" alt="">
        </span>
      </div>
      <div class="bottomBorder refundMoney">
        <span class="title">
          <span>*</span>退款额度<span class="money">(最高额度不超过￥{{orderInfo.order_info.order_amount}})</span>
        </span>
        <input v-model="refundMoney" placeholder="请输入退款金额">
      </div>
      <div class="refundCommon bottomBorder" @click="popupVisible=true">
        <span class="title">
          <span>*</span>退款理由
        </span>
        <span>
          {{refundReason}}
          <img src="./images/rightArrow.png" alt="">
        </span>
      </div>
      <div class="refundReason bottomBorder">
        <span>退款说明</span>
        <textarea v-model="refundText" placeholder="请输入问题可增加退款/退货的成功几率"></textarea>
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
    <mt-popup
      v-model="popupVisible"
      position="bottom">
      <span>退款原因</span>
      <ul>
        <li @click="refundReason=item" v-for="item in reasonList">
          <span>{{item}}</span>
          <span :class="[refundReason==item?'selected':'']"></span>
        </li>
      </ul>
    </mt-popup>
    <mt-popup
      :class="[type==1?'refundMethods1':'refundMethods2']"
      v-model="refundMethods"
      position="bottom">
      <span>退款方式</span>
      <ul>
        <li @click="methodSelected=1" v-if="type==2">
          <span>退款</span>
          <span :class="[methodSelected==1?'selected':'']"></span>
        </li>
        <li @click="methodSelected=2" v-if="type==1">
          <span>退货退款</span></span>
          <span :class="[methodSelected==2?'selected':'']"></span>
        </li>
        <li @click="methodSelected=3" v-if="type==1">
          <span>换货</span>
          <span :class="[methodSelected==3?'selected':'']"></span>
        </li>
      </ul>
    </mt-popup>
  </div>
</template>

<script>
// import { Toast } from 'mint-ui';
import { getCookie } from '../../config/mUtils'
export default {
  name:'addRefund',
  data(){
    return{
      refundMoney:'',
      refundText:'',
      popupVisible:false,
      refundMethods:false,
      selected:'1',
      refundMethodContext:'',
      refundReason:'',
      methodSelected:'1',
      imgs:[],
      type:this.$route.query.type,//1 收到货 2 未收到货
      userId:getCookie('user_id'),
      orderId:this.$route.query.orderId,
      orderInfo:{},
      reasonList:[],
    }
  },
  mounted(){
    this.methodsReSet()
    this.getOrderData()
  },
  methods:{
    methodsReSet(){
      if(this.type == 1){//收到货
        this.refundMethodContext = '退款退货'
        this.methodSelected = '2'
        this.reasonList = ['商品破损','商品错发/漏发','收到假货','退运费','商品与图片不符','七天无理由退货','未按照约定时间发货','未收到货','其他']

      }else{//未收到货
        this.refundMethodContext = '退款'
        this.methodSelected = '1'
        this.reasonList = ['拍错了/订单信息有误','不想要了','缺货','一直未发货']
      }
      this.refundReason = this.reasonList[0]
    },
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
      console.log(parseFloat(this.refundMoney).toString() == "NaN")
      console.log(this.refundMoney>this.orderInfo.order_info.order_amount)
      if(parseFloat(this.refundMoney).toString() == "NaN"||this.refundMoney > this.orderInfo.order_info.order_amount){
        this.Toast('请正确填写退款金额')
        return
      }
      if(this.refundText==''){
        this.Toast('请填写退款说明')
        return
      }
      if(this.imgs.length==0){
        this.Toast('请上传凭证')
        return
      }
      this.http('post','user/order_service',{
        order_id:this.orderId,
        user_id:this.userId,
        service_type:this.methodSelected,
        return_money:this.refundMoney,
        reason:this.refundReason,
        description:this.refundText,
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
  watch:{
    // selected(e){
    //   switch(e){
    //     case 1:
    //     this.refundReason = '七天无理由退款'
    //     break
    //     case 2:
    //     this.refundReason = '商品破损'
    //     break
    //     case 3:
    //     this.refundReason = '拍错'
    //     break
    //     case 4:
    //     this.refundReason = '收到假货'
    //     break
    //     case 5:
    //     this.refundReason = '商品质量问题'
    //     break
    //     case 6:
    //     this.refundReason = '不想买了'
    //     break
    //     case 7:
    //     this.refundReason = '其他'
    //     break
    //   }
    // },
    methodSelected(e){
      switch(e){
        case 1:
        this.refundMethodContext = '退款'
        break
        case 2:
        this.refundMethodContext = '退款退货'
        break
        case 3:
        this.refundMethodContext = '换货'
        break
      }
    }
  }
}
</script>

<style lang="scss">
.hidden {
  height: 100vh;
  overflow: hidden;
}
#addRefund {
  padding-top: .15rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  .goodsInfo {
    height: 2.34rem;
    background-color: #fff;
    width: 100vw;
    // margin: .15rem 0;
    padding: .3rem 1rem .15rem .4rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    >span {
      font-size: .3rem;
      color: #313131;
    }
    >div {
      display: flex;
      justify-content: space-between;
      span:first-child {
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        height: 1.35rem;
        width: 1.35rem;
        img {
          width:100%;
        }
      }
      span:last-child {
        width: 4.45rem;
        height: .8rem;
        overflow: hidden;
        font-size: .28rem;
        color: #292929;
      }
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
    height: 5.6rem;
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
      height: 4rem;
      overflow: scroll;
      li {
        width: 100%;
        padding: 0 .2rem;
        height: .94rem;
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
  .refundMethods1 {
    height: 3.6rem;
  }
  .refundMethods2 {
    height: 2.6rem;
  }
}
</style>
