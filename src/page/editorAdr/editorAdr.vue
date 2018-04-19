<template>
    <div id="editorAdr">
      <div class="addItems">
        <div class="addItem" v-for="(item,index) in addressList" >
          <div class="addContent" @click="goToPay(item.address_id)">
            <p>
              <span>
                {{item.consignee}}
              </span>
              <span class="userName">
                {{item.mobile}}
              </span>
            </p>
            <p class="addInfo">
              {{item.address_base}}
            </p>
          </div>
          <div class="addOption">
            <div class="addOptionLeft">
              <span class="isDefault"  v-if="item.is_default==1">
                <img src="../../assets/images/site_icon_Selected@2x.png" alt="">
              </span>
              <span class="circle" v-else></span>
              <span class="isAddDefault" v-if="item.is_default==1" style="color: #F61027">
                默认地址
              </span>
              <span class="isAddDefault" v-else @click="setDefaultAdr(item.address_id)">
                设为默认
              </span>
            </div>
            <div class="addOptionRight">
              <div >
                <div>
                  <img src="../../assets/images/fastreply_icon_compile@2x.png" alt="">
                </div>
                <span @click="getProvince();dialogCtr='adrEditorDialog';consignee=item.consignee;mobile=item.mobile;area=item.address_base;address=item.address;provinceId=item.province;cityId=item.city;districtId=item.district;addressId=item.address_id">编辑</span>
              </div>
              <div class="delAdd">
                <div>
                  <img src="../../assets/images/fastreply_icon_delete@2x.png" alt="">
                </div>
                <span @click="delAddress(item.address_id)">删除</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="addAdr" @click="dialogCtr='adrEditorDialog';consignee='';mobile='';area='请选择地区';address='';provinceId=0;cityId=0;districtId=0;getProvince()">
        <span class="addIcon">
          <img src="../../assets/images/site_icon_add@2x.png" alt="">
        </span>
        <span >添加收货地址</span>
      </div>
      <div class="adrEditorDialog" v-if="dialogCtr=='adrEditorDialog'" @click.self="dialogCtr='';clearData()">
        <!--<span></span>-->
        <div class="dialogContent">
          <img class="close" src="" alt="">
          <p class="title">添加收货地址</p>
          <p class="adrBaseInfo">
            <input type="text" v-model="consignee" placeholder="名字">
            <input type="text" v-model="mobile" placeholder="电话" class="mobile">
          </p>
          <p class="area" @click="dialogCtr='adrSelectorDialog';">
            <span>{{area}}</span>
            <span class="rightArrow">
              <img src="../../assets/images/right_arrows@2x.png" alt="">
            </span>
          </p>
          <p class="address">
            <textarea type="text" v-model="address" placeholder="请填写详细街道地址"></textarea>
          </p>
          <p class="saveBtn">
            <button @click="saveAddress">保存</button>
          </p>
        </div>
      </div>
      <div class="adrSelectorDialog" @click.self="dialogCtr='';" v-if="dialogCtr=='adrSelectorDialog'">
        <div class="adrSelectorDialogContent">
          <div class="adrSelectorHead">
            <div class="areaSelector">
              <span :class="[selectorActive=='provinceOptions'?'selectorActive':'']" @click="selectorActive='provinceOptions'">{{province}}</span>
              <span :class="[selectorActive=='cityOptions'?'selectorActive':'']"  v-if="province!='请选择'" @click="selectorActive='cityOptions'">{{city}}</span>
              <span :class="[selectorActive=='districtOptions'?'selectorActive':'']"  v-if="city!='请选择'" @click="selectorActive='districtOptions'">{{district}}</span>
            </div>
            <span class="cancel" @click.self="dialogCtr=''">取消</span>
          </div>
          <div class="adrSelectorBody">
            <div class="Options">
              <div v-show="selectorActive=='provinceOptions'" class="Option" v-for="(item,index) in provinceOptions" @click="province=item.region_name;provinceId=item.region_id;selectorActive='cityOptions'">
                <span :class="[provinceId==item.region_id?'fontColor':'']">{{item.region_name}}</span>
                <span>
                  <img src="../../assets/images/right_arrows@2x.png" alt="">
                </span>
              </div>
              <div v-show="selectorActive=='cityOptions'" class="Option" v-for="(item,index) in cityOptions" @click="city=item.region_name;cityId=item.region_id;selectorActive='cityOptions';selectorActive='districtOptions'">
                <span :class="[cityId==item.region_id?'fontColor':'']">{{item.region_name}}</span>
                <span>
                  <img src="../../assets/images/right_arrows@2x.png" alt="">
                </span>
              </div>
              <div v-show="selectorActive=='districtOptions'" class="Option" v-for="(item,index) in districtOptions" @click="district=item.region_name;districtId=item.region_id;area=province+city+district;dialogCtr='adrEditorDialog'">
                <span :class="[districtId==item.region_id?'fontColor':'']">{{item.region_name}}</span>
                <span>
                  <img src="../../assets/images/right_arrows@2x.png" alt="">
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
  import {getCookie} from '../../config/mUtils'
  import {myToast} from '../../assets/js/toast'
  export default {
      name:'editorAdr',
        data() {
            return {
              userId:getCookie('user_id'),
              addressList:[],
              dialogCtr:'',
              query:this.$route.query,
              //                地址信息
              consignee:'',
              mobile:'',
              province:'请选择',
              city:'请选择',
              district:'请选择',
              provinceId:0,
              cityId:0,
              districtId:0,
              address:'',
              selectorActive:'provinceOptions',
              provinceOptions:[],
              cityOptions:[],
              districtOptions:[],
              area:'选择地区',
              addressId:''
            }
        },
        mounted() {
          this.getAddress()
        },
        methods: {
          getAddress:function () {
            let self_=this
            this.http('get','goods/getUserAddressList',{
              user_id:self_.userId
            },function (data) {
              self_.addressList = data.result.address
              console.log(data);
            })
          },
          delAddress:function (addressId) {
            let self_ = this;
            this.http('post','goods/delAddress',{
              user_id:getCookie('user_id'),
              address_id:addressId
            },function (data) {
              console.log(data);
              if(data.status==1){
                self_.addressList=[]
                self_.getAddress()
                myToast('删除成功')
              }
            })
          },
          getProvince:function () {
            let self_=this;
            if(this.provinceOptions.length==0){
              this.http('get','Area/areaList',{},function (data) {
                self_.provinceOptions = data.result.items
              })
            }
          },
          saveAddress:function (id) {
            let self_=this
            if(!id){
              id = '';
            }
            if(this.consignee==''){
              myToast('请填写收货人')
              return
            }
            if(this.mobile==''||!/^1\d{10}$/.test(this.mobile)){
              myToast('请填写正确手机号码')
              return
            }
            if(this.area=='请选择地区'){
              myToast('请选择收货地区')
              return
            }
            if(this.address==''){
              myToast('请填写详细地址')
              return
            }
            this.http('post','goods/addEidtAddress',{
              type:self_.addressId==''?2:1,
              user_id:getCookie('user_id'),
              address_id:self_.addressId,
              address_base:'',
              default:'',
              address:self_.address,
              mobile:self_.mobile,
              consignee:self_.consignee,
              province:self_.provinceId,
              city:self_.cityId,
              district:self_.districtId
            },function (data) {
              self_.addressId='';
              if(data.status==1){
                self_.addressList=[]
                self_.getAddress()
                self_.dialogCtr = ''
                self_.clearData()
                myToast('保存成功')
              }
            })
          },
          setDefaultAdr:function (id) {
            let self_=this;
            this.http('post','goods/setAddressDefault',{
              user_id:getCookie('user_id'),
              address_id:id
            },function (data) {
              if(data.status==1){
                self_.addressList.forEach(function (item,index) {
                  self_.addressList[index].is_default=0
                  if(item.address_id==id){
                    self_.addressList[index].is_default=1
                    myToast('设置成功')
                  }
                })
              }
            })
          },
          clearData:function () {
            console.log('清除成功');
            let self_=this
            self_.consignee=''
            self_.mobile=''
            self_.area=''
            self_.address=''
            self_.provinceId=0
            self_.cityId=0
            self_.districtId=0
            self_.province='请选择'
            self_.city = '请选择'
            self_.district = '请选择'
            self_.selectorActive = 'provinceOptions'
          },
          goToPay:function (id) {
            if(this.query.goods_id){
              if(this.query.prom_id!=0){
                location.href = "../topay.html?"
                  +'is_prom='+this.query.is_prom
                  +"&order_id="+this.query.order_id
                  +"&prom_id="+this.query.prom_id
                  +"&goods_id="+this.query.goods_id
                  +"&user_id="+this.query.user_id
                  +"&store_id="+this.query.store_id
                  +"&num="+this.query.num
                  +"&spec_key="+this.query.spec_key
                  +"&type="+this.query.type
                  +"&address_id="+id;
              }else {
                location.href = "../topay.html?"
                  +'is_prom='+this.query.is_prom
                  +"&goods_id="+this.query.goods_id
                  +"&user_id="+this.query.user_id
                  +"&store_id="+this.query.store_id
                  +"&num="+this.query.num
                  +"&spec_key="+this.query.spec_key
                  +"&is_prom="+this.query.is_prom
                  +"&type="+this.query.type
                  +"&address_id="+id;
              }
            }
          }
        },
      watch:{
        provinceId(val){
          let self_=this;
          this.http('get','Area/areaList',{
            parent_id:val,
          },function (data) {
            self_.cityOptions=[];
            self_.city = '请选择'
            self_.district = '请选择'
            self_.cityOptions=data.result.items
            self_.provinceOptions.forEach(function (item,index) {
              if(item.region_id==self_.provinceId){
                self_.province = item.region_name;
              }
            })
          })
        },
        cityId(val){
          let self_=this;
          let tepId=self_.districtId;
          self_.districtId = 0
          this.http('get','Area/areaList',{
            parent_id:val,
          },function (data) {
            self_.districtOptions=[];
            self_.district = '请选择'
            self_.districtOptions=data.result.items
//            self_.districtId = tepId
            self_.cityOptions.forEach(function (item,index) {
              if(item.region_id==self_.cityId){
                self_.city = item.region_name;
              }
            })
            self_.districtId = tepId
          })
        },
        districtId(){
          let self_ = this
          self_.districtOptions.forEach(function (item,index) {
            if(item.region_id==self_.districtId){
              self_.district = item.region_name;
            }
          })
        },
        dialogCtr(val){
          if(val==''){
            this.clearData()
          }
        }
      }
    }
