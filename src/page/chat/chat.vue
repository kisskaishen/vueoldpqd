<template>
  <div id="chat" >
    <div class="chatMsgItems " @scroll="loadingMore($event)">
      <!--消息内容-->
      <div class="loadingMore" >
        <img src="../../assets/images/loading@2x.png" alt="" v-if="loadingMoreCtr&&pageNum!=1">
        <span v-if="pageNum==1">没有更多消息了</span>
      </div>
      <div class="chatMsgItem" v-for="(item,index) in msgData">
        <p class="chatTime" v-if="index==0">
          {{timestampFormat(item.ext.time)}}
        </p>
        <p class="chatTime" v-if="index>0&&item.ext.time-msgData[index-1].ext.time>60">
          {{timestampFormat(item.ext.time)}}
        </p>
        <div v-if="!item.goodsLink" :class="['chatMsg',item.to!=userId?'send':'']">
          <div class="headPic">
            <img :src="item.ext.senderUser.avatar" alt="" v-if="item.to!=userId">
            <img :src="item.ext.senderUser.avatar" alt="" v-else>
          </div>
          <div :class="['chatMsgBox',item.ext.goods||item.url?'whiteBackground':'']">
            <!--商品消息-->
            <a class="goodsContent" :href="item.ext.goods.goods_share_url" v-if="item.ext.goods">
              <div class="goodsContentPic">
                <img :src="item.ext.goods.original" alt="">
              </div>
              <div class="goodsContentInfo">
                <p class="goodsContentName ellipsis">
                  {{item.ext.goods.goods_name}}
                </p>
                <p class="goodsContentBottom">
                  ￥<span class="goodsContentPrice">{{item.ext.goods.prom_price}}</span>
                  <span class="goodsContentProm">{{item.ext.goods.prom}}人团</span>
                </p>
              </div>
            </a>
           <!--文字消息-->
            <pre class="chatMsgText" v-if="item.data&&!item.ext.goods&&!item.ext.autoReply">{{item.data}}</pre>
            <!--图片消息-->
            <div class="img" v-if="item.url">
              <img :src="item.url" alt="" class="widthImg" v-if="item.ext.imageSize.width>item.ext.imageSize.height&&item.ext.imageSize.width>4.2*fontSize" >
              <img :src="item.url" alt="" class="heightImg" v-if="item.ext.imageSize.width<item.ext.imageSize.height&&item.ext.imageSize.height>4.2*fontSize">
              <img :src="item.url" alt="" class="autoImg" v-else>
            </div>
            <!--自动回复-->
            <div class="autoReply" v-if="item.ext.autoReply">
              <div class="autoReplyTitle">
                  {{item.data}}
              </div>
              <div class="autoReplyItems" >
                <div class="autoReplyItem" v-for="(i ,index) in item.ext.autoReply" @click="textMsg=i.title;sendText({type:'autoReply',autoReplyId:i.id})">
                  {{i.title}}
                </div>
              </div>
            </div>
          </div>
          <div class="loadingImg">
            <img src="../../assets/images/loading.gif" alt="" v-if="item.loading">
            <img src="../../assets/images/gantanhao.png" alt="" v-if="item.sendFinished">
          </div>
        </div>
        <!--商品链接-->
        <a class="goodsLink" v-if="item.goodsLink">
          <div class="goodsPic">
            <img :src="item.ext.goods.original" alt="">
          </div>
          <div class="goodsInfo">
            <p class="goodsName ellipsis">
              {{item.ext.goods.goods_name}}
            </p>
            <p class="goodsInfoBottom">
              <span class="goodsInfoBottomRight">
                ￥<span class="goodsPrice">{{item.ext.goods.prom_price}}</span>
              <span class="promNum">{{item.ext.goods.prom}}人团</span>
              </span>
              <span class="goodsInfoBottomLeft" @click="sendText({type:'goods'})">发送链接</span>
            </p>
          </div>
        </a>
      </div>
    </div>
    <div class="msgSendBox" ref='inputBox'>
      <textarea v-model="textMsg" placeholder="请输入您的消息" ref="sendImgInput" @focus='inputCumulative()'></textarea>
      <input type="file" id="images" accept="image/gif, image/jpg,image/png,image/bmp" @change="sendImg" >
      <div class="send">
        <transition name="fade" mode="out-in">
          <img src="../../assets/images/chat_icon_photograph@2x.png" alt="" v-if="textMsg==''" @click="$refs.sendImgInput.value=null;$refs.sendImgInput.click()">
          <button v-else @click="sendText()">发送</button>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import {getCookie} from '../../config/mUtils'
  import {md5} from '../../config/md5.min'
  export default {
    data() {
      return {
        conn: new WebIM.connection({//环信初始化
          https: WebIM.config.https,
          url: WebIM.config.xmppURL,
          isAutoLogin: WebIM.config.isAutoLogin,
          isMultiLoginSessions: WebIM.config.isMultiLoginSessions
        }),
//        loading图
        loadingImg:'./src/assets/images/loading.gif',
        fontSize:document.documentElement.style.fontSize.split('px')[0],
//        买家信息
        userId:getCookie('user_id'),
        userLogo:getCookie('head_pic'),
        userName:decodeURI(getCookie('user_name')),
//        商家信息
        storeId:this.$route.query.storeId,
        storeLoge:'',
        storeName:'',
//        消息数据
        msgData:[],
        goodsInfo:{},
        textMsg:'',
//        加载更多控制
        loadingMoreCtr:false,
//        滚动控制
        scrollEnabled:true,
//        历史消息
        page:'',
        pageNum:'',
        unreadList:{}
      }
    },
    mounted() {
      // 清空localStorage存储
      if (localStorage.getItem('chat') != 5.0) {
        localStorage.clear();
        localStorage.setItem('chat', '5.0')
      }
      // 从localStorage中拉取未读消息列表
      this.unreadList=JSON.parse(localStorage.getItem('unreadList'))||{};
      console.log(this.unreadList['store' + this.storeId]);
      this.unreadList['store'+this.storeId]=0;
      // 将未读信息列表保存在localStorage中
      localStorage.setItem('unreadList',JSON.stringify(this.unreadList))
      //获取历史聊天记录
      this.getHistoryChat();
      //获取商家信息
      this.getStoreInfo()
      sessionStorage.setItem("need-refresh", true);
    },
    methods: {
      getHistoryChat:function () {//拉取历史聊天记录
        let self_ = this;
//        判断当前是否有消息
        let time = '';
        if(this.msgData.length>0){
          time = this.msgData[0].ext.time;
        }
        this.http('get','Chat/query',{
          storeId: self_.storeId,
          userId: self_.userId,
          timestamp: time,
          page: 1,
        },function (data) {
          console.log(data);
          self_.page = data.page
          self_.pageNum = data.pageNum
          if(self_.msgData.length==0){
            console.log('准备调用环信');
            self_.msgData=data.list.concat(self_.msgData)
            self_.goBottom()
            self_.contactHX()
          }else{
            let msgBoxHeight = document.querySelector('.chatMsgItems ').scrollHeight;
            self_.msgData=data.list.concat(self_.msgData)
            self_.$nextTick(() => {
              console.log(document.querySelector('.chatMsgItems  ').scrollHeight);
              document.querySelector('.chatMsgItems  ').scrollTop = document.querySelector('.chatMsgItems  ').scrollHeight-msgBoxHeight;
            })
          }
          self_.loadingMoreCtr = false;
          self_.scrollEnabled = true
        })
      },
      contactHX:function () {
        let self_ = this
        console.log('调用环信');
//        环信回调监听
        this.conn.listen({
          onOpened: function ( message ) {          //连接成功回调
            // 如果isAutoLogin设置为false，那么必须手动设置上线，否则无法收消息
            // 手动上线指的是调用conn.setPresence(); 如果conn初始化时已将isAutoLogin设置为true
            // 则无需调用conn.setPresence();
            console.log('连接成功');
          },
          onClosed: function ( message ) {},         //连接关闭回调
          onTextMessage: function ( message ) {
            self_.dealMsg(message)
//            console.log(message);
//            self_.magData = self_.msgData.push(message)
          },    //收到文本消息
          onEmojiMessage: function ( message ) {},   //收到表情消息
          onPictureMessage: function ( message ) {
            self_.dealMsg(message)
          }, //收到图片消息
          onCmdMessage: function ( message ) {},     //收到命令消息
          onAudioMessage: function ( message ) {},   //收到音频消息
          onLocationMessage: function ( message ) {},//收到位置消息
          onFileMessage: function ( message ) {},    //收到文件消息
          onVideoMessage: function (message) {
            var node = document.getElementById('privateVideo');
            var option = {
              url: message.url,
              headers: {
                'Accept': 'audio/mp4'
              },
              onFileDownloadComplete: function (response) {
                var objectURL = WebIM.utils.parseDownloadResponse.call(conn, response);
                node.src = objectURL;
              },
              onFileDownloadError: function () {
                console.log('File down load error.')
              }
            };
            WebIM.utils.download.call(conn, option);
          },   //收到视频消息
          onPresence: function ( message ) {},       //处理“广播”或“发布-订阅”消息，如联系人订阅请求、处理群组、聊天室被踢解散等消息
          onRoster: function ( message ) {},         //处理好友申请
          onInviteMessage: function ( message ) {},  //处理群组邀请
          onOnline: function () {},                  //本机网络连接成功
          onOffline: function () {},                 //本机网络掉线
          onError: function ( message ) {},          //失败回调
          onBlacklistUpdate: function (list) {       //黑名单变动
            // 查询黑名单，将好友拉黑，将好友从黑名单移除都会回调这个函数，list则是黑名单现有的所有好友信息
            console.log(list);
          },
          onReceivedMessage: function(message){},    //收到消息送达客户端回执
          onDeliveredMessage: function(message){},   //收到消息送达服务器回执
          onReadMessage: function(message){},        //收到消息已读回执
          onCreateGroup: function(message){},        //创建群组成功回执（需调用createGroupNew）
          onMutedMessage: function(message){}        //如果用户在A群组被禁言，在A群发消息会走这个回调并且消息不会传递给群其它成员
        });
//        token登陆环信
        var options = {
          apiUrl: WebIM.config.apiURL,
          user: getCookie('user_id'),
          pwd: md5(getCookie('user_id') + 'pinquduo'),
          appKey: WebIM.config.appkey,
          success: function (token) {
            console.log('登陆成功');
            self_.getAutoReplyList();
          },
          error: function(){
          }
        };
        this.conn.open(options);
      },
      getAutoReplyList:function () {
        let self_ = this;
        this.http('get','Appreply/getReply',{
          user_id:self_.userId,
          store_id:self_.storeId
        },function (data) {
          self_.getGoodsInfo()
        })
      },
      getGoodsInfo:function () {//拉取商品信息
        let self_ = this;
        if(!self_.$route.query.goodsId){
          return
        }
          this.http('get','Goods/getDetaile',{
              goods_id:self_.$route.query.goodsId
          },function (data) {
            let ext = self_.setExt()
            ext.goodsLink=true
            ext.goods = {
              goods_id:data.result.goods_id,
              goods_name:data.result.goods_name,
              goods_share_url:data.result.goods_share_url,
              original:data.result.original,
              original_img:data.result.original_img,
              prom:data.result.prom,
              prom_price:data.result.prom_price
            }
            self_.goodsInfo = ext.goods
            let msgItemTep = {
              ext:ext,
              goodsLink:true
            }
            self_.msgData = self_.msgData.concat(msgItemTep)
            self_.goBottom();
          })
      },
      getStoreInfo:function () {
        let self_ = this
        this.http('get','Chat/getStoreInfo',{
          store_id:self_.storeId
        },function (data) {
          self_.storeName=decodeURI(data.result.store_name);
          self_.storeLogo=data.result.store_logo;
        })
      },
      setExt:function () {//设置消息体
        let ext = {
          recevierUser:{
            avatar:this.storeLogo,
            userid:'store'+this.storeId,
            username:this.storeName
          },
          senderUser:{
            avatar:this.userLogo,
            userid:this.userId,
            username:this.userName
          },
          time:parseInt(new Date().getTime() / 1000),
          terminal:'w'
        }
        return ext;
      },
      sendText:function (obj) {
        console.log(1);
        let self_ = this;
        let ext = this.setExt();
        if(obj){
          if(obj.type=='autoReply'){//自动回复
            ext.autoReplyId = obj.autoReplyId
          }
          if(obj.type=='goods'){//发送商品消息
            ext.goods=this.goodsInfo
          }
        }
//        创建临时消息
        let tepMsgId = parseInt(new Date().getTime() / 1000)
        let msgTep = {
          data:this.textMsg,
          to:'store'+this.storeId,
          from:this.userId,
          ext:ext,
          id:tepMsgId,
          loading:true,
          sendFinished:false
        }
        console.log(msgTep);
//        清空聊天输入框
        this.textMsg = ''
        this.msgData = this.msgData.concat(msgTep)
        this.goBottom();
        var sendPrivateText = function () {
          var id = self_.conn.getUniqueId();
          // 生成本地消息id
          var msg = new WebIM.message('txt', id);      // 创建文本消息
          msg.set({
            msg: msgTep.data,                  // 消息内容
            to: 'store'+self_.storeId,                          // 接收消息对象（用户id）
            roomType: false,
            ext:ext,
            success: function (id, serverMsgId) {
              console.log('send private text Success');
              for (let i = self_.msgData.length-1; i >= 0; i--) {
                if(self_.msgData[i].id==tepMsgId){
                  self_.msgData[i].loading=false
                  self_.msgData[i].id=serverMsgId
                  return
                }
              }
            },
            fail: function(e){
              console.log("Send private text error");
              for (let i = self_.msgData.length-1; i >= 0; i--) {
                if(self_.msgData[i].id==tepMsgId){
                  self_.msgData[i].sendFinished=true
                  self_.msgData[i].loading=false
                  return
                }
              }
            }
          });
          msg.body.chatType = 'singleChat';
          self_.conn.send(msg.body);
        };
        sendPrivateText();
      },
      sendImg:function () {//发送图片
        let self_ = this;
        // 单聊发送图片消息
        var sendPrivateImg = function () {
          var id = self_.conn.getUniqueId();                   // 生成本地消息id
          var msg = new WebIM.message('img', id);        // 创建图片消息
          var input = document.getElementById('images');  // 选择图片的input
          var file = WebIM.utils.getFileUrl(input);      // 将图片转化为二进制文件
          var allowType = {
            'jpg': true,
            'gif': true,
            'png': true,
            'bmp': true
          };
          if (file.filetype.toLowerCase() in allowType) {
//            设置临时消息
            let ext = self_.setExt();
            let tepMsgId = parseInt(new Date().getTime() / 1000)
            ext.imageSize = self_.imageSize(self_.$refs.sendImgInput)
            let msgTep = {
              url:file.url,
              to:'store'+self_.storeId,
              from:self_.userId,
              ext:ext,
              id:tepMsgId,
              loading:true,
              sendFinished:false
            }
            self_.msgData = self_.msgData.concat(msgTep)
            self_.goBottom()
            var option = {
              apiUrl: WebIM.config.apiURL,
              file: file,
              ext:ext,
              to: 'store'+self_.storeId,                       // 接收消息对象
              roomType: false,
              chatType: 'singleChat',
              onFileUploadError: function () {      // 消息上传失败
                console.log('onFileUploadError');
                for (let i = self_.msgData.length-1; i >= 0; i--) {

                  if(self_.msgData[i].id==tepMsgId){
                    self_.msgData[i].sendFinished=true
                    self_.msgData[i].loading=false
                    return
                  }
                }
              },
              onFileUploadComplete: function () {   // 消息上传成功
//                console.log('onFileUploadComplete');
              },
              success: function (e,id) {                // 消息发送成功
                console.log('Success');
                for (let i = self_.msgData.length-1; i >= 0; i--) {
                  if(self_.msgData[i].id==tepMsgId){
                    self_.msgData[i].loading=false
                    self_.msgData[i].id=id
                    return
                  }
                }
              },
              flashUpload: WebIM.flashUpload
            };
            msg.set(option);
            self_.conn.send(msg.body);
          }
        };
        sendPrivateImg();
      },
      imageSize:function (file) {
        let render = new FileReader;
        let imageSize = {}
        render.onload = function (evt) {
          let image = new Image();
          image.src = evt.target.result
          image.onload = function () {
            imageSize.height = this.height
            imageSize.width = this.width
          }
        }
        render.readAsDataURL(file.files[0]);
        return imageSize
      },
      dealMsg:function (message) {//处理收到的消息
        console.log(message);

        if(message.from=='store'+this.storeId||message.to=='store'+this.storeId){//当前对话的信息
          this.msgData = this.msgData.concat(message)
          this.goBottom();
        }else {
          // 保存未读消息的状态
          if(message.from!='store'+this.storeId){
            if(!this.unreadList[message.from]){
              this.unreadList[message.from]=1;
            }else{
              this.unreadList[message.from]=this.unreadList[message.from]+1;
            }
          }
          // 将未读信息列表保存在localStorage中
          localStorage.setItem('unreadList',JSON.stringify(this.unreadList))
        }

      },
      loadingMore:function (event) {//加载更多
        this.loadingMoreCtr = true
        if(event.target.scrollTop < 20&&this.page!=this.pageNum&&this.scrollEnabled){
          this.scrollEnabled = false
          this.getHistoryChat();
        }
      },
      timestampFormat: function (timestamp) {//时间戳转换
        if (isNaN(timestamp) || timestamp == 0) {
          return '';
        }
        ;

        function zeroize(num) {
          return (String(num).length == 1 ? '0' : '') + num;
        }

        var curTimestamp = parseInt(new Date().getTime() / 1000); //当前时间戳
        var timestampDiff = curTimestamp - timestamp; // 参数时间戳与当前时间戳相差秒数

        var curDate = new Date(curTimestamp * 1000); // 当前时间日期对象
        var tmDate = new Date(timestamp * 1000);  // 参数时间戳转换成的日期对象
        var Y = tmDate.getFullYear(), m = tmDate.getMonth() + 1, d = tmDate.getDate();
        var H = tmDate.getHours(), i = tmDate.getMinutes(), s = tmDate.getSeconds();

        if (timestampDiff < 60) { // 一分钟以内
          return "刚刚";
//            } else if( timestampDiff < 3600 ) { // 一小时前之内
//                return Math.floor( timestampDiff / 60 ) + "分钟前";
        } else if (curDate.getFullYear() == Y && curDate.getMonth() + 1 == m && curDate.getDate() == d) {
          return zeroize(H) + ':' + zeroize(i);
        } else {
//                var newDate = new Date( (curTimestamp - 86400) * 1000 ); // 参数中的时间戳加一天转换成的日期对象
//                if ( newDate.getFullYear() == Y && newDate.getMonth()+1 == m && newDate.getDate() == d ) {
//                    return '昨天 ' + zeroize(H) + ':' + zeroize(i);
//                } else
          if (curDate.getFullYear() == Y) {
            return zeroize(m) + '-' + zeroize(d);
          } else {
            return Y + '-' + zeroize(m) + '-' + zeroize(d);
          }
        }
      },
      goBottom:function () {
        this.$nextTick(() => {
          document.querySelector('.chatMsgItems ').scrollTop = document.querySelector('.chatMsgItems ').scrollHeight+2000;
        })
      },
      inputCumulative:function(){
        let that = this
        setTimeout(function(){
          var ua = navigator.userAgent.toLowerCase()
          let tempNum = parseInt(ua.substring(ua.indexOf('os')+2,ua.indexOf('like')).trim().split('_').join(''))
          if(tempNum<1111){
            window.scrollTo(0,3000)
          }
        },400)
      }
    }
  }
