<template>
  <div class="DEVICEINFO_CONTENT_PAGE">
    <div
      class="content_page__title"
      style="display: flex; justify-content: space-between"
    >
      <div style="display: flex; width: 30vw">
        <span class="content_page__title__text">{{ devName }}</span>
      </div>
      <div
        style="
          width: 12vw;
          font-size: 5vmin;
          display: flex;
          align-items: center;
        "
      >
        <div class="STOPWATCH__img" style="height: 6vmin; width: 6vmin"></div>
        <span name="reciprocal_time" style="color: #ffff33">{{ reciprocalTime }}</span>
      </div>
      <div
        style="
          display: flex;
          align-items: center;
          font-size: 5vmin;
          width: 30vw;
        "
      >
        <span style="font-size: 4vmin">{{ $t('GENERAL.CURRENT_DEMAND') }}</span>
        <span
          name="540300"
          style="width: 15vw; text-align: right; color: #ffff33"
          >{{ demand }}</span
        >
        <span name="540300_unit">kW</span>
      </div>
    </div>
    <div class="demand__info">
      <div>
        <img
          name="guard_lamp"
          style="width: 5vw"
          :src="greenImg"
          @click="closeAlarm"
        />
      </div>
      <div>
        <img
          name="guard_lamp_r"
          style="width: 5vw"
          :src="redImg"
          @click="closeAlarm"
        />
      </div>
      <div style="width: 58vw; margin: 0 1.0vw">
        <div style="display: flex; justify-content: space-between">
          <div>
            <span>{{ $t('GENERAL.CONTRACT_CAPACITY') }}:</span>
            <span name="contractCap">{{ contractCap }}</span>
            <span>kW</span>
          </div>
          <div>
            <span>{{ $t('GENERAL.UNLOAD_VALUE') }}:</span>
            <span name="offloadValue">{{ offloadValue }}</span>
            <span>kW</span>
          </div>
          <div>
            <span>{{ $t('GENERAL.ALARM_VALUE') }}:</span>
            <span name="alarmValue">{{ alarmValue }}</span>
            <span>kW</span>
          </div>
          <div>
            <span>{{ $t('GENERAL.RETURN_VALUE') }}:</span>
            <span name="resetValue">{{ resetValue }}</span>
            <span>kW</span>
          </div>
        </div>
      </div>
    </div>
    <div class="content_page__chart_view">
      <canvas id="demand_chart"></canvas>
    </div>
    <div style="display: flex; justify-content: space-between">
      <span name="offloadMode">{{ offloadMode }}</span>
      <span name="forecastMode">{{ forecastMode }}</span>
      <div>
        <span>{{ $t('GENERAL.DEMAND_OFFSET_VALUE') }}:</span>
        <span name="offsetValue">&nbsp;{{ offset_min }}</span>
        <span>min</span>
      </div>
    </div>
  </div>
</template>

<script>
import Chart from "chart.js";
import chartjsPluginAnnotation from "chartjs-plugin-annotation";

import quarterTimer from "@/solution/energy/utils/quarterTimer"

import { getDemandList, closeAlarm } from "network/demand";

