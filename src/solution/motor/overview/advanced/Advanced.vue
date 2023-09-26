<template>
  <div id="meter_demand_chart" class="DEVICEINFO_CONTENT_PAGE">
			<div class="content_page__title">
				<span class="content_page__title__text" name="device_name">感測器計算</span>
			</div>
			<div class="demand__info">
				<div>
					<img name="guard_lamp" style="width:7vmin;" src="~assets/images/guard_lamp.png">
				</div>
				<div>
					<span>{{ $t('GENERAL.CONTRACT_CAPACITY') }}</span>
					<span name="contractCap"></span>
					<span>kW</span>
				</div>
				<div>
					<span>{{ $t('GENERAL.UNLOAD_VALUE') }}</span>
					<span name="offloadValue"></span>
					<span>kW</span>
				</div>
				<div>
					<span>{{ $t('GENERAL.ALARM_VALUE') }}</span>
					<span name="alarmValue"></span>
					<span>kW</span>
				</div>
				<div>
					<span>{{ $t('GENERAL.RETURN_VALUE') }}</span>
					<span name="resetValue"></span>
					<span>kW</span>
				</div>
				<div>
					<div>
						<button class="demand__button">{{ $t('GENERAL.DEMAND_UNLOAD_MODE') }}</button>
					</div>
				</div>
			</div>
			<div class="content_page__chart_view">
				<canvas id="demand_chart"></canvas>
			</div>
			<div style="display: flex;justify-content: space-between;">
				<span name="offloadMode"></span>
				<span name="forecastMode"></span>
			</div>
		</div>
</template>

<script>
import Chart from 'chart.js';

export default {
  mounted() {
    this.init_demand_chart()
  },
  methods: {
    init_demand_chart(){
				//需量圖表 
				var DemandChart;
				var ctx = document.getElementById("demand_chart").getContext("2d");
				DemandChart = new Chart(ctx, {
					type: "line",
					data: {
						datasets: [{
							label: "目前需量",
							data: [],
							backgroundColor: "rgba(0, 240, 240, 0.0)",
							borderColor: "#00ff66",
							pointBackgroundColor: "#f9ed58",  //正常
							pointBorderWidth: 0.1,
							lineTension: 0,  // 曲線
							borderJoinStyle: "round", //彎角
							borderCapStyle: "round",
							borderWidth: 4,
							pointRadius: 3,
							pointHoverRadius: 6
						},
						{
							label: "預測需量線",
							data: [],
							backgroundColor: "rgba(0, 240, 240, 0.0)",
							borderColor: "#b6d100",
							pointBackgroundColor: "rgba(178, 255, 89, 0.0)",  //正常
							pointBorderWidth: 0.0,
							lineTension: 0,  // 曲線
							borderJoinStyle: "round", //彎角
							borderCapStyle: "round",
							borderWidth: 4,
							pointRadius: 0,
							pointHoverRadius: 0
						},
						{
							label: "預測需量",
							data: [],
							backgroundColor: "rgba(0, 240, 240, 0.0)",
							borderColor: "rgba(158, 158, 158, 0.0)",
							pointBackgroundColor: "#e7e5e8",  //正常
							pointBorderWidth: 0.0,
							lineTension: 0,  // 曲線
							borderJoinStyle: "round", //彎角
							borderCapStyle: "round",
							borderWidth: 4,
							pointRadius: 3,
							pointHoverRadius: 6
						}]
					},
					options: {
						scales: {
							xAxes: [{
								type: "time",
								distribution: "linear",
								time: {
									displayFormats: {
										day: "YYYY/MM/DD",
										hour: "YYYY/MM/DD hA",
										minute: "mm"
									},
									stepSize: 1,
									unit: "minute",
								},
								bounds: "ticks",
								gridLines: {
									color: "rgba(240, 240, 240, 0.1)"
								},
								ticks: {
									fontColor: "#ffff00",
									fontSize: 12,
									source: "auto",
									stepSize: 1,
								}
							}],
							yAxes: [{
								ticks: {
									fontColor: "#ffff00",
									fontSize: 12,
									// 顯示單位
									callback: function(value, index, values) {
										return value + "kW";
									},
									min: 0,
									max: 600,
								},
								gridLines: {
									color: "rgba(240, 240, 240, 0.1)"
								},
							}],
						},
						legend: {
							display: false
						},
						//HistoryChart.options.tooltips.callbacks.label = function(tooltipItem, data){return label_name+":"+tooltipItem.yLabel+yAxes_unit;};
						tooltips: {
							mode: "nearest",
							intersect: false,
							titleFontSize: 20,
							bodyFontSize: 18,
							filter: function (tooltipItem, data) {
								
								var label = data.datasets[tooltipItem.datasetIndex].label;
								if (label == "預測需量線") {
									return false;
								}
								else if(tooltipItem["value"] > DemandChart["options"]["scales"]["yAxes"][0]["ticks"]["max"]){
									return false;
								}
								else {
									return true;
								}
							},
							callbacks:{
								label: function(tooltipItem, data){
									return data.datasets[tooltipItem.datasetIndex].label+":"+tooltipItem.yLabel+"kW";
								}
							}
						},
						hover: {
							mode: "index",
							intersect: false
						},
						animation: false,
						maintainAspectRatio: false,
						annotation: {
							annotations: [{
								type: "line",
								mode: "horizontal",
								scaleID: "y-axis-0",
								value: "500",
								borderColor: "#6670d9",
								borderWidth: 4,
								label: {
									xAdjust: -300,
									fontSize: 16,
									fontColor: 'black',
									backgroundColor: 'rgba(255, 255, 255, 0.5)',
									content: this.$t('GENERAL.CONTRACT_CAPACITY'),
									enabled: true
								}
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
									fontColor: 'black',
									backgroundColor: 'rgba(255, 255, 255, 0.5)',
									content: this.$t('GENERAL.UNLOAD_VALUE'),
									enabled: true
								}
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
									fontColor: 'black',
									backgroundColor: 'rgba(255, 255, 255, 0.5)',
									content: this.$t('GENERAL.ALARM_VALUE'),
									enabled: true
								}
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
									fontColor: 'black',
									backgroundColor: 'rgba(255, 255, 255, 0.5)',
									content: this.$t('GENERAL.RETURN_VALUE'),
									enabled: true
								}
							}],
							drawTime: "afterDatasetsDraw" // (default)
						}
					}
				});
			}
  }

}
</script>

