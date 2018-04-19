import {version} from '../env'
import {md5} from '../md5.min';

export default (argObj) => {
  function objKeySort(obj) {
    let newkey = Object.keys(obj).sort();
    let newObj = {}; //创建一个新的对象，用于存放排好序的键值对
    for (let i = 0; i < newkey.length; i++) { //遍历newkey数组
      newObj[newkey[i]] = obj[newkey[i]]; //向新创建的对象中按照排好的顺序依次增加键值对
    }
    return newObj; //返回排好序的新对象
  }

  // 第一步： 在参数之中添加时间戳 版本号 请求方式
  let obj = {
    // time: parseInt(new Date() / 1000),
    time: 1512201983,
    version: version,
  }
  // 判断是否传了参数
  if (argObj) {
    // argObj = Object.assign(argObj, obj);
    for (let key in obj) {
      argObj[key] = obj[key];
    }
  } else {
    argObj = obj;
  }
  // 第二步： 将对象中的key重新排序并拼接成字符串
  let sortObj = objKeySort(argObj)
  let arr = [];
  for (let key in sortObj) {
    if (key.indexOf('picture') == -1) {
      arr = arr.concat(key + '=' + sortObj[key])
    }
  }
  let str = arr.join('&') + '&sig=pinquduo_sing'
  argObj.sig = md5(str);
  return argObj;
  // return Object.assign(argObj, {
  //     sig: md5(str)
  // })
}
