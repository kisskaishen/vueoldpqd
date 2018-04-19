<template>
    <div id="platformInvolved">
      <p class="name">
        <span class="redColor">*</span><span>申请说明</span>
      </p>
      <div class="returnMsg">
        <textarea v-model="returnMsg" ></textarea>
        <span>0/100</span>
      </div>
      <p class="name">
        <span class="redColor">*</span><span>上传图片</span>
      </p>
      <div class="uploadImg">
        <input type="text" class="uploadImgInput">
        <div class="uploadImgItem">
          <img src="http://cdn.pinquduo.cn/14951018376.jpg" alt="">
          <img src="../../assets/images/refund_icon_delete@2x.png" alt="" class="imgDelete">
        </div>
        <div class="uploadImgBtn">
          <img src="../../assets/images/refund_icon_add@2x.png" alt="">
        </div>
      </div>
      <p class="uploadImgRules">最多不超过5张照片，照片大小不能超过5M。</p>
      <button>提交申请</button>
    </div>
</template>

<script>
    export default {
      name:'platformInvolved',
        data() {
            return {}
        },
        mounted() {

        },
        methods: {}
    }
</script>

<style lang='scss' scoped>
  @import "../../style/common";
  #platformInvolved {
    height: 100%;
    padding: 0 .2rem;
    background-color: #fff;
  .name {
    display: flex;
    align-items: center;
    height: .88rem;
    span {
      display: flex;
      align-items: center;
      height: .3rem;
      line-height:.3rem;
      font-size: .3rem;
      color: #000;
    }
    .redColor {
      color: #F61027;
      margin-right: .1rem;
      padding: .1rem 0 0 0;
    }
  }
  .returnMsg {
    position: relative;
    textarea {
      width: 100%;
      height: 3rem;
      border: .01rem solid #ccc;
      border-radius: .12rem;
      resize: none;
      padding: .25rem;
      font-size: .26rem;
      color: #000;
    }
    span {
      position: absolute;
      right: .25rem;
      bottom: .25rem;
      color: #ccc;
      font-size: .22rem;
    }
  }
  .uploadImg {
    display: flex;
    input {
      display: none;
    }
    div {
      height: 1.2rem;
      width: 1.2rem;
      border: .01rem solid #ccc;
      border-radius: .12rem;
      margin-right:.28rem;
      img {
        height: 100%;
        width: 100%;
        border-radius: .12rem;
      }
    }
    .uploadImgBtn {
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        height: .6rem;
        width: .6rem;
      }
    }
    .uploadImgItem {
      position: relative;
      .imgDelete {
        position: absolute;
        right: -.15rem;
        top:-.15rem;
        height: .3rem;
        width: .3rem;
      }
    }
  }
  .uploadImgRules {
    font-size: .26rem;
    color: #ccc;
    padding: .3rem 0 .7rem 0;
  }
  button {
    width: 100%;
    height: .8rem;
    border-radius: .12rem;
    background-color: #f61027;
    color: #fefefe;
    font-size: .3rem;
    line-height:.8rem;
  }
  }
</style>
