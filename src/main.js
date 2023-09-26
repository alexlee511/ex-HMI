import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './common/plugins/vue-i18n'
import Toast from 'components/common/toast'
import el from 'common/plugins/el-component'
// import 'default-passive-events'
import {
  debounce,
  onlyNum,
  onlyNumInArr,
  match,
  deepOnlyNum,
  deepOnlyFloat
} from "common/utile/directive"


Vue.config.productionTip = false
//事件總線
Vue.prototype.$bus = new Vue()

//全局轉譯函數
Vue.prototype.translation = (value) => {
  if (vm.$t('GENERAL') !== {}) {
    if (vm.$t('GENERAL')[value]) {
      return vm.$t(`GENERAL.${value}`)
    } else {
      return value
    }
  }
}

//使用Toast插件
Vue.use(Toast)

//使用elementUI
el(Vue)

//使用自訂義指令
Vue.directive('debounce', debounce)
Vue.directive('onlyNum', onlyNum)
Vue.directive('onlyNumInArr', onlyNumInArr)
Vue.directive('match', match)
Vue.directive('deepOnlyNum', deepOnlyNum)
Vue.directive('deepOnlyFloat', deepOnlyFloat)
import cardFontDiv from './layout/cardFontDiv/cardFontDiv.vue'
Vue.mixin({
   components: {
    cardFontDiv,
  },
  computed: {
      stylerSize: function(){
          return function(w=100,h=100,k=0,t=0){
              return "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;"; 
          }
      },
      
  },
})

const vm = new Vue({
  render: h => h(App),
  router,
  i18n,
  store
}).$mount('#app')


export default vm
import  {__init__} from './common/constant/advanced';
__init__()
Number.prototype.toCurrencyString = function(dat = 0 ){
       return this.toFixed(dat).replace(/(\d)(?=(\d{3})+\b)/g, '$1,');
   }
   
//讓數字有補0功能
Number.prototype.toZS = function(unit = 1){
    return this.valueOf() < Math.pow(10, unit) ? '0'.repeat(unit - this.valueOf().toString().length) + this.valueOf(): this.valueOf().toString();
}