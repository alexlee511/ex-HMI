<template>
  <div>
    <!-- <span
      class="text-center"
      style="width: 100%; display: inline-block; padding-top: 2vh"
      >about</span
    > -->
    <!-- <div>
      <span
        class="text-left"
        style="width: 35%; display: inline-block; padding-left: 5%"
        >Model Name</span
      >
      <span class="text-center" style="width: 5%; display: inline-block"
        >:</span
      >
      <span>iManager</span>
    </div> -->
    <div>
      <span
        class="text-left"
        style="width: 35%; display: inline-block; padding-left: 5%"
        >LAN IP</span
      >
      <span class="text-center" style="width: 5%; display: inline-block"
        >:</span
      >
      <span>{{ ipAdress }}</span>
    </div>
    <!-- <div>
      <span
        class="text-left"
        style="width: 35%; display: inline-block; padding-left: 5%"
        >WAN IP Address</span
      >
      <span class="text-center" style="width: 5%; display: inline-block"
        >:</span
      >
      <span></span>
    </div> -->
    <div>
      <span
        class="text-left"
        style="width: 35%; display: inline-block; padding-left: 5%"
        >MAC Addr</span
      >
      <span class="text-center" style="width: 5%; display: inline-block"
        >:</span
      >
      <span>{{ macAdress }}</span>
    </div>
    <div>
      <span
        class="text-left"
        style="width: 35%; display: inline-block; padding-left: 5%"
        >Gateway ID</span
      >
      <span class="text-center" style="width: 5%; display: inline-block"
        >:</span
      >
      <span>{{ gatewayId }}</span>
    </div>
    <div>
      <span
        class="text-left"
        style="width: 35%; display: inline-block; padding-left: 5%"
      >
        API Ver.
      </span>
      <span class="text-center" style="width: 5%; display: inline-block"
        >:</span
      >
      <span>{{ version }}</span>
    </div>
    <div>
      <span
        class="text-left"
        style="width: 35%; display: inline-block; padding-left: 5%"
      >
        WEB Ver.
      </span>
      <span class="text-center" style="width: 5%; display: inline-block"
        >:</span
      >
      <span>{{ webVersion }}</span>
    </div>
    <div>
      <span
        class="text-left"
        style="width: 35%; display: inline-block; padding-left: 5%"
      >
        principal.
      </span>
      <span class="text-center" style="width: 5%; display: inline-block"
        >:</span
      >
      <span>herming</span>
    </div>
    <div>
      <span
        class="text-left"
        style="width: 35%; display: inline-block; padding-left: 5%"
      >
        HMI Ver.
      </span>
      <span class="text-center" style="width: 5%; display: inline-block"
        >:</span
      >
      <span>{{HMI_version}}</span>
    </div>
    <div style="display: flex; justify-content: center; margin-top: 1.5vh;">
      <button class="text-center contextButton _32" style=" display: inline-block" @click="init()"
        >{{$t("GENERAL.REORGANIZE")}}</button>
    </div>
  </div>
</template>

<script>
import {getGetewayInfo} from "network/module"
import {getNetworkConfig} from "network/gateway"

export default {
  data() {
    return {
      ipAdress: null,
      macAdress: null,
      gatewayId: null,
      version: null,
      webVersion: null,
      HMI_version: null,
    }
  },
  created() {
    getGetewayInfo().then(res => {
      //console.log(res)
      this.gatewayId = res.gw_id
      this.version = res.web_gui_version
      this.macAdress = res.mac_addr
    })
    getNetworkConfig().then(res => {
      this.ipAdress = res.static_ipaddr
    })
    this.webVersion = process.env.VUE_APP_VERSION
    //console.log(process.env.VUE_APP_HMI_VERSION)
    this.HMI_version = process.env.VUE_APP_HMI_VERSION
  },
  methods: {
    init(){
      window.location.reload()
    }
  }
};
</script>

<style scoped>
.text-center {
  text-align: center;
}
.text-left {
  text-align: left;
}
</style>