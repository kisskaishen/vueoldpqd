import {Toast} from 'mint-ui'
export const myToast = (info)=>{
  Toast({
    message: info,
    position: 'middle',
    duration: 2000,
    className: 'my-toast'
  });
}