<style scoped>
.demand__info{
	display: flex;
	justify-content: space-around;
	font-size:2.5vmin;
}

.demand__button{
	background: linear-gradient(rgba(1,255,255,0.5),rgba(33,96,184,0.5));
	color: #ffffff;
	
	font-weight: bold;
	border-width: 0px;
	outline: none;
}

.DEVICEINFO_CONTENT_PAGE{
	width: 75vw;
  margin: auto;
      color: #ffffff;
    font-weight: bold;
}

.content_page__title{
	display: flex;
    height: 15vh;
}
.content_page__view{
	display: flex;
	flex-direction:row;
	height:63vh;
}

.attrname__type1, .attrname__type3{
	font-size: 4vmin;
}

.attrvalue__type1{
	font-size: 7vmin;
}

.attrunit__type1, .attrunit__type3{
	font-size: 3.5vmin;
}

.attrname__type2{
	font-size: 3.5vmin;
	display: inline-block;
    width: 8vw;
}

.attrvalue__type2{
	font-size: 4vmin;
	display: inline-block;
    width: 10vw;
}

.attrunit__type2{
	font-size: 3.5vmin;
}

.attrvalue__type3{
	font-size: 8vmin;
	margin: 0vh 4vw 0vh 0vw;
}

.attrname__type4{
	font-size: 3.5vmin;
	display: inline-block;
    width: 15vw;
}

.attrvalue__type4{
	font-size: 4vmin;
	display: inline-block;
    width: 15vw;
}

.content_page__attrvalue{
	color: #ffff33;
}

.content_page__attrunit{
	color: #c9c9c9;
}

.content_page__attr__view{
	width: 80%;
	border-width: 0px 0px 1px 0px;
    border-style: solid;
    border-image: linear-gradient(to right,#01ffff,#2160b8);
    border-image-slice: 1;
}

.content_page__attr__view--type1{
	margin: 3vh 0vw;
}

.content_page__attr__view--type2{
	margin: 2vh 0vw;
}

.content_page__attr__view--type3{
	margin: 1vh 0vw;
}

.content_page__attr__view--type4{
	margin: 3vh 0vw;
	width:90%;
	display: flex;
    justify-content: center;
	margin-left: 2vw;
}

.content_page__fieldset{
	width: 100%;
	height: 90%;
	border-width: 2px !important;
	border-style: solid;
	border-color: #01ffff;
}

.content_page__fieldset--left{
	border-right-width: 0px !important;
	border-radius: 10% 0px 0px 10%;
}

.content_page__fieldset--right{
	border-left-width: 0px !important;
	border-radius: 0px 10% 10% 0px;
}

.content_page__fieldset__legend{
	color: #01FFFF;
    font-size: 3.5vmin;
	text-align: center;
	width: auto;
}

.content_page__title__text{
	font-size:5vmin;
	align-self: center;
}

.content_page__icon_view{
	position: absolute;
	bottom: 3vh;
	right: 3vw;
}

.content_page__icon{
	height: 40vh;
}

.content_page__chart_view{
	height: 45vh;
	padding-top: 2vh;
	margin-top: 3vh;
	background-color: rgba(234, 234, 234, 0.3);
}

.filter__picker_item{
	background: linear-gradient(rgba(1,255,255,0.5),rgba(33,96,184,0.5));
    border: none;
    color: #ffffff;
    font-weight: bold;
    text-align: center;
    font-size: 2vmin;
    height: 4vh;
}

option{
	background-color: rgba(33,96,184,1);
	color: #ffffff;
	
	font-weight: bold;
}

</style>