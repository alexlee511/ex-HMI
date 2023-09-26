<template>
  <device-info-typesetting>
    <template v-slot:header-button>
      <header-button @click.native="configLoad">{{ $t("GENERAL.SAVE") }}</header-button>
    </template>
    <template v-slot:info-item>
      <info-side-item :path="'/gateway/cloudServer'">
        {{ $t("GENERAL.GATEWAY_SETTING_CServer") }}
      </info-side-item>
      <info-side-item :path="'/gateway/networkSetting'">
        {{ $t("GENERAL.GATEWAY_SETTING_NETWORK") }}
      </info-side-item>
      <!-- <info-side-item :path="'/gateway/modulePeriod'">
        {{ $t("GENERAL.GATEWAY_SETTING_MODULES_PERIOD") }}
      </info-side-item> -->
    </template>
    <template v-slot:content>
      <router-view></router-view>
    </template>
  </device-info-typesetting>
</template>

<script>
import DeviceInfoTypesetting from "layout/deviceInfoTypesetting/DeviceInfoTypesetting";

import InfoSideItem from "components/content/InfoSideItem/InfoSideItem";
import HeaderButton from "components/content/headerButton/HeaderButton"

export default {
  components: {
    DeviceInfoTypesetting,
    InfoSideItem,
    HeaderButton
  },
  computed: {
  },
  methods: {
    configLoad() {
      this.$bus.$emit('loadConfig')
    }
  }
};
</script>

<style>
</style>