import { uciApi, setCache, getCache } from "network/uci";
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  async created() {
    if (!this.$store.state.setCacheModule) { //註冊後不重複註冊
      // 下一次同步設定的指令
      this.listInit()
      this.createNewModule()
    }
  },
  mounted() {
    
  },
  computed: {
    ...mapState({
      cache: state => state.setCacheModule.cache,
      addDisabled: state => state.setCacheModule.addDisabled,
      solutionData: state => state.solutionData,
      isStorage: state => state.setCacheModule.isStorage
    }),
  },
  methods: {
    ...mapActions("setCacheModule", [
      "setCacheInfo",
      "getCacheInfo"
    ]),
    ...mapMutations("setCacheModule", [
      "changeAddDisabled",
      "changeIsStorage",
      "reserIsStorage"
    ]),
    createNewModule() {
      // console.log("註冊模塊");
      //創建動態vuex模塊
      this.$store.registerModule("setCacheModule", {
        namespaced: true,
        state: {
          route: this.$route.path.split('/')[2] + '/' + this.$route.path.split('/')[3],
          cache: {},
          addDisabled: false,
          add: [
            // {
            //   // 給UCI儲存的資料
            //   // 給中間層儲存的資料
            // }
          ],
          delete: [],
          modify: [],
          nameList: [],
          isStorage: []
        },
        mutations: {
          cacheInfo(state, payload) { //進行緩存
            const { key, value } = payload
            state.cache[key] = value
          },
          changeAddDisabled(state, payload) { //更改狀態
            state.addDisabled = payload
          },
          changeIsStorage(state, payload) { // 如果有緩存，切換該狀態
            if(state.isStorage.indexOf(payload) !== -1) return
            state.isStorage.push(payload)
          },
          reserIsStorage(state, payload) {
            state.isStorage = []
          }
        },
        actions: {
          setCacheInfo({ commit, state }, payload) { //將緩存置入設定檔
            setCache(state.cache, payload)
          },
          getCacheInfo({ commit, state }, payload) {
            return new Promise((resolve, reject) => {
              let res = getCache(payload);
              state.cache = res;
              resolve(res);
            }) 
          }
        },
      });
    },
    reload(cmd,arg = "",conf = "") {
      let thisPath = this.$route.path.split('/')[2] + '/' + this.$route.path.split('/')[3]
      if (thisPath !== this.$store.state.setCacheModule.route) {
        this.$store.unregisterModule("setCacheModule");
        
        uciApi(cmd,arg = "",conf = "")
        // console.log('重置數據')
      }
    }
  },
}