/*
* 微信分享和qq分享控制
* */
import 'https://res.wx.qq.com/open/js/jweixin-1.2.0.js'//引入微信接口js
wx.config({//微信JS-SDK配置
  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
  appId: '', // 必填，公众号的唯一标识
  timestamp: '', // 必填，生成签名的时间戳
  nonceStr: '', // 必填，生成签名的随机串
  signature: '',// 必填，签名，见附录1
  jsApiList: [] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
});