</script>

<style lang='scss' scoped>
  @import "../../style/common";

  #editorAdr {
    height: 100%;
    .addItems {
      height: 100%;
      overflow: scroll;
      padding-bottom:1rem;

      .addItem {
        background-color: #fff;
        margin-bottom:.2rem;
        .addContent {
          padding: .3rem .2rem;
          border-bottom:1px solid #eee;
          font-size: .3rem;
          p {
            span {
              line-height:.3rem;
            }
          }
          .addInfo {
            margin-top:.3rem;
            font-size: .28rem;
          }
        }
        .addOption {
          font-size: .24rem;
          padding: .3rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .addOptionLeft {
            display: flex;
            align-items: center;
            span {
              font-size: .24rem;
              color:#999;
            }
            .isDefault {
              height: .26rem;
              width: .26rem;
              margin-right:.1rem;
              img {
                width: 100%;
                height: 100%;
              }
            }
            .circle {
              border: 1px solid #333;
              height: .26rem;
              width:.26rem;
              border-radius: .13rem;
              margin-right:.1rem;
            }
            .redFont {
              color: #F61027;
            }
          }
          .addOptionRight {
            display: flex;
            div {
              display: flex;
              margin-left:.3rem;
              align-items: center;
              span {
                font-size: .24rem;
                color: #999;
              }
              div {
                width: .3rem;
                height: .3rem;
                margin-right:.1rem;
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
          }
        }
      }
    }
    .addAdr {
      position: absolute;
      bottom: 0;
      left:0;
      height: .98rem;
      background-color: #F61027;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      vertical-align: middle;
      span {
        font-size: .3rem;
        line-height:.2rem;
        color:#fff;
      }
      .addIcon {
        display: flex;
        position: relative;
        width: .3rem;
        height: .3rem;
        margin-right:.15rem;
        img {
          width: 100%;
          height: 100%;
        }

      }
    }
    .adrEditorDialog {
      position: absolute;
      left: 0;
      top:0;
      width: 100%;
      height: 100%;
      background-color: rgba(0,0,0,.8);
      display: flex;
      justify-content: center;
      .dialogContent {
        position: relative;
        background-color: #fff;
        margin-top:2.6rem;
        height: 6rem;
        width: 6.8rem;
        border-radius: .3rem;
        padding: 0 .25rem;
        img {
          position: absolute;
        }
        p {
          height: 1.2rem;
          padding: 0 .15rem;
          border-bottom:1px solid #eee;
          font-size: .3rem;
          color: #999;
        }
        .title {
          text-align: center;
          line-height:1.2rem;
          font-size: .36rem;
          color: #333;
          /*line-height:;*/
        }
        .adrBaseInfo {
          display: flex;
          input {
            width: 50%;
            font-size: .3rem;
          }
          .mobile {
            padding-left:.42rem;
            border-left: 1px solid #eee;
          }
        }
        .area {
          display: flex;
          justify-content: space-between;
          align-items: center;
          span {
            color: #999;
          }
          .rightArrow {
            position: relative;
            width: .14rem;
            height: .24rem;
            img {
              width:100%;
              height: 100%;
            }
          }
        }
        .address {
          textarea {
            padding: .2rem 0;
            height: 100%;
            width: 100%;
            resize: none;
          }
        }
        .saveBtn {
          display: flex;
          justify-content: center;
          align-items: center;
          button {
            width: .9rem;
            height: .9rem;
            border-radius: .45rem;
            text-align: center;
            line-height:.9rem;
            background-color: #E20025;
            font-weight: 400;
            color: #fff;
          }
        }

      }
    }
    .adrSelectorDialog {
      position: absolute;
      left:0;
      top:0;
      z-index: 99999999999999;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: flex-end;
      background-color: rgba(0,0,0,.8);
      .adrSelectorDialogContent {
        height: 7.7rem;
        width: 100%;
        background-color: #fff;
        font-size: .3rem;
        .adrSelectorHead {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: .9rem;
          border-bottom:1px solid #eee;
          padding: 0 .3rem;
          span {
            margin: 0 .1rem;
          }
          .selectorActive {
            color: #E20025;
            border-bottom: 2px solid #E20025;
          }
          .cancel {
            color: #999;
          }
        }
        .adrSelectorBody {
          padding: 0 .2rem;
          .Options {
            height: 6.8rem;
            overflow: scroll;
            padding: 0 .1rem;
            .Option {
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: .9rem;
              border-bottom:1px solid #eee;
              span {
                img {
                  height: .3rem;
                }
              }
              .fontColor {
                color: #E20025;
              }
            }
          }
        }
      }
    }
  }
</style>
