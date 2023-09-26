<template>
    <div class="grid-container" v-if="isCardExist">
      <component
        :is="item.cardType"
        v-for="(item,index) in pageCard[this.$store.state.pageNum - 1]"
        :key="item.deviceId"
        :item-info="item"
        :index="index"
      ></component>
    </div>
    <div v-else>
      <no-data-back></no-data-back>
    </div>
</template>

<script>
// import SensorCard from "./sensorCard/SensorCard";
import normalMeterCard from "./meterCard/normalMeter/NormalMeter";
import multiControlMeterCard from "./meterCard/multiControlMeter/MultiControlMeter.vue";
import singleControlMeterCard from "./meterCard/singleControlMeter/SingleControlMeter.vue"

import deviceCardMixin from "common/mixin/deviceCardMixin";
import {alarm_flag , update_alarm} from "common/constant/demand";
export default {
    methods: {
        alarm_flag(x)   {alarm_flag(x)},
        update_alarm(x) {update_alarm(x)},
    },
  components: {
    normalMeterCard,
    multiControlMeterCard,
    singleControlMeterCard
  },
  mixins: [deviceCardMixin],
  created() {
    this.alarm_flag(true);
    this.update_alarm(); 
    this.$store.dispatch("getSolutionData").then(() => {
      this.getCard("energy");
    });
  },
  beforeDestroy() {
    this.alarm_flag(false);
  },
};
</script>

