<template lang="html">
  <div class="redPacket">
    <div class="guanzhu">
      <span>了解物流信息，获取更多红包优惠券！</span>
      <span class="guanzhuBtn" @click='guanzhuDialogCtr=true'>关注</span>
    </div>
    <div class="guanzhuDialog" v-show="guanzhuDialogCtr" @click.self = 'guanzhuDialogCtr=false'>
      <div class="center">
        <img src="../../assets/images/qrcode.jpg" alt="">
        <div class="msg">
          <span>保存图片或微信搜索</span>
          <span>“拼趣多”关注公众号，</span>
          <span>了解物流信息，</span>
          <span>获取更多红包优惠券！</span>
          <img src="../../assets/images/share_arrows@2x.png" alt="">
        </div>
      </div>
    </div>
    <div class="myRedInfo">
      <div v-if="getOverFlag" class="top top1">
        <div class="lintop">
          <div class="pt30">
            <p class="c_red formTitle">{{selfRedPacketName}}</p>
            <p class="uselimit">满{{selfRedPacketCondition}}元可用</p>
          </div>
          <div class="">
            <p class="useMon c_red"><span class="prefix">¥</span> <span>{{selfRedPacketMoney}}</span></p>
          </div>
        </div>
        <div class="linbtm">
          <div class="c_cc">
            {{selfRedPacketEnd}}日过期
          </div>
          <div class="">
            <a class="c_cc" href="http://wx.pinquduo.cn/">去使用 ></a>
          </div>
        </div>
      </div>
      <div v-else="!getOverFlag" class="top top2" style="">
        <p><span>抢光了</span></p>
      </div>
      <div class="defaultWr"  v-if="!edit" style="background-color:#F6F6F6;">
        <!-- <span class="defaultInfo">红包已放入账号：{{phoneNum}}</span> <a href="javascript:;" @click="editchange">修改 ></a> -->
        <p><button type="button" name="usebtn" id="usebtn" ref="usebtn" @click="go">{{getOverFlag==true?"立即使用":"去商城抢红包"}}</button></p>
      </div>
      <div class="btm" v-else>
        <div class="usephoneWr">
          当前手机号 {{phoneNum}} 修改后下次领取红包时生效！
        </div>
        <div class="">
          <input ref="newphone" type="number" oninput="if(value.length>11)value=value.slice(0,11)" v-model="newphone"><button type="button" name="modify" @click="editphone">修改</button>
        </div>
      </div>

    </div>

    <div class="otherRedInfo">
      <p class="lineTitle">
        <span>其他人红包</span>
      </p>
      <ul >
        <li v-for="uselist in userRedPacket">
          <div class="leftInfo">
            <div class="imgWr">
              <img width="70" :src="uselist.head_pic" alt="">
            </div>
            <div class="userInfo">
              <p class="redtype">{{uselist.nickname}}</p>
              <p class="redTime">{{uselist.add_time}}</p>
            </div>
          </div>
          <div class="rigthMon"><span class="prefix">¥</span> <span class="useMon">{{uselist.amount}}</span></div>
        </li>
      </ul>
    </div>
    <div class="actPlat">
      <div class="lineTitle">
        <span>活动规则</span>
        <ul>
          <li>
            1.每名用户活动期间最多只能领用20次红包；
          </li>
          <li>
            2.领取的红包账号同下单账号为同一账号；
          </li>
          <li>
            3.使用红包需要在拼趣多平台用领取红包的手机号码注册；
          </li>
          <li>
            4.红包在订单结算的时候使用，每单仅能使用一张红包，不支持拆开使用；
          </li>
          <li>
            5.红包不支持提现；
          </li>
        </ul>
        </div>
    </div>
    <div class="shadow_s">
      <div class="" style="">
        <div class="close" style="">x</div>
        <div class="content">
          <p>抱歉！红包已领完</p>
          <p><a href="http://wx.pinquduo.cn/">去商城看看 ></a></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {myToast} from '../../assets/js/toast'
