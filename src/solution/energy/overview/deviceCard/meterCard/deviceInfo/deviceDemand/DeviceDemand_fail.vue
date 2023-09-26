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
            <div style="width: 58vw; margin: 0 1vw">
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
            <div style="width: 8vw">
                <button class="demand__button">{{ $t('GENERAL.DEMAND_UNLOAD_MODE') }}</button>
            </div>
        </div>
        <div class="content_page__chart_view">
            <data-chart ref="dataChart"/>
            <!--<canvas id="demand_chart"></canvas>-->
        </div>
        <div style="display: flex; justify-content: space-between">
            <span name="offloadMode">{{ offloadMode }}</span>
            <span name="forecastMode">{{ forecastMode }}</span>
        </div>
    </div>
</template>

<script>
import Chart from "chart.js";
import chartjsPluginAnnotation from "chartjs-plugin-annotation";
//圖表
import DataChart from '@/components/common/dataChart/DataChart.vue';
import quarterTimerMixin from "common/mixin/quarterTimerMixin"

import { getDemandList, closeAlarm } from "network/demand";

export default {
    components:{
        DataChart,
    },
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
            vdemand_dev_id: null,
            mod : 0//0=0~15, 1= 15~30 , 2 = 30~45 , 3 = 45~60
        };
    },
    mixins: [quarterTimerMixin],
    created() {
        this.devName = this.$store.state.deviceName[this.devId] ?
            this.$store.state.deviceName[this.devId] : this.devId;
    },
    mounted() {
        this.chartjsPluginAnnotation = chartjsPluginAnnotation;
        this.init_demand_chart(); //建立圖表
        this.getDemandList();
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
    },
    methods: {
        getDemandList() {
            getDemandList(this.devId).then((res) => {
                this.vdemand_dev_id = res.vdemand_dev_id
                
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
                //需量資料
                let arr = [];
                var demand_tmp = JSON.parse(res.demand_tmp);
                let index = -1 ;
                let mod = this.mod
                demand_tmp.demands.forEach((demand_info) => {
                    ////console.log(demand_info)
                    ////console.log(Date.parse(demand_info.ts))
                    let y = 0
                    let x = Date.parse(demand_info.ts)
                    if (res.forecastMode == "1") {
                        //固定式
                        y = demand_info.D
                    }else if (res.forecastMode == "2") {
                        //滑動式
                        y = demand_info.D_r
                    }
                    x = x / (60 * 1000)  % 60 //算出現在是幾分
                    ////console.log( x)
                    
                    if( 15 > x && x >= 0 ){
                        mod = 0
                    }else if(30 > x &&  x >= 15){
                        mod = 1
                    }else if(45 > x && x >= 30){
                        mod = 2
                    }else if(60 > x && x >= 45){
                        mod = 3
                    }
                    if(index != x){
                        arr.push([x,y])
                        index = x
                    }
                    
                });
                //console.log(mod , this.mod)
                if(mod != this.mod){
                    this.$refs.dataChart.clearChart()
                    this.mod = mod
                }
                //目前需量
                let current_demand = 0
                //預測需量
                let demand_predic = 0
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
                
                
                
                //繪圖
                //參數設定
                let data = arr//需量的數據
                let max = 16 //Y軸最大
                //全域的label
                let gobel_label = {
                    formatter       : '{b}',
                    borderRadius    : [5, 5, 5, 5],
                    padding         : [5, 10, 5, 10],
                    fontSize        : 16
                }
                //--每條線的設定--
                //順序：契約容量-卸載值-警報直-賦歸直
                let name = [
                    this.$t("GENERAL.CONTRACT_CAPACITY"),
                    this.$t("GENERAL.UNLOAD_VALUE"),
                    this.$t("GENERAL.ALARM_VALUE"),
                    this.$t("GENERAL.RETURN_VALUE"),
                ]
                //線的顏色
                let itemStylecolor = [
                    '#6670d9',
                    '#ff4e33',
                    '#ff9922',
                    '#607D8B',
                ]
                //Y軸基準
                let yAxis = [
                    res.contractCap,
                    res.offloadValue,
                    res.alarmValue,
                    res.resetValue,
                ]
                //所在的點
                let position = [
                    'insideStartTop',
                    'insideMiddleTop',
                    'insideEndTop',
                    'insideStartTop',
                ]
                let ex = {
                    animationDuration: 15 * 1000,
                    textStyle: {
                        fontSize: 14
                    },
                    xAxis: {
                        type: 'value',
                        min : 0  + this.mod * 15,
                        max : 15 + this.mod * 15,
                    },
                    yAxis: {
                        type: 'value',
                        max : max+2,
                        axisLabel :{
                            formatter: function (value) {return value + 'kW'},
                        }
                    },
                    grid: {
                        top: 30,
                        left: 60,
                        right: 60,
                        bottom: 40
                    },
                    series: [
                        {
                            data: data,
                            type: 'line',
                            label:{
                                show: false,
                            },
                            itemStyle:{
                                color:"#00ff66",
                                width: 5,
                            },
                            markLine: {
                                silent: true,
                                label: gobel_label,
                                symbol: ['none', 'none'],
                                animation: false,
                                data: []
                            }
                        }
                    ]
                };
                //放入警報縣
                for(let i = 0 ; i < 4 ; i ++){
                    ex.series[0].markLine.data.push({
                        itemStyle:{color:itemStylecolor[i]},
                        name: name[i],
                        yAxis: yAxis[i],
                        label: {
                            backgroundColor: '#FFFFFF88',
                            color: '#000000',
                            show: true,
                            position: position[i],
                            distance : [0,-15],
                        },
                        lineStyle: {
                            width: 3,
                            type: 'solid',
                        },
                    });
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

                

                // //console.log(res.demand_tmp)

                
                /*
                //給予註解線
                this.DemandChart.options.annotation.annotations[0].value =
                    res.contractCap;
                this.DemandChart.options.annotation.annotations[1].value =
                    res.offloadValue;
                this.DemandChart.options.annotation.annotations[2].value =
                    res.alarmValue;
                this.DemandChart.options.annotation.annotations[3].value =
                    res.resetValue;
                this.DemandChart.options.scales.yAxes[0].ticks.max = (
                    Number(res.contractCap) * 1.1
                ).toFixed(4);

                //進行時間區間的判斷
                var instant_time = res.time;
                var now_time = new Date();
                now_time.setSeconds(0);
                now_time.setMilliseconds(0);
                var moment = parseInt(now_time.getMinutes() / 15);
                now_time.setMinutes(moment * 15);
                now_time.setMinutes((moment + 1) * 15);
                var demand_end_time = now_time.getTime();
                var demand_last_update_time = instant_time;
                var current_demand = null;
                var demand_predic = null;

                

                //預測線與X軸
                if (current_demand != null && demand_predic != null) {
                    this.DemandChart.data.datasets[1].data = [
                        { x: demand_last_update_time, y: current_demand },
                        { x: demand_end_time, y: demand_predic },
                    ];
                    this.DemandChart.data.datasets[2].data = [
                        { x: demand_end_time, y: demand_predic },
                    ];
                }
                this.DemandChart.update();
                */
                
                this.$refs.dataChart.createBar([] , [] , 'bar' , {} , ex);
            });
        },

        closeAlarm() {
            closeAlarm(this.vdemand_dev_id).then(res => {
                //console.log(res)
            })
        },

        init_demand_chart() {
            //需量圖表
            this.$refs.dataChart.clearChart();
            let ex = {
                    textStyle: {
                        fontSize: 14
                    },
                    xAxis: {
                        type: 'value',
                        min : 0  + this.mod * 15,
                        max : 15 + this.mod * 15,
                    },
                    yAxis: {
                        type: 'value',
                        max : 20,
                        axisLabel :{
                            formatter: function (value) {return value + 'kW'},
                        }
                    },
                    grid: {
                        top: 30,
                        left: 60,
                        right: 60,
                        bottom: 40
                    },
                    series: [
                    ]
                };
            let tmp = this.$refs.dataChart.createBar([] , [] , 'bar' , {} , ex);
            //console.log("👴👴👴👴👴")
            //console.log(tmp)
        },

        getDemandData(res) {
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