</script>

<style lang='scss' scoped>
  @import "../../style/common";
  #chat {
    height: 100vh;
    background-color: #f6f6f6;
    position: absolute;
    .chatMsgItems {
      height: calc( 100vh - 1rem);
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      margin-bottom:1rem;
      .loadingMore {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 1rem;
        padding-top:.2rem;
        img {
          height: .4rem;
          width: .4rem;
          animation: rotation 1s linear infinite reverse;
        }
        @keyframes rotation {
          0%   { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        span {
          color: #ccc;
          font-size: .24rem;
        }
      }
      .chatMsgItem {
        margin:.2rem 0 .5rem 0;
        .chatTime {
          text-align: center;
          padding: 0 0 .3rem 0;
          font-size: .26rem;
          color: #ccc;
        }
        .chatMsg {
          display: flex;
          padding: 0 .2rem;
          .headPic {
            height: .8rem;
            width:.8rem;
            border-radius: .4rem;
            overflow: hidden;
            img {
              height:100%;
              width: 100%;
            }
          }
          .chatMsgBox {
            margin: 0 .2rem;
            background-color: #fff;
            border-bottom-left-radius: .2rem;
            border-bottom-right-radius: .2rem;
            border-top-right-radius: .2rem;
            box-shadow: 0 .01rem .02rem rgba(0,0,0,.1);
            overflow: hidden;
            .chatMsgText {/*文本消息*/
              padding: .26rem;
              font-size: .3rem;
              font-family: 'PingFang-SC-Medium';
              margin: 0;
              max-width: 5rem;
              white-space: pre-wrap;
              word-wrap: break-word;
            }
            .goodsContent {/*商品消息*/
              padding: .15rem;
              display: flex;
              justify-content: space-between;
              height: 1.6rem;
              width: 5rem;
              .goodsContentPic {
                height: 1.3rem;
                width: 1.3rem;
                border-radius: .1rem;
                img {
                  height: 100%;
                  width: 100%;
                }
              }
              .goodsContentInfo {
                width: 3.2rem;
                padding: .05rem 0;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                .goodsContentName {
                  font-size: .29rem;
                  color: #333;
                  font-weight: 400;
                }
                .goodsContentBottom {
                  font-size: .2rem;
                  color: #F61027;
                  font-weight: 600;
                  .goodsContentPrice {
                    font-size: .36rem;
                    font-weight: 800;
                    color: #F61027;
                  }
                  .goodsContentProm {
                    color: #ccc;
                    font-size: .2rem;
                    font-weight: 400;
                    margin-left:.08rem;
                  }
                }
              }
            }
            .img {/*图片消息*/
              /*height: 100%;*/
              .heightImg {
                height: 4.2rem;
                display: block;
              }
              .widthImg {
                width: 4.2rem;
                display: block;
              }
              .autoImg {
                  height: auto;
                width:auto;
                display: block;
              }
            }
            .autoReply {
              width: 4.3rem;
              padding: .1rem;
              .autoReplyTitle {
                padding: .3rem 0 .2rem .1rem;
                font-size: .3rem;
                color: #333;
              }
              .autoReplyItems {
                .autoReplyItem {
                  border-top: .01rem solid #eee;
                  padding: .3rem 0 .3rem .1rem;
                  color: #3695FF;
                }
              }
            }
          }
          .loadingImg {
            display: flex;
            align-items: center;
            img {
              height: .36rem;
            }
          }
          .whiteBackground {
            background-color: #fff!important;
          }
        }
        .goodsLink {/* 商品链接*/
          background-color: #fff;
          padding: .1rem .2rem;
          height: 1.6rem;
          display: flex;
          justify-content: space-between;
          .goodsPic {
            width:1.4rem;
            height: 1.4rem;
            img {
              height: 100%;
              width: 100%;
            }
          }
          .goodsInfo {
            width:5.5rem;
            padding: .1rem 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .goodsName {
              font-size: .26rem;
              font-weight: 600;
              line-height:.32rem;
              color: #333;

            }
            .goodsInfoBottom {
              display: flex;
              justify-content: space-between;
              align-items: flex-end;
              .goodsInfoBottomRight {
                font-size: .16rem;
                color: #F61027;
                font-weight: 800;
                .goodsPrice {
                  font-size: .36rem;
                  line-height:.36rem;
                  font-weight: 800;
                  color: #F61027;
                }
                .promNum {
                  font-size: .2rem;
                  line-height:.2rem;
                  margin-left:.06rem;
                  color: #999;
                  font-weight: 200;
                }
              }
              .goodsInfoBottomLeft {
                width:1.6rem;
                height: .5rem;
                text-align: center;
                line-height:.46rem;
                font-size: .22rem;
                color: #F61027;
                font-weight: 600;
                border: .02rem solid #F61027;
                border-radius: .25rem;
              }
            }
          }
        }
        .send {
          justify-content: end;
          flex-direction: row-reverse;
          .chatMsgBox {
            background-color: #F65565;
            border-top-right-radius: 0;
            border-top-left-radius: .2rem;
            color: #fff;
          }

        }
      }
    }
    .msgSendBox {
      width: 100%;
      position: fixed;
      bottom: 0;
      background-color: #fff;
      padding: .15rem .2rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      textarea {
        resize: none;
        background-color: #f6f6f6;
        border-radius: .1rem;
        width: 6.2rem;
        height: .7rem;
        padding: .2rem .1rem;
        font-size: .3rem;
        line-height: .3rem;
      }
      #images {
        display: none;
      }
      .send {
        width: 1rem;
        padding-left:.2rem;
        display: flex;
        justify-content: center;
        img {
          height: .66rem;
          width: .66rem;
        }
        button {
          width: .9rem;
          height: .7rem;
          background-color: #F61027;
          color: #fff;
          border-radius: .1rem;
          font-size: .28rem;
        }
        .fade-enter-active, .fade-leave-active {
          transition: opacity .1s
        }
        .fade-enter, .fade-leave-to {
          opacity: 0
        }
      }
    }
  }
</style>
