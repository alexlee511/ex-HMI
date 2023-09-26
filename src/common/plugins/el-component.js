
import { Progress, Dropdown, DropdownMenu, DropdownItem, Select, Option, Loading, MessageBox, Dialog, Message, Notification } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue'

function mountPlugins(Vue) {
  //注册
  Vue.component('ElProgress', Progress);
  Vue.component('ElDropdown', Dropdown);
  Vue.component('ElDropdownMenu', DropdownMenu);
  Vue.component('ElDropdownItem', DropdownItem);
  Vue.component('ElSelect', Select);
  Vue.component('ElOption', Option);
  Vue.component('ElDialog', Dialog);
  Vue.component('Loading', Loading);
  Vue.component('MessageBox', MessageBox)
  Vue.component('Message', Message)
}

Vue.use(Loading.directive);
Vue.prototype.$loading = Loading.service;
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$alert = MessageBox.alert;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$prompt = MessageBox.prompt;
Vue.prototype.$notify = Notification;
Vue.prototype.$message = Message;


export default mountPlugins