export default {
  data() {
    return {
      devName: "",
      devId: this.$route.query.devId,
      DemandChart: {},
      chartjsPluginAnnotation: {},
      timer: null,
      get_demand_tmp: false,
      contractCap: null, //契約容量
      offloadValue: null, //卸載值
      alarmValue: null, //警報值
      resetValue: null,
      demand: null,
      offloadMode: "---------",
      forecastMode: "---------",
      greenAlarm: false,
      redAlarm: false,
      first_data_time: null,
      start_time_value: 0,
      end_time_value: 0,
      countDownTimer: null,
    };
  },
  mixins: [quarterTimer],
  async created() {
    this.devName = this.$store.state.deviceName[this.devId] || this.devId;
  },
  mounted() {
    this.chartjsPluginAnnotation = chartjsPluginAnnotation;
    this.init_demand_chart(); //建立圖表
    this.getDemandList();
    this.initCountDownTimer();

    this.timer = setInterval(() => {
      if (!this.$store.state.Disconnected) {
        this.getDemandList();
      }  
    }, 3000);
  },
  beforeDestroy() {
    this.DemandChart = null;
    this.chartjsPluginAnnotation = null;
    clearInterval(this.timer);
    clearInterval(this.countDownTimer);
  },
  computed: {
    greenImg() {
      if (this.greenAlarm) {
        return require("@/assets/images/guard_lamp.gif");
      } else {
        return require("@/assets/images/guard_lamp.png");
      }
    },
    redImg() {
      if (this.redAlarm) {
        return require("@/assets/images/guard_lamp_r.gif");
      } else {
        return require("@/assets/images/guard_lamp_r.png");
      }
    },
    vdemand_dev_id(){
      return this.$store.state.deviceDemand[this.devId].vdemand_dev_id
    },
    offset_min(){
      return this.$store.state.deviceDemand[this.devId].offset_val || 0
    },
  },
  methods: {
    initCountDownTimer(){
      this.countDownTimer = setInterval(() =>{
        if(!this.end_time_value) return;
        let now_time = new Date().setSeconds(0);
        //倒數計時分鐘數
        this.minutes_value = parseInt((this.end_time_value - now_time)/60000);
      }, 1000);
    },
    getDemandList() {
      getDemandList(this.devId).then((res) => {
        //給予各需量設定值數據
        this.contractCap = res.contractCap; //契約容量
        this.offloadValue = res.offloadValue //卸載值
        this.alarmValue = res.alarmValue //警報值
        this.resetValue = res.resetValue //復歸值
        //給予紅綠燈狀態 
        this.getDemandData(res)

        switch (res.offloadMode) {
          // 卸載模式: 1=直接卸載, 2=先卸載、先復歸, 3=先卸載、後復歸, 4=不卸載。
          case "1":
            this.offloadMode = this.$t("GENERAL.DEMAND_UNLOAD_MODE_1");
            break;
          case "2":
            this.offloadMode = this.$t("GENERAL.DEMAND_UNLOAD_MODE_2");
            break;
          case "3":
            this.offloadMode = this.$t("GENERAL.DEMAND_UNLOAD_MODE_3");
            break;
          case "4":
            this.offloadMode = this.$t("GENERAL.DEMAND_UNLOAD_MODE_4");
            break;
        }

        switch (res.forecastMode) {
          //需量預測模式: 1=同步模式, 2=滑動模式。
          case "1":
            this.forecastMode = this.$t("GENERAL.DEMAND_PRED_MODE_1");
            break;
          case "2":
            this.forecastMode = this.$t("GENERAL.DEMAND_PRED_MODE_2");
            break;
        }

        var demand_tmp = JSON.parse(res.demand_tmp);

        // //console.log(res.demand_tmp)

        //需量資料
        //20220901
        /*
            新增如果是固定式，起始時間應該要被歸0，且第一筆資料會是從0開始
        */
        //時間軸 //起始時間
        let start_time = new Date()
        start_time.setSeconds(0)
        
        let s  = ((parseInt(start_time.getMinutes() / 15)) * 15) + parseInt(this.offset_min)
        if(start_time.getMinutes() >= s + 15){
            s += 15
        }else if(start_time.getMinutes() < s){
            s -= 15
        }
        
        start_time.setMinutes(s)
        start_time.setMilliseconds(0)
        
        let data_arr = [];
        if(res.forecastMode == '1'){
            data_arr.push({
                x:start_time,
                y:"0"
            })
        }
        demand_tmp.demands.forEach((demand_info) => {
            let y = "0"
            switch(res.forecastMode){
                case "1":
                    y = demand_info.D
                    break;
                case "2":
                    y = demand_info.D_r
                    break;
            }
            if(start_time.getTime() !=  Date.parse(demand_info.ts)){
                data_arr.push({
                    x: Date.parse(demand_info.ts),
                    y: y,
                });
            }
            
        });
        this.DemandChart.data.datasets[0].data = data_arr;
        //給予註解線
        this.DemandChart.options.annotation.annotations[0].value =res.contractCap;
        this.DemandChart.options.annotation.annotations[1].value =res.offloadValue;
        this.DemandChart.options.annotation.annotations[2].value =res.alarmValue;
        this.DemandChart.options.annotation.annotations[3].value =res.resetValue;
        this.DemandChart.options.scales.yAxes[0].ticks.max = (
          Number(res.contractCap) * 1.1
        ).toFixed(4);
        
        
        //結束時間
        var add_quarter = new Date(start_time.valueOf() + 14*60000);
        this.end_time_value = add_quarter.setSeconds(0);
        var demand_end_time = new Date(this.end_time_value);
        var current_demand = null;
        var demand_predic = null;

        res.data.forEach((ist_data) => {
          switch (ist_data.id) {
            case "540300":
              current_demand = ist_data.value;
              this.demand = ist_data.value;

              break;
            case "540100":
              demand_predic = ist_data.value;

              break;
          }
        });

        //預測線與X軸
        let x_start_time = new Date(res.time)
        if (current_demand != null && demand_predic != null) {
          this.DemandChart.data.datasets[1].data = [
            { x: x_start_time, y: current_demand },
            { x: demand_end_time, y: demand_predic },
          ];
          this.DemandChart.data.datasets[2].data = [
            { x: demand_end_time, y: demand_predic },
          ];
        }
        this.DemandChart.update();
      });
    },

    closeAlarm() {
      closeAlarm(this.vdemand_dev_id).then(res => {
        //console.log(res)
      })
    },

    init_demand_chart() {
      //需量圖表
      var ctx = document.getElementById("demand_chart").getContext("2d");
      var DemandChart = new Chart(ctx, {
        type: "line",
        data: {
          datasets: [
            {
              label: "目前需量",
              data: [],
              backgroundColor: "rgba(0, 240, 240, 0.0)",
              borderColor: "#00ff66",
              pointBackgroundColor: "#f9ed58", //正常
              pointBorderWidth: 0.1,
              lineTension: 0, // 曲線
              borderJoinStyle: "round", //彎角
              borderCapStyle: "round",
              borderWidth: 4,
              pointRadius: 3,
              pointHoverRadius: 6,
            },
            {
              label: "預測需量線",
              data: [],
              backgroundColor: "rgba(0, 240, 240, 0.0)",
              borderColor: "#b6d100",
              pointBackgroundColor: "rgba(178, 255, 89, 0.0)", //正常
              pointBorderWidth: 0.0,
              lineTension: 0, // 曲線
              borderJoinStyle: "round", //彎角
              borderCapStyle: "round",
              borderWidth: 4,
              pointRadius: 0,
              pointHoverRadius: 0,
            },
            {
              label: "預測需量",
              data: [],
              backgroundColor: "rgba(0, 240, 240, 0.0)",
              borderColor: "rgba(158, 158, 158, 0.0)",
              pointBackgroundColor: "#e7e5e8", //正常
              pointBorderWidth: 0.0,
              lineTension: 0, // 曲線
              borderJoinStyle: "round", //彎角
              borderCapStyle: "round",
              borderWidth: 4,
              pointRadius: 3,
              pointHoverRadius: 6,
            },
          ],
        },
        options: {
          scales: {
            xAxes: [
              {
                type: "time",
                distribution: "linear",
                time: {
                  displayFormats: {
                    day: "YYYY/MM/DD",
                    hour: "YYYY/MM/DD hA",
                    minute: "mm",
                  },
                  stepSize: 1,
                  unit: "minute",
                },
                bounds: "ticks",
                gridLines: {
                  color: "rgba(240, 240, 240, 0.1)",
                },
                ticks: {
                  fontColor: "#ffff00",
                  fontSize: 12,
                  source: "auto",
                  stepSize: 1,
                },
              },
            ],
            yAxes: [
              {
                ticks: {
                  fontColor: "#ffff00",
                  fontSize: 12,
                  // 顯示單位
                  callback: function (value, index, values) {
                    return value + "kW";
                  },
                  min: 0,
                  max: 600,
                },
                gridLines: {
                  color: "rgba(240, 240, 240, 0.1)",
                },
              },
            ],
          },
          legend: {
            display: false,
          },
          tooltips: {
            mode: "nearest",
            intersect: false,
            titleFontSize: 20,
            bodyFontSize: 18,
            filter: function (tooltipItem, data) {
              var label = data.datasets[tooltipItem.datasetIndex].label;
              if (label == "預測需量線") {
                return false;
              } else if (
                Number(tooltipItem["value"]) >
                Number(
                  DemandChart["options"]["scales"]["yAxes"][0]["ticks"]["max"]
                )
              ) {
                return false;
              } else {
                return true;
              }
            },
            callbacks: {
              label: function (tooltipItem, data) {
                return (
                  data.datasets[tooltipItem.datasetIndex].label +
                  ":" +
                  tooltipItem.yLabel +
                  "kW"
                );
              },
            },
          },
          hover: {
            mode: "index",
            intersect: false,
          },
          animation: false,
          maintainAspectRatio: false,
          annotation: {
            annotations: [
              {
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-0",
                value: "500",
                borderColor: "#6670d9",
                borderWidth: 4,
                label: {
                  xAdjust: -300,
                  fontSize: 16,
                  fontColor: "black",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  content: this.$t("GENERAL.CONTRACT_CAPACITY"),
                  enabled: true,
                },
              },
              {
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-0",
                value: "470",
                borderColor: "#ff4e33",
                borderWidth: 4,
                label: {
                  xAdjust: -100,
                  fontSize: 16,
                  fontColor: "black",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  content: this.$t("GENERAL.UNLOAD_VALUE"),
                  enabled: true,
                },
              },
              {
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-0",
                value: "440",
                borderColor: "#ff9922",
                borderWidth: 4,
                label: {
                  xAdjust: 100,
                  fontSize: 16,
                  fontColor: "black",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  content: this.$t("GENERAL.ALARM_VALUE"),
                  enabled: true,
                },
              },
              {
                type: "line",
                mode: "horizontal",
                scaleID: "y-axis-0",
                value: "400",
                borderColor: "#607D8B",
                borderWidth: 4,
                label: {
                  xAdjust: 300,
                  fontSize: 16,
                  fontColor: "black",
                  backgroundColor: "rgba(255, 255, 255, 0.5)",
                  content: this.$t("GENERAL.RETURN_VALUE"),
                  enabled: true,
                },
              },
            ],
            drawTime: "beforeDatasetsDraw", // (default)
          },
        },
      });
      this.DemandChart = DemandChart;
    },

    getDemandData(res) {
      if(!res) return
      for (let item of res.data) {
        switch (item.id) {
          case "540100": // 給予綠燈狀態
            if (
              parseFloat(item.value) > parseFloat(res.alarmValue)
            ) {
              this.greenAlarm = true;
            } else {
              this.greenAlarm = false;
            }
            break;
          case "540300": // 給予紅燈狀態
            if (
              parseFloat(item.value) > parseFloat(res.alarmValue)
            ) {
              this.redAlarm = true;
            } else {
              this.redAlarm = false;
            }
            break;
        }
      }
    },
  },
};
</script>

<style scoped>
.DEVICEINFO_CONTENT_PAGE {
  width: 75vw;
}
.content_page__title {
  display: flex;
  height: 15vh;
}
.content_page__title__text {
  font-size: 5vmin;
  align-self: center;
}
.STOPWATCH__img {
  background-image: url("~assets/images/stopwatch.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  height: 10vmin;
  width: 10vmin;
}
.demand__info {
  display: flex;
  justify-content: space-around;
  font-size: 2.5vmin;
}
.demand__button {
  background: linear-gradient(rgba(1, 255, 255, 0.5), rgba(33, 96, 184, 0.5));
  color: #ffffff;
  font-weight: bold;
  border-width: 0px;
  outline: none;
}
.content_page__chart_view {
  height: 45vh;
  padding-top: 2vh;
  margin-top: 3vh;
  background-color: rgba(234, 234, 234, 0.3);
}
</style>