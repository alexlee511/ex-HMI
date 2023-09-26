import Toast from './Toast.vue'

const obj = {}

obj.install = function(Vue) {
  // console.log('執行obj的install函數')

  //1.創建組件構造器
  const toastConstructor = Vue.extend(Toast)

  //2.new的方式，根據組件構造器，可以創建一個組件對象
  const toast = new toastConstructor()

  //3.將組件對象，手動掛載到某一個元素上
  toast.$mount(document.createElement('div'))

  //4.toast.$el對應的就是div
  document.body.appendChild(toast.$el)

  //賦予Vue原型toast物件
  Vue.prototype.$toast = toast
}

export default obj