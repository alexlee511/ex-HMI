<template>
  <div class="GATEWAYSETTING_CONTENT">
    <div style="display: flex; padding: 1vh 0vw">
      <form style="display: flex; margin-left: 5vw">
        <div
          style="display: flex; margin-right: 5vw; align-items: center"
          v-for="item in selectOption"
          :key="item.value"
        >
          <input
            type="radio"
            name="selectOption_value"
            :value="item.value"
            v-model="inputData"
          />{{ item.text }}
        </div>
      </form>
    </div>
    <div class="d-flex flex-row justify-content-around" v-if="inputData">
      <div class="d-flex flex-column">
        <span>IP: ({{ $t("GENERAL.DOMAIN_NAME") }})</span>
        <input id="ipvalue" style="width: 40vw" v-model="csAddr" />
      </div>
      <div class="d-flex flex-column">
        <span>PORT:</span>
        <input id="portvalue" style="width: 20vw" v-onlyNum="{ overNum: '65535', model: 'csPort' }" v-model="csPort" />
      </div>
    </div>
  </div>
</template>

<script>
import { getCloudSetting, setCloudSetting, restart ,setCsConnect} from "network/gateway";
import { uciApi } from "network/uci";
import { setBackData } from "network/solution";
import { mapState } from "vuex";

export default {
  data() {
    return {
      csAddr: "",
      csPort: "",
      selectOption: [
        {
          text: this.$t('GENERAL.ENABLE'),
          value: true,
        },
        {
          text: this.$t('GENERAL.DISABLE'),
          value: false,
        },
      ],
      inputData: false,
    };
  },
  async created() {
    this.getCloudSetting();
    let res = await uciApi("get","CONNECT_CSERVER_FLAG")
    if(res.output[0] == "0"){
				 this.inputData = false
    }
    else if(res.output[0] == "1"){
         this.inputData = true
    }
    //console.log(this.inputData)
    //this.inputData = Boolean(this.$store.state.backData.isCloudConnect);
  },
  mounted() {
    this.$bus.$on("loadConfig", async () => {
      this.$store.state.backData.isCloudConnect = this.inputData //對狀態進行提交
      const res = await setBackData(this.$store.state.backData);
      //如果連線啟用
      if (this.inputData) {
        setCsConnect("yes")
        setCloudSetting(this.csAddr, this.csPort).then((res) => {
          if (res.status === "ok") {
            restart(); //重啟
            this.$store.commit("setLoadingState");
            setTimeout(() => {
              this.$store.commit("setLoadingState");
              this.getCloudSetting();
            }, 1500);
          }
        });
      } else {
        setCsConnect("no")
        this.$store.commit("setLoadingState");
        setTimeout(() => {
          this.$store.commit("setLoadingState");
        }, 1500);
      }
    });
  },
  beforeDestroy() {
    this.$bus.$off("loadConfig");
  },
  methods: {
    getCloudSetting() {
      getCloudSetting().then((res) => {
        this.csAddr = res.cs_addr;
        this.csPort = res.cs_port;
      });
    },
  },
};
</script>

<style scoped>
.GATEWAYSETTING_CONTENT {
  display: flex;
  color: #ffffff;

  font-weight: bold;
  height: 80vh;
  width: 90vw;
  margin: auto;
  flex-direction: column;
  justify-content: center;
  font-size: 2.5vw;
}

.GATEWAYSETTING_CONTENT input {
  background-color: #9bebff;
  color: #000000;

  font-weight: bold;
  border-radius: 2px;
  border-width: 0px;
}
.justify-content-around {
  -ms-flex-pack: distribute !important;
  justify-content: space-around !important;
}
.flex-row {
  -ms-flex-direction: row !important;
  flex-direction: row !important;
}
.d-flex {
  display: -ms-flexbox !important;
  display: flex !important;
}
.flex-column {
  -ms-flex-direction: column !important;
  flex-direction: column !important;
}
input[type="radio"] {
  width: 4vmin;
  height: 4vmin;
}
</style>