<template>
  <div
    style="
      height: 78vh;
      width: 78vw;
      display: flex;
      align-items: center;
      justify-content: center;
    "
  >
    <div
      class="hmi_setting_content hmi_border hmi_scrollbar"
      style="
        height: 75vh;
        width: 75vw;
        justify-content: flex-start;
        padding: 3vh 0;
      "
    >
      <div class="d-flex flex-row justify-content-around">
        <div class="d-flex flex-column">
          <span>{{ $t("GENERAL.PROTOCAL") }}:</span>
          <select
            id="ipv4_method"
            style="width: 40vw; font-size: 1.5vw"
            v-model="trueoption"
          >
            <option
              v-for="(item, index) in networkOption"
              :value="item.protocol"
              :key="index"
            >
              {{ translation(item.i18ntext) }}
            </option>
          </select>
          <!--
							nmcli connection show WAN | grep ipv4.method | awk -F' *: *' '{print $2}'
						-->
        </div>
      </div>
      <div
        name="static_field"
        class="d-flex flex-row justify-content-around"
        v-if="protocol"
      >
        <div class="d-flex flex-column">
          <span>{{ $t("GENERAL.IP_ADDRESS") }}:</span>
          <input
            id="ipv4_addresses"
            style="width: 40vw"
            v-match
            v-model="network.static_ipaddr"
          />
        </div>
      </div>
      <div
        name="static_field"
        class="d-flex flex-row justify-content-around"
        v-if="protocol"
      >
        <div class="d-flex flex-column">
          <span>{{ $t("GENERAL.SUBNET_MASK") }}:</span>
          <input
            id="ipv4_subnetmask"
            style="width: 40vw"
            v-model="network.static_netmask"
          />
          <!--
							(x.split(".").map(i=>parseInt(i).toString(2)).join("").match(/1/g) || []).length;
							("1".repeat(v)+"0".repeat(32-v)).match(/.{8}/g).map(i=>parseInt(i,2)).join(".")
						-->
        </div>
      </div>
      <div
        name="static_field"
        class="d-flex flex-row justify-content-around"
        v-if="protocol"
      >
        <div class="d-flex flex-column">
          <span>{{ $t("GENERAL.GATEWAY") }}:</span>
          <input
            id="ipv4_gateway"
            style="width: 40vw"
            v-model="network.static_gateway"
          />
        </div>
      </div>
      <div class="d-flex flex-row justify-content-around" v-if="protocol">
        <div class="d-flex flex-column">
          <span>{{ $t("GENERAL.DNS_SERVICE") }}:</span>
          <input
            id="ipv4_dns"
            style="width: 40vw"
            v-model="network.static_dns"
          />
        </div>
      </div>
      <!-- <i-p-input /> -->
    </div>
  </div>
</template>

<script>
import {
  getNetworkConfig,
  setNetworkConfig,
  restart,
  Network,
} from "network/gateway";

import IPInput from "components/content/IPInput/IPInput";

export default {
  components: {
    IPInput,
  },
  data() {
    return {
      network: {},
      networkOption: [
        {
          protocol: "dhcp",
          i18ntext: "GET_IP_LOCATION_AUTO",
        },
        {
          protocol: "static",
          i18ntext: "STATICE_IP",
        },
      ],
      trueoption: "",
    };
  },
  created() {
    this.getNetworkConfig();
  },
  mounted() {
    this.$bus.$on("loadConfig", async () => {
      if (this.protocol) {
        if (this.checkIP) {
          const res = await setNetworkConfig(
            this.trueoption,
            this.network.static_ipaddr,
            this.network.static_netmask,
            this.network.static_gateway,
            this.network.static_dns
          );
          if (res.status === "ok") {
            // restart() //重啟
            this.$nextTick(() => {
              this.$store.commit("setLoadingState");
              setTimeout(() => {
                this.getNetworkConfig();
                this.$store.commit("setLoadingState");
              }, 1500);
            });
          }
        } else {
          alert("IP format problem");
        }
      } else {
        setNetworkConfig(this.trueoption);
        this.$nextTick(() => {
          this.$store.commit("setLoadingState");
          setTimeout(() => {
            this.getNetworkConfig();
            this.$store.commit("setLoadingState");
          }, 1500);
        });
      }
    });
  },
  beforeDestroy() {
    this.$bus.$off("loadConfig");
  },
  computed: {
    protocol() {
      return this.trueoption === "static" ? true : false;
    },
    checkIP() {
      return this.isIp(this.network.static_ipaddr) &&
             this.isIp(this.network.static_gateway) &&
             this.isIp(this.network.static_netmask) &&
             this.isIp(this.network.static_dns)
    }
  },
  methods: {
    getNetworkConfig() {
      getNetworkConfig().then((res) => {
        this.trueoption = res.protocol;
        this.network = new Network(res);
      });
    },
    isIp(ip) {
      var arrIp = ip.split(".");
      if (arrIp.length !== 4) return false;
      for (let oct of arrIp) {
        if (isNaN(oct) || Number(oct) < 0 || Number(oct) > 255)
          return false;
      }
      return true;
    },
  },
};
</script>

<style scoped>
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
.hmi_scrollbar {
  overflow-x: hidden;
  overflow-y: auto;
}
.hmi_border {
  border: 2px #fcfdfd solid;
  border-radius: 8px;
}
.hmi_setting_content {
  display: flex;
  color: #ffffff;
  font-weight: bold;
  margin: auto;
  flex-direction: column;
  font-size: 2.5vw;
  height: 80vh;
  width: 90vw;
  justify-content: space-evenly;
}
.hmi_setting_content select {
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  background-color: rgba(33, 96, 184, 0.8);
  border-width: 0px;
  color: #ffffff;
  font-weight: bold;
  border-radius: 2px;
  height: 5vh;
}
.hmi_setting_content input {
  background-color: #9bebff;
  color: #000000;
  font-weight: bold;
  border-radius: 2px;
  border-width: 0px;
  height: 5vh;
}
</style>