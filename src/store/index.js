import Vue from 'vue'
import Vuex from 'vuex'

import mutations from './mutations'
import actions from './actions'
import getters from './getters'

import { BASE_URL } from "network/baseUrl"

const modules = {}
const files = require.context('./', true, /index\.js$/);
files.keys().filter(key => {
  if (key === './index.js') return false;
  return true
}).map(key => { 
  const modulePath = key.replace('./modules/', '');
  const moduleName = modulePath.replace('/index.js', '');
  const module = require(`${key}`);

  modules[`${moduleName}`] = module.default;
})

// console.log(modules);

//1.安裝插件
Vue.use(Vuex)

const state = {
  footText: '',
  copyright: '',
  backData: {},
  solutionData: {},
  deviceName: {},
  Disconnected: false, //斷線狀態
  isProgressProfile: false, // judge the progressing state
  loading: false,
  loadingProgress: false,
  polling : {
        show : false , 
        template: ""
  },
  completeLoading: 0,
  totalLoading: 0,
  message: "",
  error: 0, //連線錯誤紀錄
  check: false,
  pageNum: 1,
  maxPageNum: 1,

  isChangeInfo: false,

  hasGetRoute: false, //獲取路由的狀態

  backUrl:  BASE_URL + '/',

  source: {
    token: null,
    cancel: null
  }
}

//2.創建物件
const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: modules
})

export default store