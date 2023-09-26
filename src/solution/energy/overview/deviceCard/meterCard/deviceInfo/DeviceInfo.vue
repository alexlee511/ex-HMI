<template>
  <device-info-typesetting>
    <template v-slot:info-item>
      <info-side-item :path="'/' + deviceType + '/deviceDetailed'">
        {{ $t("GENERAL.DATA_OVERVIEW") }}
      </info-side-item>
      <info-side-item :path="'/' + deviceType + '/deviceChart'">
        {{ $t("GENERAL.HISTORY_CHART") }}
      </info-side-item>
      <info-side-item :path="'/' + deviceType + '/deviceStatistics'" v-if="showStatis">
        {{ $t("GENERAL.STATISTICS_CHART") }}
      </info-side-item>
      <info-side-item :path="'/' + deviceType + '/deviceDemand'" v-if="demandStatus">
        {{ $t("GENERAL.DEMAND_PRED") }}
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
import { getDemandList } from "common/constant/demand";

import { checkStatis } from "solution/energy/config/statistics/statisType"

export default {
  components: {
    DeviceInfoTypesetting,
    InfoSideItem,
  },
  data() {
    return {
      devId: this.$route.query.devId,
      demandStatus: false
    }
  },
  async created() {
    // //console.log('------')
    const res = await getDemandList(this.devId);
    if(res.status == 'fail') { //判斷有無需量
      return
    } else {
      this.demandStatus = true
    }
  },
  computed: {
    deviceType() {
      let deviceType = this.$route.path.split("/");
      return deviceType[1] + "/" + deviceType[2];
    },
    showStatis(){
      return checkStatis(this.devId);
    }
  },
};
</script>

<style>
</style>