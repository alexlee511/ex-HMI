<template>
  <device-info-typesetting>
    <template v-slot:info-item>
      <info-side-item :path="'/' + deviceType + '/deviceDetailed'">
        {{ $t("GENERAL.OVERVIEW") }}
      </info-side-item>
      <info-side-item :path="'/' + deviceType + '/deviceChart'">
        {{ $t("GENERAL.HISTORY_CHART") }}
      </info-side-item>
    </template>
    <template v-slot:content>
      <router-view></router-view>
    </template>
  </device-info-typesetting>
</template>

<script>
import DeviceInfoTypesetting from "layout/deviceInfoTypesetting/DeviceInfoTypesetting";

import InfoSideItem from "components/content/InfoSideItem/InfoSideItem";

export default {
  components: {
    DeviceInfoTypesetting,
    InfoSideItem,
  },
  computed: {
    deviceType() {
      let deviceType = this.$route.path.split("/");
      return deviceType[1] + "/" + deviceType[2];
    },
  },
};
</script>

<style>
</style>