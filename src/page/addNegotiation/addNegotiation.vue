<template lang="html">
  <div class="addNegotiation">
    <div class="orderInfo">
      <p>订单信息</p>
      <div class="">
        <span>退货编号：</span>
        <p>{{orderInfo.order_info.order_sn}}</p>
      </div>
      <div class="">
        <span>商品名称：</span>
        <p>{{orderInfo.order_info.goods_name}}</p>
      </div>
      <div class="">
        <span>商品价格：</span>
        <p>{{orderInfo.order_info.order_amount}}</p>
      </div>
      <div class="">
        <span>订单状态：</span>
        <p>{{orderInfo.order_info.order_service_str}}</p>
      </div>
    </div>
    <div class="apply">
      <div class="text">
        <p>申请说明</p>
        <textarea v-model="applyText" placeholder="请输入问题可增加退款/退货的成功几率"></textarea>
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
    <button type="button" name="button" @click="updata()">提交申请</button>
  </div>
</template>

<script>
import { getCookie } from '../../config/mUtils'
export default {
  name:'addNegotiation',
  data(){
    return {
      userId:getCookie('user_id'),
      orderId:this.$route.query.orderId,
      orderInfo:{},
      applyText:'',
      imgs:[],
    }
  },
  mounted(){
    this.getData()
  },
  methods:{
    getData(){
      this.http('get','user/order_detail',{
        user_id:this.userId,
        order_id:this.orderId
      },(data) => {
        this.orderInfo = data.result
      })
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
        // console.log(this.imgs);
      })
    },
    delImg(index){
      this.imgs.splice(index,1)
    },
    updata(){
      if(this.applyText==''){
        this.Toast('请输入申请说明！')
        return
      }
      if(this.imgs.length==0){
        this.Toast('上传凭证')
        return
      }
      this.http('get','user/order_appeal',{
        user_id:this.userId,
        order_id:this.orderId,
        description:this.applyText,
        proof_imgs:JSON.stringify(this.imgs)
      },(data) => {
        if(data.status==1){
          this.$router.push({
            name:'refundDetail',
            query:{
              orderId:this.orderId
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss">
.addNegotiation {
  display: flex;
  flex-direction: column;
  align-items: center;
  .orderInfo {
    height: 2.65rem;
    width: 7.5rem;
    margin-top: .15rem;
    background-color: #fff;
    padding: .47rem .2rem .27rem .47rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    >p {
      font-size: .3rem;
      color: #313131;
    }
    >div {
      display: flex;
      width: 100%;
      justify-content: space-between;
      span {
        font-size: .24rem;
        color: #292929;
      }
      p {
        font-size: .24rem;
        color: #292929;
        width: 5.6rem;
      }
    }
  }
  .apply {
    background-color: #fff;
    padding: 0 .2rem;
    margin-top: .15rem;
    width: 7.5rem;
    .text {
      padding: .43rem .3rem;
      border-bottom: .01rem solid #EFEFEF;
      >p {
        font-size: .3rem;
        color: #313131;
        margin-bottom: .1rem;
      }
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
      >p {
        color: #7A7A7A;
        font-size: .22rem;
        margin-top: .26rem;
      }
    }
  }
  button {
    margin-top: .6rem;
    margin-bottom: .5rem;
    width: 6.56rem;
    height: .72rem;
    background-color: #E02E24;
    color: #fff;
    font-size: .3rem;
    border-radius: .05rem;
  }

}
</style>
