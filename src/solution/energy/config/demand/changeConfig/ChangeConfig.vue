<template>
  <div class="hmi_setting_content">
    <div class="slaveM"             :style='stylerSize(100,20,0,0)'>
      <span class="font slaveL _48" :style='stylerSize(15,30,5,10)'> {{$t("GENERAL.SELECT_METER")}} </span> 
      <span class="slaveL _32"      :style='stylerSize(15,30,25,2)'>{{ $t("GENERAL.TARGET_METER") }}:</span>
      <select class="slaveL _32"    :style='stylerSize(30,30,25,30)' value="IN11-HSI-HMIGW----09" v-model="currentConfig.srcId">
        <option v-for="(item, key) in meterList" :value="item.deviceId" :key="key"> {{ nameList[item.deviceId] || item.deviceId }} </option>
      </select>
    </div>

    <hr class="setting_hr slaveM" :style='stylerSize(100,0.5,0,15)' color="#000000" />
    <!-- 需量數值 -->
    <div class="slaveM" :style='stylerSize(100,20,0,20)'>
      <span class="font slaveL _48" :style='stylerSize(15,20,5,7)'> {{$t("GENERAL.VALUE_SETTING")}} </span>
      <div class="slaveL _32" v-for="(item, index) in valueList" :key="index" :style='stylerSize(20,60,20*index+25,0)'>
          <span class="slaveL" :style='stylerSize(60,50,0,0)'> {{ item.translation }}: </span>
          <input class="hmi_setting_content_input slaveL" :style='stylerSize(50,50,0,50)'
            :value=" currentConfig.threshold && currentConfig.threshold.split('_')[index] "
            @input="changeDemandThreshold(index, $event)" />
          <span class="slaveL" :style='stylerSize(30,50,52,50)'> kW </span>
      </div>
    </div>

    <hr class="setting_hr slaveM" :style='stylerSize(100,0.5,0,35)' color="#000000" />
    <!-- 警報設定 -->
    <div class="slaveM" :style='stylerSize(100,20,0,40)'>
      <span class="font slaveL _48" :style='stylerSize(100,20,5,7)'> {{ $t("GENERAL.ALARM_SETTING") }} </span>
      <div class="slaveL _32" v-for="(item, index) in alarmList" :key="item.value" :style='stylerSize(20,60,35*index+25,10)'>
        <div class="slaveL" :style='stylerSize(50,50,0,10)'> {{ item.text }} </div> 
        <img class="slaveL" :style='stylerSize(20,50,37,10)' :src="item.src"  /> 
        <input class="slaveL" :style='stylerSize(30,50,50,10)' v-if="item.value == 'systemAlarm'" 
          :checked="currentConfig.system_alarm" type="checkbox" @input="alarmChange($event)">
        <button class="slaveC" :style='stylerSize(40,50,57,10)' v-if="item.value == 'entityAlarm'" 
          @click="setAlarm"> {{ $t("GENERAL.SET") }} </button>
      </div>
    </div>

    <hr class="setting_hr slaveM" :style='stylerSize(100,0.5,0,55)' color="#000000" />
    <!-- 卸載模式 -->
    <div class="slaveM" :style='stylerSize(100,20,0,60)'>
      <span class="font slaveL _48" :style='stylerSize(15,20,5,7)'> {{ $t("GENERAL.DEMAND_UNLOAD_MODE")}} </span>
      <div class="slaveL _32" v-for="(item,index) in demandUnload" :key="item.value" :style='stylerSize(20,60,20*index+25,15)'>
        <input class="slaveL" :style='stylerSize(60,50,-24,0)' type="radio" name="offloadMode" 
            @change="setMode(item.value, 0)" :checked="selectedUnload(0)==item.value"  />
        <div class="slaveL" :style='stylerSize(70,50,15,0)'> {{ item.text}} </div>
      </div>
    </div>

    <hr class="setting_hr slaveM" :style='stylerSize(100,0.5,0,75)' color="#000000" />
    <!-- 來源判斷 -->
    <div class="slaveM" :style='stylerSize(100,20,0,80)'>
      <span class="font slaveL _48" :style='stylerSize(15,20,5,7)'>{{ $t("GENERAL.SOURCE_RULE") }}</span>
      <div class="slaveL _32"  v-for="(item,index) in sourceSelect" :key="item.value" :style='stylerSize(20,60,35*index+25,15)'>
        <input class="slaveL" :style='stylerSize(60,50,-24,0)' type="radio" name="sourceSelect_value" 
          @change="setMode(item.value, 2)" :checked="selectedUnload(2)==item.value"/>    
        <div class="slaveL" :style='stylerSize(70,50,15,0)'>{{item.text }}</div>
      </div>
    </div>

    <hr class="setting_hr slaveM" :style='stylerSize(100,0.5,0,95)' color="#000000" />
    <!-- 需量預測模式 -->
    <div class="slaveM" :style='stylerSize(100,20,0,100)'>
      <span class="font slaveL _48" :style='stylerSize(20,20,5,7)'> {{$t("GENERAL.DEMAND_PRED_MODE")}} </span>
      <div class="slaveL _32" v-for="(item,index) in forecastMode" :key="item.value" :style='stylerSize(20,60,35*index+25,15)'>
        <input class="slaveL" :style='stylerSize(60,50,-24,0)' type="radio" name="forecastMode_value" @change="setMode(item.value, 1)"
            @click = avoidDoubleClick() :disabled="disabled" v-bind:value=item.value 
            v-model="currentPreMode" :checked="selectedUnload(1)==item.value" />
        <div class="slaveL" :style='stylerSize(70,50,15,0)'> {{ item.text}} </div>
      </div>

      <div v-if="currentPreMode==1" >
          <span class="font slaveL _24" :style='stylerSize(22,65,36.5,3)' 
            style="box-shadow: rgba(0, 0, 180, 0.35) 0px 3px 5px; padding: 1.2% 1.3%;"> {{$t("GENERAL.VALUE_SETTING")}} 
          </span>
          <span class="slaveL _20" :style='stylerSize(7,20,37.5,35)'> {{$t("GENERAL.DEMAND_OFFSET_VALUE")}}: </span>
          <input class="slaveL _24" :style='stylerSize(11,32,44.5,23)' type="text" 
            @input="changeDemandOffset($event)"
            :placeholder="offsetVal"/>
          <span class="slaveL _20" :style='stylerSize(3,15,56,30)'> {{$t("GENERAL.MINUTE")}} </span>
      </div>
    </div>

    <hr class="setting_hr slaveM" :style='stylerSize(100,0.5,0,115)' color="#000000" />
    <!-- 設備卸載 -->
    <div class="slaveM" :style='stylerSize(100,20,0,120)'>
      <span class="font slaveL _48" :style='stylerSize(15,20,5,7)'> {{$t("GENERAL.DEVICE_UNLOAD")}} </span>
      <div class="slaveL _32" :style='stylerSize(20,60,25,15)' id="offload_devicelist_do" style="width: 50%"></div>
      <button class="slaveC _32" :style='stylerSize(8,30,44,15)' @click="goToUnstallConfig"> {{ $t("GENERAL.SET") }} </button>
      <span class="slaveL _32" :style='stylerSize(20,60,53,15)'>{{ $t("GENERAL.CONTROL_COUNT") }}:</span>
      <span class="slaveL _32" :style='stylerSize(20,60,62,15)' id="offload_devicecount_do">{{ currentConfig.off_dev && currentConfig.off_dev.length }}</span>     
    </div>
    
  </div>
