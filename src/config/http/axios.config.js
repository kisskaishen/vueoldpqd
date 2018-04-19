import {baseUrl} from "../env"
import md5Sign from './md5Sign'
import axios from 'axios'
import qs from 'qs'
axios.defaults.baseURL = baseUrl;
axios.defaults.headers = {
    "Content-Type": "application/x-www-form-urlencoded"
}
export default  (type='GET',url='',data={},fn) => {
    type=type.toUpperCase();
    data=md5Sign(data);
    console.log(data);
    console.log(type);
    if(type==='GET'){
        axios.get(url, {
            params: data
        }).then(function (res) {
            res=res.data;
            fn(res)
        }).catch(function (err) {
            console.log(err);
        })
    };
    if(type==='POST'){
        axios.post(url, qs.stringify(data)).then(function (res) {
            res=res.data;
            fn(res);
        }).catch(function (err) {
            console.log(err);
        })
    }
    if(type==='FORMDATA'){
      // console.log(111);
      // let postFormData = (url, data) => {
      //   // data=md5Sign(data);
      //   console.log(data);
      //   var formData = new FormData();
      //   for (let key in data) {
      //     formData.append(key,data[key])
      //   }
      //   console.log(formData);
      // }
      let formData = new FormData();
      for (let key in data) {
        formData.append(key,data[key])
      }
      axios.post(url, formData).then((res) => {
        res = res.data
        fn(res)
      }).catch((err) => {
        console.log(err);
      })
    }
}
