<template>
  <div id="lottery" :style="emStyle">
    <div class="box">
      <div  v-show='dialogCtr=="lottery"' :class="['content',bgiCtr?'change':'']" >
        <ul>
          <li v-for="(item,index) in imgArr">
            <img :src="item" alt="">
            <img src="../../assets/images/active.png" alt="" v-show='index==active' class="active">
            <img v-if='index==4&&!lotteryCtr' src="./images/抽奖按钮1.png" alt="">
            <span v-if='index==4' @click='rollCtr()' class="clickItem">剩余{{number}}次机会</span>
          </li>
        </ul>
      </div>
      <div class="result" v-if='dialogCtr=="result"'>
        <div :class="['resultBox',fatherProp.raffle_info.is_raffle==0?'resultBox1':'']" >
           <img :src="resultImg" alt="" v-if="fatherProp.raffle_info.is_raffle!=0">
            <span v-else class="none">
              <span  >很遗憾，未中奖～</span>
            </span>
          <span>
            <span>剩余{{number}}次机会</span>
          </span>
        </div>
        <div class="again" v-show = 'number!=0'>
          <div class="againBtn" @click = 'getGameInfo();'>
            <span>
              <!-- <img src="./images/再来一次.png" alt=""> -->
            </span>
          </div>
        </div>
      </div>
      <div class="close" @click="close">
        <img src="./images/关闭按钮.png" alt="">
      </div>
    </div>
  </div>