</template>

<script>
import dataList from "../mixin/dataList";
import demandStoreMixin from "../mixin/demandStoreMixin";
import demandModeMixin from "../mixin/demandModeMixin"
import DialogBox from "components/content/dialog/Dialog";
import * as types from "../store/mutation-types";

import { createNamespacedHelpers } from 'vuex'
const { mapMutations: mapDemandMutations } = createNamespacedHelpers('demand')

export default {
  components: {
    DialogBox,
  },
  data() {
    return {
      devId: this.$route.query.devId,
      nameList: [],
      cardType:["normalMeterCard"],
      disabled: false,
      timeout: null,
      currentPreMode: "",
      offsetVal: 0,
    };
  },
  mixins: [
    demandStoreMixin,
    demandModeMixin,
    dataList,
  ],
  async created() {
    this.nameList = this.$store.state.deviceName;
    if(Object.keys(this.currentConfig).length > 0) {
      this.currentPreMode = this.currentConfig.mode.split('_')[1];
      this.offsetVal = this.currentConfig.offset_val || 0;
    }
    // 編輯
    if(this.currentConfig.srcId){
      await this[types.GET_METER_LIST](this.currentConfig.srcId);
    }
    // 新增
    else{
      await this[types.GET_METER_LIST]();
      this.currentConfig.srcId = this.meterList[0].deviceId;
      this.$forceUpdate();
    }
  },
  mounted() {
    this.$bus.$on("configLoad", async () => {
      if (this.devId) {
        this[types.MODIFY_DEMAND_LIST]();
        this.$router.back();
      } else {
        this[types.ADD_DEMAND_LIST]();
        this.$router.back();
      }
    });
  },
  beforeDestroy() {
    this.$bus.$off("configLoad");
  },
  methods: {
    async afterCreateStore() {
      // 創建暫存資料
    console.log(this.devId)
      if (!Object.keys(this.currentConfig).length) {
        if (this.devId) {
          await this[types.GET_CURRENT_DEVICE](this.devId);
        } else {
          await this[types.GET_CURRENT_DEVICE]();
        }
      }
      // 獲取電錶清單
      await this.$store.dispatch("getSolutionData");
    },
    ...mapDemandMutations([
      types.CHANGE_DEMAND_VALUE,
			types.CHANGE_DEMAND_ALARM,
      types.CHANGE_DEMAND_OFFSET
    ]),
    //THRESHOLD
    changeDemandThreshold(index, e) {
      e.target.value = e.target.value.replace(/[^\d.]/g,'')
      if ( e.target.value > 9999 ) {
        e.target.value = 9999
      }
      const oldArr = this.currentConfig.threshold.split('_')
      oldArr[index] = e.target.value
      const newString = oldArr.join("_")
      this[types.CHANGE_DEMAND_VALUE] (newString)
    },
    //ALARM
    alarmChange(e){
			if (e.target.checked) {
				this[types.CHANGE_DEMAND_ALARM] (1)
			} else {
				this[types.CHANGE_DEMAND_ALARM] (0)
			}
		},
		setAlarm(){
			const path = this.$route.path + '/alarmConfig'
			this.$router.push({
				path: path,
				query: {
					devId: this.$route.query.devId,
				}
			});
		},
    ////DEMAND PREDICTION MODE
    changeDemandOffset(e) {
      //e.target.value = e.target.value.replace(/[^\d.]/g,'')
      if ( e.target.value > 14 ) {
        e.target.value = 14
      }if ( e.target.value < -14 ) {
        e.target.value = -14
      }if ( !e.target.value ) {
        e.target.value = 0
      }
      this[types.CHANGE_DEMAND_OFFSET] (e.target.value)
    },
    avoidDoubleClick () {
      //解決按鈕點擊延遲問題
      this.disabled = true

      // Re-enable after 0.5 second
      this.timeout = setTimeout(() => {
        this.disabled = false;
      }, 500)
    },
    ////DEVICE UNLOAD
    goToUnstallConfig(){
      this.$router.push({
        path: "demand/unstallConfig",
        query: {
          devId: this.$route.query.devId,
        },
      });
    }
  },
};
</script>
