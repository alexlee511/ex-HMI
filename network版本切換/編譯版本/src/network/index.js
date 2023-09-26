import axios from "axios";
import store from "@/store";

import { BASE_URL  ,BASICE} from "network/baseUrl";
const CancelToken = axios.CancelToken;

window.promiseArr = {}


export function requestNode(data , lang = false) {
    console.log('⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕⭕')
    console.log(data)
    data['headers'] = {};
    data['headers']['Authorization'] = `Basic ${BASICE}` ;
    if(lang){
       data.params.lang =  store.state.backData.back_lang
    }
    return requestUCI(data);
}

export function requestUCI(config) {
    axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
  const instance = axios.create({
    baseURL: BASE_URL,
    timeout: 60000
  })
  if(config.hasOwnProperty('retry')){
    instance.defaults.retry = config.retry
  }else{
    instance.defaults.retry = 0 //重试次数
  }
  instance.defaults.retryDelay = 3000;//重试延时
  instance.defaults.shouldRetry = (error) => true;//重试条件，默认只要是错误都需要重试

  window.axiosPromiseArr = [] // axios中设置放置要取消的对象
  //請求攔截
  instance.interceptors.request.use(config => {

    config.cancelToken = store.state.source.token

    return config
  }, err => {
    console.log(err + "錯誤錯誤")
    return {'status' : "fail"}
  })
  //響應攔截 //如果網路請求失敗回報這個錯誤
  instance.interceptors.response.use(res => {
    if (store.state.Disconnected === true) {
      store.dispatch('pushNormalData')
    }
    return res.data
  }, err => {
        console.log('network error')
        return {'status' : "fail"}
  })


  //網路請求
  return instance(config)
}