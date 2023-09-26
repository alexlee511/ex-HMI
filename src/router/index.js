import Vue from 'vue'
import VueRouter from 'vue-router'

import { getVersion } from 'network/solution'
import vm from "@/main"
import store from '@/store'
import { filterRouter, deepCopy } from 'common/utile/utile'
import { update } from 'common/constant/ist';
//原始頁面
const Home = () => import('views/home/Home')
const Overview = () => import('views/overview/Overview')
const Config = () => import('views/config/Config')
const Dialog = () => import('views/dialog/Dialog')
const DevicePick = () => import('views/devicePick/DevicePick')
const NameSync = () => import('views/namesync/NameSync')
const ProgramManagement = () => import('views/programManagement/ProgramManagement')
const Gateway = () => import('views/gateway/Gateway')
const Attributes = () => import('views/attributes/Attributes')
const ChannelName = () => import('views/channelName/ChannelName')
const DeviceAdvanceSetting = () => import('views/deviceAdvanceSetting/DeviceAdvanceSetting')
const PickDevices = () => import('views/deviceAdvanceSetting/PickDevices')
Vue.use(VueRouter)

const aroutes = [
  {
    path: '/home',
    component: Home,
  },
  {
    path: '/dialog',
    component: Dialog,
  },
  {
    path: '/devicePick',
    component: DevicePick,
  },
  {
    path: '/namesync',
    component: NameSync,
  },
  {
    path: '/channelName',
    component: ChannelName,
  },
  {
    path: '/gateway',
    component: Gateway,
    children: [
      {
        path: '',
        redirect: 'cloudServer'
      },
      {
        path: 'cloudServer',
        component: () => import('views/gateway/childComps/CloudServer')
      },
      {
        path: 'networkSetting',
        component: () => import('views/gateway/childComps/NetworkSetting')
      },
    ]
  },
  {
    path: '/configView',
    component: Config,
    children: [
      {
        path: 'deviceList', //裝置設定主頁
        component: () => import('views/deviceList/configView/ConfigView')
      },
      {
        path: 'ruleList',
        component: () => import('views/ruleList/configView/ConfigView')
      },
      {
        path: 'scheduleList',
        component: () => import('views/schedulelist/configView/ConfigView')
      },
      /*{
        path: 'context',
        component: () => import('views/context/configView/ConfigView')
      },*/
      {
        path: 'analysisSetting',
        component: () => import('views/analysisSetting/configView/analysisSetting'),
        meta: {
          apply: true,
          store: true,
          other: true
        }
      },
      
    ]
  },
  {
    path: '/changeConfig',
    component: Config,
    children: [
      {
        path: 'deviceList',
        component: () => import('views/deviceList/changeConfig/ChangeConfig'),
        meta: {
          store: true
        }
      },
      {
        path: 'deviceList/OtherConfig',
        component: () => import('views/deviceList/otherConfig/OtherConfig'),
        meta: {
          store: true,
          other: true
        }
      },
      {
        path: 'ruleList',
        component: () => import('views/ruleList/changeConfig/ChangeConfig'),
        meta: {
          store: true
        }
      },
      {
        path: 'scheduleList',
        component: () => import('views/schedulelist/changeConfig/ChangeConfig'),
        meta: {
          store: true
        }
      },
    ]
  },
  {
    path: '/analyze', //分析畫面總頁面
    component: () => import('common/analyze/DeviceInfo'),
    children : [
        {
            path: "Ratio",
            component: () => import("common/analyze/Ratio")
        },
        {
            path: "Proportion",
            component: () => import("common/analyze/Proportion")
        },
        {
            path: "EnergySavingPerformance",
            component: () => import("common/analyze/EnergySavingPerformance")
        },
        {
            path: "Trend",
            component: () => import("common/analyze/Trend")
        },
        {
            path: "ElectricityPriceStructure",
            component: () => import("common/analyze/ElectricityPriceStructure")
        },
        {
            path: "BestContract",
            component: () => import("common/analyze/BestContract")
        },
        
    ]
  },
  {
    path: '/report', //分析畫面總頁面
    component: () => import('common/report/DeviceInfo'),
    children : [
        {
            path: "billingStatistic",
            component: () => import("common/report/billingStatistic")
        },
        {
            path: "timeAccumulation",
            component: () => import("common/report/timeAccumulation")
        },
        {
            path: "unusual",
            component: () => import("common/report/unusual")
        },
        {
          path: "consumption",
          component: () => import("common/report/consumption")
        }, 
        {
          path: "historyReport",
          component: () => import("common/report/historyReport")
        }, 
    ]
  },
  {
    path: '/configView', //設定畫面呈現頁
    component: Config,
  },
  {
    path: '/changeConfig', //設定畫面修改頁
    component: Config,
  },
  {
    path: '/programManagement', //方案管理
    component: ProgramManagement
  },
  {
    path: '/attributes',
    component: Attributes
  },
  {
    path: '/deviceAdvanceSetting',
    component: DeviceAdvanceSetting
  },
  {
    path: '/pickDevices',
    component: PickDevices
  }
]

let routes = [...aroutes]

const createRouter = r => new VueRouter({
  mode: 'hash',
  routes: r
})

const router = createRouter(routes)

const originalReplace = VueRouter.prototype.replace
VueRouter.prototype.replace = function replace(location) {
  return originalReplace.call(this, location).catch(err => err)
}
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  switch (location) {
    //在轉換頁面前停止，同時對應showNumLock產生密碼框
    case '/programManagement':
    case '/gateway':
      break;
    default:
      return originalPush.call(this, location).catch(err => err)
      break;
  }
}

export function reset() {
  router.matcher = createRouter(routes).matcher;
}

//設定版本
getVersion().then(res => window.version = res.version)

router.beforeEach((to, from, next) => {

  if (!store.state.hasGetRoute) {
    // 如果未獲取信息，先獲取信息之後跳轉
    //
    let tk = getCookie("test");
    if(tk == undefined || tk == "1"){
        to = from;
    }
    setCookie("test", "1" , 1);
    let gy = getCookie("test");
    window.setInterval(update,100); 
    
    store.dispatch('getRouteList').then(() => {
      router.addRoutes(filterRouter(deepCopy(store.getters.getTrueRoutes)))
      const homeRoute = [
        {
          path: "",
          redirect: "/home/" + store.state.backData.solutionEnable[0],
        },
      ];
      router.addRoutes(homeRoute);
      console.log(to)
      // 如果直接使用 next() 刷新後會白屏
      next({ ...to, replace: true })
    })
  }
  else {
    if(window.promiseArr) {
      for(let key in window.promiseArr) {
        window.promiseArr[key] ()
      }
    }
    window.promiseArr = {}
    //判斷有無更新
    getVersion().then(res => {
      //data types are different(number and string), so double equal sign is not used
      if(window.version != res.version) {
        router.push('/home/' + store.state.backData.solutionEnable[0]).then(() => {
          location.reload()
        })
        return
      }
    })

    // 如果已經獲取信息直接跳轉
    next()
  }
})
export function    setCookie(name, value, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toGMTString();
        document.cookie = name + "=" + value + "; " + expires;
	};
export function    getCookie(name) {
	    let ret, m;
	    if (typeof name === 'string' && name !== '') {
	        if ((m = String(document.cookie).match(
	            new RegExp('(?:^| )' + name + '(?:(?:=([^;]*))|;|$)')))) {
	            ret = m[1] ? decodeURIComponent(m[1]) : ''
	        }
	    }
	    return ret
	};


export default router


