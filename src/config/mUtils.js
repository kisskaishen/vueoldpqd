/**
 * 存储localStorage
 */
export const setStore = (name, content) => {
  if (!name) return
  if (typeof content !== 'string') {
    content = JSON.stringify(content)
  }
  window.localStorage.setItem(name, content)
}

/**
 * 获取localStorage
 */
export const getStore = name => {
  if (!name) return
  return window.localStorage.getItem(name)
}

/**
 * 删除localStorage
 */
export const removeStore = name => {
  if (!name) return
  window.localStorage.removeItem(name)
}

/**
 * 存储cookie
 */
export const setCookie = (cname, content, exdays=7) => {
  let d = new Date()
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000))
  let expires = 'expires=' + d.toUTCString()
  document.cookie = cname + '=' + encodeURI(content) + ';' + expires + ';path=/';
}

/**
 * 获取cookie
 */
export const getCookie = (cname) => {
  let name = cname + "=";
  let ca = document.cookie.split(';');
  for(let i=0; i<ca.length; i++) {
    let c = ca[i].trim();
    if (c.indexOf(name)==0) return c.substring(name.length,c.length);
  }
  return "";
}

/**
 * 删除cookie
 */
export const delCokkie = (cname) => {
  let d = new Date();
  d.setTime(d.getTime() - 1);
  let cval = getCookie(cname);
  if (cval != null)
    document.cookie = name + "=" + cval + ";expires=" + d.toGMTString();
}

/**
 * 清除所有cookie
 */
export const delAllCookie = () => {
  let keys = document.cookie.match(/[^ =;]+(?=\=)/g)
  if (keys) {
    for (let i = keys.length; i--;)
      document.cookie = keys[i] + '=0;expires=' + new Date(0).toUTCString()
  }
}

/**
* 获取url参数
*/
export const urlSearch = () => {
  let results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
  if (!results) {
    return 0;
  }
  return results[1] || 0;
}


