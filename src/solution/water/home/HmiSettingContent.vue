<template>
  <div class="hmi_setting_content" style="height: 5vh; position: absolute; align-items: center;">
    <div style="line-height:2.5">
      <span>
        <slot name="hmiSettingName"></slot>
      </span>
      <select id="title_select" style="width: 35vw;height: 3.5vw;" v-model="selectId"  @change="selectChange">
        <option v-for="(item, index) in devicelist" :key="index" :value="item.deviceId">{{item.deviceName}}</option>
      </select>
    </div>
  </div>
</template>

<script>
import { getCurrentDemandId } from "./temp"

export default {
  props: {
    devicelist: {
      type: Array,
      default: []
    },
  },
  data() {
    return {
      selectName: "",
      selectId: "",
      devIndex: 0
    }
  },
  // model: {
  //   prop: 'value', // props接受的变量名称
  //   event: 'change' //定义一个方法
  // },
  mounted() {
  },
  methods: {
    selectChange(e) {
      // //console.log('子組件')
      this.$emit('selectChange', this.selectId)
      // this.devIndex = e.target.options.selectedIndex;
    },
    getFirstDeiveId() {
      // return this.devicelist[this.devIndex].deviceId
    },
  },
  watch: {
    devicelist: function() {
      this.devIndex = getCurrentDemandId(this.devicelist);
      this.selectName = this.devicelist[this.devIndex]?.deviceId
      this.selectId = this.devicelist[this.devIndex]?.deviceId
      this.selectChange()
    }
  }
};
</script>

<style scoped>
.hmi_setting_content {
  display: flex;
  color: #ffffff;
  font-weight: bold;
  height: 80vh;
  width: 90vw;
  margin: auto;
  flex-direction: column;
  justify-content: space-evenly;
  font-size: 2.5vw;
  z-index: 5;
}

.hmi_setting_content button {
  background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
  border-width: 0px;
  color: #ffffff;

  font-weight: bold;
  border-radius: 1vw;
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

.hmi_setting_content input[type="checkbox"] {
  width: 4vmin;
  height: 4vmin;
}

.hmi_setting_content input[type="radio"] {
  width: 4vmin;
  height: 4vmin;
}

.hmi_list_content {
  display: flex;
  flex-direction: column;
  color: #ffffff;
  font-weight: bold;
  width: 100vw;
}

.hmi_list_content_title {
  display: flex;
  width: 100vw;
  height: 15vh;
  align-items: center;
  color: #01ffff;
  font-size: 2.5vw;
}

.hmi_list_content_item {
  display: flex;
  width: 100vw;
  height: 13vh;
  align-items: center;
  font-size: 2vw;
}

.hmi_list_content_icon {
  width: 5vw;
}
</style>