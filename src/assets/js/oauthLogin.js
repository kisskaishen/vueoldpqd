import {getCookie} from "../../config/mUtils";
import {setCookie} from "../../config/mUtils";
export default () =>{
    if(window.getAppUserInfo){//ios拉去信息
      let appUserInfo = window.getAppUserInfo();
      if(appUserInfo.userId){
        setCookie('user_id',appUserInfo.userId)
        setCookie('user_name',appUserInfo.name)
        setCookie('head_pic',appUserInfo.avatar)
        setCookie('terminal',appUserInfo.terminal)
      }else{
        window.showAppLoginView()
      }
    }else if(window.webview){//安卓拉取信息
    let appUserInfo = window.webview.getAppUserInfo();
    appUserInfo = JSON.parse(appUserInfo)
    setCookie('terminal',appUserInfo.terminal)
    if(appUserInfo.userId){
      setCookie('user_id',appUserInfo.userId)
      setCookie('user_name',appUserInfo.name)
      setCookie('head_pic',appUserInfo.avatar)

    }else{
      window.webview.showAppLoginView()
    }
  }else if(!getCookie('user_id')){//微信端登陆
  // if(true){
    let oauth = {
      //判断微信用户登录
      isWeiXin: function(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/MicroMessenger/i) == 'micromessenger'){
          return true;
        }else{
          return false;
        };
      },
      //判断QQ用户登录
      isQQ: function(){
        var ua = navigator.userAgent.toLowerCase();
        if(ua.match(/QQ/i) == 'qq'){
          return true;
        }else{
          return false;
        };
      }
    };
    let href = location.href
    let bassSrc = ''
    if(href.indexOf('pinquduowx-test')!=-1){
      bassSrc = 'http://wx.pinquduo.cn/pinquduowx-test/'
    }else{
      bassSrc= 'http://wx.pinquduo.cn/'
    }
    // console.log(bassSrc);
    // alert(navigator.userAgent.toLowerCase())

    if(oauth.isWeiXin()){
      location.href = bassSrc+'wechat/thirdlogin.php?redirect_address='+encodeURIComponent(href)
    }else{
      location.href = bassSrc+'newQQ/oauth/thirdlogin.php?redirect_address='+encodeURIComponent(href)
    }
  }
}
