/**
 * 配置编译环境和线上环境之间的切换
 *
 * baseUrl: 域名地址
 * routerMode: 路由模式
 * imgBaseUrl: 图片所在域名地址
 * user Info: 用户信息
 *
 */

import {getCookie} from './mUtils'
import {setCookie} from './mUtils'
import oauthLogin from '../assets/js/oauthLogin'
let baseUrl
let routerMode
let userMsg
let version = '2.3.1'

if (process.env.NODE_ENV === 'development') {//开发环境
  // baseUrl = 'http://pinquduo.cn/api_2_0_2'
  baseUrl = 'https://z.pinquduo.cn/api_3_0_1'

  // baseUrl = 'http://pinquduo.cn/api_2_0_2'
  routerMode = 'hash'
  // alert(2)
  if(window.getAppUserInfo){//ios测试环境
    oauthLogin()
  }else if(window.webview){//安卓测试环境
    oauthLogin()
  }else{//微信端测试环境
    userMsg = {
      userName: '贫道乃徐半仙',
      headPic: 'http://wx.qlogo.cn/mmopen/esbyI1XSibSgMiaz1T8Wv5Yermn6k695w2Wns5uhRPBgGceQHFCm97NXsicicxC3YrMqicymoSljUs7q8gSzIicY3Tr9vibSjaAvm37/0',
      openId: 'oHSHkvpPABwxzkiO9lRiLc3ztbLU',
      unionId: 'oSzXzwyd2NX2CZcGJRE9rFwhDneA',
      userId: 88929
    }
    setCookie('user_name',userMsg.userName)
    setCookie('head_pic',userMsg.headPic)
    setCookie('openid',userMsg.openId)
    setCookie('unionid',userMsg.unionId)
    setCookie('user_id',userMsg.userId)
    oauthLogin()
  }
} else {//生产环境
  oauthLogin()
  baseUrl = 'https://z.pinquduo.cn/api_3_0_1'
  // baseUrl = 'http://test.api.app.pinquduo.cn/api_2_0_2'
  routerMode = 'hash'
}
export {
  baseUrl,
  routerMode,
  userMsg,
  version
}
