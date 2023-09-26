/**
 * 防抖
 * @param fn
 * @param delay
 * @returns {Function}
 * @constructor
 */
export function debounce(func, delay){
  let timer = null
  return function (...args) {
    if(timer) clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}
/**
* 節流
* @param fn
* @param interval
* @returns {Function}
* @constructor
*/
export const throttle = (fn, t) => {
  let last;
  let timer;
  let interval = t || 500;
  return function () {
      let args = arguments;
      let now = +new Date();
      if (last && now - last < interval) {
          clearTimeout(timer);
          timer = setTimeout(() => {
              last = now;
              fn.apply(this, args);
          }, interval);
      } else {
          last = now;
          fn.apply(this, args);
      }
  }
};

//正則表達式是為了做字符串匹配的
export function formatDate(date, fmt) { //字符串格式化，將毫秒數轉為日期
  //1.獲取年份
  //y+ -> 1個或多個y
  //y* -> 0個或多個y
  //y? -> 0個或1個y
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  //2.獲取
  let o = {
    'M+': date.getMonth() + 1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds()
  };
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) { 
      let str = o[k] + '';
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
    }
  }
  return fmt;
};

function padLeftZero (str) {
  return ('00' + str).substr(str.length);
};

export function filterRouter(routers) {
  // 遍歷後台傳來的路由字符串，轉換為組件對象
  const accessedRouters = routers.filter((route) => {
    if (route.component) {
      if (route.component === "Home") {
        // 對組件的特殊處理
        route.component = Home;
      } else {
        route.component = _import(route.component);
      }
    }
    if (route.children && route.children.length) { //如果有子路由，遞迴
      route.children = filterRouter(route.children);
    }
    return true;
  });
  return accessedRouters;
}
function _import(file) {
  return () => import("@/" + file + ".vue");
}

export function deepCopy (obj) { //深度拷貝
  if(obj == null) return;
  var newobj = obj.constructor === Array ? [] : {};
  if(typeof obj !== 'object'){
      return;
  }
  for(var i in obj){
     newobj[i] = typeof obj[i] === 'object' ? deepCopy(obj[i]) : obj[i];
  }
  return newobj
}

export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}