import {getCookie} from '../../config/mUtils'
export default {
  name:'redPacket',
  data(){
    return {
      phoneNum:"17688529554",
      phoneNum2:"17688529554",
      newphone:"",
      selfRedPacketName:"",
      selfRedPacketCondition:"0",
      selfRedPacketMoney:"0",
      selfRedPacketEnd:"0",
      selfRedPacket:{},
      userRedPacket:[],
      edit:false,
      getOverFlag:true,
      guanzhuDialogCtr:false
    }
  },
  created(){
    this.getItem();
  },
  methods:{
    editchange(){
      //this.$refs.newphone.value="";
      this.edit=true;
    },
    editphone(){
      //console.log(this.$refs.newphone);
      var re=/^1\d{10}$/
      if(!re.test(this.$refs.newphone.value)){
        myToast("请填写正确的手机号")
        return;
      }
      this.phoneNum=this.$refs.newphone.value;
      this.edit=false;
    },
    go(){
      location.href='../index.html'
    },
    getItem(){
      let _self=this;
      this.http('get','User/getReceiveRedPacket',{
        user_id:getCookie('user_id'),//88929
        share_code:_self.$route.query.share_code//371757
      },function (data) {
        console.log("dadadad",data);
        //data.result.name=null;
        if(data.status==1){
          _self.selfRedPacketCondition=data.result.condition;
          _self.selfRedPacketName=data.result.name;
          _self.selfRedPacketMoney=data.result.coupon_money;
          _self.selfRedPacketEnd=data.result.end_day;
        }else{
          myToast(data.msg);
          _self.getOverFlag=!_self.getOverFlag;
        }
      })

      this.http('get','User/orderRedPacket',{
        user_id:getCookie('user_id'),//88929
        share_code:_self.$route.query.share_code//371757
        // user_id:'',
        // share_code:'dNQTBhSChL32AnOjKyPfIIAbcih5pGJ7',
      },function (data) {
        //console.log("dadadad22",data);
        _self.userRedPacket=data.result.user_redpacket;
        // console.log(_self.userRedPacket)
       /* _self.selfRedPacketCondition=data.selfRedPacket.coupon_info.condition;
        _self.selfRedPacketName=data.selfRedPacket.name;
        _self.selfRedPacketMoney=data.selfRedPacket.coupon_money;
        _self.selfRedPacketEnd=data.selfRedPacket.end_day;*/
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .pt30{padding-top: .3rem}
  .c_red{color: #F61027;}
  .redPacket{
    min-height: 100%;
    background-color: #fff;
    padding: .2rem;
    box-sizing: border-box;
    margin-top: .88rem;
    .guanzhu {
      position: fixed;
      left: 0;
      top: 0;
      background-color: #F61027;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      border-radius: 0;
      height: .88rem;
      padding: 0 .2rem;
      span {
        color:#fff;
        font-size: .28rem
      }
      .guanzhuBtn {
        background-color: #fff;
        color: #F61027;
        height: .5rem;
        padding: .2rem;
        border-radius: .06rem;
        display: flex;
        align-items: center;
      }
    }
    .guanzhuDialog {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      border-radius: 0;
      background-color: rgba(0,0,0,.6);
      height: 100vh;
      width: 100vw;
      z-index: 99;
      justify-content: center;
      align-items: center;
      .center {
        width: 3.6rem;
        img {
          width:3.6rem;
        }
        .msg {
          position: relative;
          margin-top: .3rem;
          span {
            width: 100%;
            color: #fff;
            font-size: .28rem;
            display: block;
            text-align: center;
          }
          img {
            position: absolute;
            top: -.2rem;
            left: .2rem;
            width: .18rem;
            height: .5rem;
          }
        }
      }
    }
    .shadow_s{
      display: none;
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: #000;
      //opacity: .3;
      z-index: 9999999;
      &>div{
        position: absolute;top: 0;bottom: 0;left: 0;right: 0;margin: auto;width:80%;height:2rem;background-color:#8e8e8e;
      }
      .close{
        position:absolute;right:-.2rem;top:-.2rem;width:.4rem;height:.4rem;line-height:.35rem;text-align:center;color:#fff;border:1px solid #a5a5a5;border-radius:50%;
      }
      .content{
        text-align: center;
        padding-top: .5rem;
        p,a{
          font-size: .3rem;
        }
      }
    }
    &>div{
      margin-bottom: .2rem;
      padding: .2rem;
      background-color: #f6f6f6;
      box-sizing: border-box;

      border-radius: .14rem;
    }
    .myRedInfo{
      //height: 4.67rem;
      &>div{
        background-color: #fff;
        border-radius: .14rem;
        //display: flex;
        //padding: 0 .5rem;
      }
      .defaultWr{
        text-align: center;
        span,a{
          font-size: .3rem;
        }
        a{
          color: #F61027;
          margin-left: .2rem;
        }
        .defaultInfo{
          display: inline-block;
          margin: .2rem 0;
        }
        #usebtn{
          text-align: center;
          width: 100%;
          height: .8rem;
          font-size: .26rem;
          background-color: #F61027;
          color: #fff;
          border-radius: .04rem;
          margin: .2rem 0 0;
        }
      }
      .top{
        height: 2rem;
        &>div{
          display: flex;
          justify-content: space-between;
          padding:0 .5rem;
        }
        .lintop{
          //display: flex;
          height: 1.41rem;
          border-bottom: .01rem dashed #eee;
          .formTitle{
            font-size: .34rem;
          }
          .uselimit{
            font-size: .24rem;
          }
          .useMon{
            padding-top: .13rem;
            span{
              font-size: .8rem;
              color: red;
            }
            .prefix{
              font-size: .36rem;
            }
          }
        }
        .linbtm{
          height: .58rem;
          line-height: .58rem;
          .c_cc{
            color: #ccc;
            font-size: .26rem;
          }
        }
      }
      .top2{
        text-align:center;line-height:2rem;
        span{
          position: relative;
          font-size: .8rem;
          color: #e5e5e5;
          &:before{
            content: '';
            position: absolute;
            border-top: 2px solid #e5e5e5;
            right: 2.6rem;
            top: .52rem;
            width: 1.24rem;
          }
          &:after{
            content: '';
            position: absolute;
            border-top: 2px solid #e5e5e5;
            left: 2.6rem;
            top: .52rem;
            width: 1.24rem;
          }
        }
      }
      .btm{
        height: 2.2rem;
        padding: .32rem .5rem 0;
        .usephoneWr{
          margin-bottom: .2rem;
        }
        input{
          border: .01rem solid #ccc;
          border-radius: .14rem;
          width: 4.4rem;
          height: .6rem;
          margin-right: .1rem;
          padding-left:20px;
          box-sizing:border-box;
        }
        button{
          width: 1.2rem;
          height: .56rem;
          border-radius: .14rem;
          color: #fff;
          background-color: #f61027;
          font-size: .26rem;
          vertical-align: top;
        }
      }
    }
    .otherRedInfo{
      .lineTitle{
        text-align: center;
        margin-bottom: .2rem;
        span{
          position: relative;
          font-size: .32rem;
          &:before{
            content: '';
            position: absolute;
            border-top: 1px solid #ccc;
            right: 1.8rem;
            top: .2rem;
            width: 2.24rem;
          }
          &:after{
            content: '';
            position: absolute;
            border-top: 1px solid #ccc;
            left: 1.8rem;
            top: .2rem;
            width: 2.24rem;
          }
        }
      }
      ul{
        li{
          display: flex;
          justify-content: space-between;
          align-items: center;
          // padding: .2rem 0;
          height: 1.1rem;
          border-bottom: 1px solid #e7e7e7;
          &:last-child{
            border: none;
          }
          .leftInfo{
            display: flex;

            .imgWr{
              display: flex;
              width: .7rem;
              height: .7rem;
              border-radius: 50%;
              img{
                width: 100%;
                border-radius: 50%;

              }
            }
            .userInfo {
              margin-left: .16rem;
              .redtype{
                // margin-bottom: .1rem;
                // margin-top: .3rem;
                font-size: .28rem;
              }
              .redTime{
                color: #ccc;
                font-size: .24rem;
              }
            }
          }
          .rigthMon{
            // margin-top: .4rem;
            .prefix{
              color: #f61027;
              font-size: .22rem;
            }
            .useMon{
              color: #f61027;
              font-size: .5rem;
            }
          }
        }
      }
    }
    .actPlat{
      .lineTitle{
        text-align: center;
        span{
          position: relative;
          font-size: .32rem;
          &:before{
            content: '';
            position: absolute;
            border-top: 1px solid #ccc;
            right: 1.4rem;
            top: .2rem;
            width: 2.54rem;
          }
          &:after{
            content: '';
            position: absolute;
            border-top: 1px solid #ccc;
            left: 1.4rem;
            top: .2rem;
            width: 2.54rem;
          }
        }
      }
      ul{
        margin-top: .2rem;
        li{
          text-align: left;
          font-size: .26rem;
          color: #999;
        }
      }
    }
  }
</style>