</template>
<script>
// import {get} from '../config/http'
import {getCookie} from '../../config/mUtils'
export default {
  name: 'lottery',
  data () {
    return {
      emStyle:{
        fontSize:100 * (document.documentElement.clientWidth / 750) + 'px'
      },
      imgArr:[],
      // close11:require('../../assets/images/close11.png'),
      active:'',
      count:5,//旋转圈数
      tempCount:1,
      speed:60,//旋转速度
      target:0,
      timer:'',
      dialogCtr:'lottery',
      lotteryCtr:true,
      resultImg:'',
      number:0,
      fatherProp:'',
      bgiCtr:false
    }

  },

  props:['lotteryShow','propsto'],
  mounted(){
      this.fatherProp = this.propsto
      // console.log('F:', this.fatherProp);
      // setInterval(() => {
      //   this.bgiCtr = !this.bgiCtr
      // },200)
  },
  methods:{
    close:function(){
        // console.log(11);
        this.$emit('hidden-dialog',false)
    },
    rollCtr:function(){
      if(this.lotteryCtr){
        this.getConfirmGift();
        // this.tempCount=1;
        // this.rolling(this.speed)
      }
      this.lotteryCtr = false
    },
    rolling:function(speed){
      let that = this
      let tempArr = [0,1,2,5,8,7,6,3]
      let i = 0
      this.timer = setInterval(() => {
        if(i==7){
          i = 0;
          that.tempCount ++
        }else{
          i++;
        }
        if(this.count==this.tempCount&&that.active==this.target){
          clearInterval(that.timer)
          setTimeout(() => {
            that.dialogCtr = 'result'
            that.lotteryCtr=true
          },400)
        }else{
          that.active = tempArr[i];
        }
      },speed)
    },
      getConfirmGift:function () {
        let that = this
        this.http('get','Activ/confirm_user_gift',{
          user_id:getCookie('user_id'),
          user_raffle_id:that.fatherProp.raffle_info.raffle_id
        },(data) => {
          that.fatherProp.raffle_info = data.result.raffle_info
          this.fatherProp.number = data.result.number
          this.tempCount=1;
          this.rolling(this.speed)
          // if(that.target!=1){
          //     that.number--;
          // }
          // that.dialogCtr = 'result'
          // that.lotteryCtr=true
        })
//           let that = this
//           get('Activ/confirm_user_gift',{
//               user_id:cookie.get('user_id'),
//               user_raffle_id:that.fatherProp.raffle_info.raffle_id
//           }).then(function(data){
// //              console.log(data);
//               if(that.target!=1){
//                   that.number--;
//               }
//               that.dialogCtr = 'result'
//               that.lotteryCtr=true
//           }).catch(function(err){
//               console.log(err);
//           })
      },
      getGameInfo:function(){
          let that = this
          this.http('get','Activ/get_game_info',{
            user_id:getCookie('user_id')
          },(data) => {
            that.fatherProp = data.result
            that.dialogCtr="lottery"

          })
      },

  },
  watch:{
    tempCount:function(val){
      // console.log(this.count-val);
      if(this.count-val==2){
        clearInterval(this.timer)
        this.rolling(120)
      }
      if(this.count-val==1){
        clearInterval(this.timer)
        this.rolling(220)
      }
    },
      fatherProp:{
          handler:function(val,oldVal) {
            // alert(val.number)
              // console.log(val);
              let that =this
              this.number = val.number
              // console.log(val.game_info);
              that.imgArr = []
              val.game_info.forEach((item,index) => {
                  if(index == 4){
                      that.imgArr.push(require('./images/抽奖按钮2.png'))
                  }
                  that.imgArr.push(item.img)
              })
              if(val.raffle_info.key>=4){
                  this.target = parseInt(val.raffle_info.key)+1
              }else{
                  this.target = val.raffle_info.key
              }
              this.resultImg = val.raffle_info.goods_url
              // console.log(this.target);
          },
          deep:true
      }

  },

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

  #lottery {
    position: fixed;
    top:0;
    left: 0;
    height: 100vh;
    width: 100vw;
    background-color: rgba(0,0,0,.5);

  }
  .box {
    /*bgc*/
    display: flex;
    flex-direction: column;
  }
  .content {
    height:7.8rem;
    width:6.36rem;
    padding-left: .6rem;
    margin-top: 1rem;
    margin-left: .3rem;
    background-image: url('./images/转盘底.png');
    background-size:100% 100%;
    box-sizing: border-box;
    padding-bottom: .4rem;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
  .change {
    background-image: url('./images/转盘底1.png');
  }
  ul {
    height: 5rem;
    width: 100%;
    /*padding: .08rem;*/
    margin: 0;
    width: 100%;
    /*margin-bottom: .03rem;*/
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 0 .36rem;
  }
  li {
    list-style:none;
    display: flex;
    height: 1.58rem;
    width: 1.58rem;
    /*margin-right: .06rem;*/
    margin-bottom: .06rem;
    position: relative;
  }
  li>img {
    height: 100%;
    width: 100%;
    position: absolute;
    left: 0;
    top:0;
  }
  .clickItem {
    left: 0;
    top: 0;
    z-index: 9999;
    position: absolute;
    font-size: .19rem;
    color:#fff;
    height: 100%;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    padding-bottom: .1rem;
    box-sizing: border-box;
  }
  .active {
    position: absolute;
  }
  .result {

  }
  .resultBox {
    box-sizing: border-box;
    height: 3.35rem;
    width: 5.5rem;
    margin-left: .69rem;
    margin-top: 2.43rem;
    /*background-color: #000;*/
    background-image: url('./images/中奖.png');
    background-size:100% 100%;
    display: flex;
    flex-direction: column;
    padding-left: .4rem;
    /*justify-content: flex-end;*/
    align-items: center;
  }
  .resultBox1 {
    background-image: url('./images/未中奖.png')!important;
  }
  .resultBox>img {
    height: 1.2rem;
    width: 1.94rem;
    margin-top: 1.35rem;
  }
  .resultBox>.none {
    display: flex;
    color: #fff;
    height: 1.35rem;
    width: 2.19rem;
    margin-top: 1.04rem;
    justify-content: center;
    align-items: center;
  }
  .resultBox>.none>span {
    font-size: .24rem;
    color:#fff;
  }
  .resultBox>span:last-child {
    margin-top: .14rem;
    height: .35rem;
    padding: 0 .19rem;
    border-radius: .05rem;
    display: flex;
    align-items: center;
  }
  .resultBox>span>span {
    color:#fff;
    font-size: .2rem;
    font-family: 'PingFang-SC-Regular';
  }
  .again {
    display: flex;
    justify-content: center;
    margin-top: .3rem;
  }
  .againBtn {
    height:.65rem;
    width: 3rem;
    background-image: url('./images/再来一次.png');
    background-size:100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /*.againBtn>img {

  }*/
  .close {
    display: flex;
    justify-content: center;
    margin-top: .48rem;
  }
  .close>img {
    height: .65rem;
    width: .65rem;
  }
</style>
