const modules = {}

const files = require.context('@/solution', true, /index\.js$/); //找到對應資料夾底下的index對應出來的路徑
files.keys().filter(key => {
  const arr =  key.split('/');
  if(arr[2] === 'data' && arr[3] === 'overviewButton' ) {
    
    return true
  }
}).map(key => {
  const modulePath = key.replace('./', '');
  const moduleName = modulePath.replace('/data/overviewButton/index.js', '');
  const module = require(`@/solution/${modulePath}`);
  modules[`${moduleName}`] = module.default;
})
console.log("✌✌✌✌✌✌✌✌✌✌✌✌")
    console.log(modules)
export default {
  namespaced: true,
  state: {
    button: modules
  },
  mutations: {
  },
  actions: {
    test() {
      console.log('-----------')
    }
  },
  getters: {
  }
}
