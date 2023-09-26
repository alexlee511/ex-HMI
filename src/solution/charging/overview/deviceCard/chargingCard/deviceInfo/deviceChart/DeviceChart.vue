<template>
	<div>
		<div class="DEVICEINFO_CONTENT_PAGE">
			<div class="content_page__title">
				<span class="content_page__title__text">{{ devName }}</span>
			</div>
			<div style="display: flex">
				<div style="display: flex">
					<date-pick ref="firstDate" @pickDate="pickFirstDate"></date-pick>
					<select class="filter__picker_item" v-model="startTime">
						<option v-for="(item, index) in hour" :key="index" :value="item">
							{{ item }}
						</option>
					</select>
					<span style="font-size: 1vw; margin-right: 0.5vw;">~</span>
					<date-pick ref="lastDate" @pickDate="pickLastDate"></date-pick>
					<select class="filter__picker_item" v-model="endTime">
						<option v-for="(item, index) in hour" :key="index" :value="item">
							{{ item }}
						</option>
					</select>
					<select class="filter__picker_item" v-model="attr_now">
						<option v-for="(attr, attr_index) in attr_list" :key="attr_index">
							{{ attr }}
						</option>
					</select>
					<select class="filter__picker_item" v-model="pile_now">
						<option v-for="(id, index) in pileList" :key="index">
							{{ id }}
						</option>
					</select>
				</div>
				<div style="display: flex; flex: 8; justify-content: flex-end; align-self: center;">
					<button class="filter__picker_item" style="margin-left: 10vmin" @click="query_Date">
						{{ $t("GENERAL.SEARCH") }}
					</button>
				</div>
			</div>
			<div class="content_page__chart_view" v-loading="loading"
				element-loading-lock="true"
				element-loading-background="transparent"
				element-loading-text="Loading"
				element-loading-spinner="el-icon-loading"
				element-loading-custom-class="create-isLoading">
				<data-chart ref="dataChart"></data-chart>
			</div>
		</div>
	</div>
</template>

<script>
import DatePick from "components/common/datePick/DatePick";
import deviceChartMixin from "common/mixin/deviceChartMixin";
import DataChart from '@/components/common/dataChart/DataChart.vue';
import { getOldData } from "network/history"
import { formatDate } from "common/utile/utile";

export default {
	components: {
		DatePick,
		DataChart,
	},
	mixins: [deviceChartMixin],
	data() {
		return {
			attrValue:{
				0: '103800',
				1: '500500',
				2: '500600',
			},
			attr_list : {
				0: this.$t("CHARGING.CHARGING_STATUS"), 
                1: this.$t("CHARGING.CHARGING_VOLTAGE"),
                2: this.$t("CHARGING.CHARGING_ELECTRICITY"),
			},
			attr_now: '',
			attrKey_now: 0,
			pile_now: '',
			devCard: this.$store.state.card,
			pileList: [],
			pileName: {},
		};
	},
	async created(){
		this.attr_now = this.attr_list[0];
		this.initflag = false;
		await this.initPileData()
	},
	async mounted(){
		await this.getChart(this.selectFirstTime, this.selectLastTime);
	},
	methods: {
		async initPileData(){
			for(let card of this.devCard){
				console.log(JSON.stringify(card,null,4))
				if(card.deviceId == this.devId){
					this.pile_now = await this.getPileId( this.devId, card.cntIdList[0])
					for(let i in card.cntIdList){
						this.pileList.push( await this.getPileId( this.devId, card.cntIdList[i]))
					}
				}
			}
		},
		async getPileId( name, id){
			return name + '|' + id.padStart(2, '0')
		},
		getAttrKey(){
			// search the attribute's key index
			for(let i in this.attr_list){
				if(this.attr_list[i]==this.attr_now)
					this.attrKey_now = i
			}
		},
		async query_Date(){
			this.getAttrKey()
			let _firstDay = formatDate(new Date(this.$refs.firstDate.state.date), "yyyy-MM-dd") + "T" + this.startTime.replace(/\s*/g, "") + ":00";
			let _lastDay = formatDate(new Date(this.$refs.lastDate.state.date), "yyyy-MM-dd") + "T" + this.endTime.replace(/\s*/g, "") + ":00";
			console.log("🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗🚗")
			console.log(this.$refs.firstDate.state.date,this.startTime)
			console.log(this.$refs.lastDate.state.date,this.endTime)
			console.log(_firstDay)
			console.log(_lastDay)
			console.log(this.attr_now)
			console.log(this.attrKey_now)
			console.log(this.pileList)

			if(this.attrValue[this.attrKey_now].length==0){
				this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_013")
				});
                return
			}
			
			if(_lastDay <= _firstDay){
				this.$notify({
					type: 'warning',
					title: this.$t("GENERAL.SETTING_ERROR)"),
					message: this.$t("GENERAL.SETTING_ERROR_STOP_DATE")
				});
				return;
			}
			else{
				await this.getChart(_firstDay, _lastDay);
			}
		},
		async getChart(start_date, end_date){
            console.log(start_date , end_date)
			this.loading = true;
			let res = await getOldData(this.pile_now, this.attrValue[this.attrKey_now], start_date, end_date);
			//--------------------
			console.log("👏👏👏👏dc_editing👏👏👏👏")
			let str = JSON. stringify(res, null, 4); 
			console.log(str);
			//--------------------
			if(res.status === 'ok'){
			if(res.data.length == 0){
				this.loading = false;
				this.$refs.dataChart.clearChart();
				this.$notify({
					type: 'warning',
					title: this.$t("GENERAL.DATA_MISSING"),
					message: this.$t("GENERAL.DATA_MISSING_STATISTICS")
				});
				return;
			}

			let timeArr = [];
			let dataObj = {};
			let attr = this.attrValue[this.attrKey_now]
			dataObj[attr] = [];
			for(let data of res.data){
				timeArr.push(data.timestamp);
				dataObj[attr].push(data[attr]);
			}
				this.$refs.dataChart.chart_type = 'line';
				this.$refs.dataChart.x_val = timeArr;
				this.$refs.dataChart.y_val = dataObj;
				this.$refs.dataChart.createChart();
			}
			this.loading = false;
        },
	}
};
</script>

<style>
.create-isLoading .el-loading-spinner {
	top: 50%;
	left: 50%;
	margin-left: -55px;
	background: rgba(0, 0, 0, 0.7);
	padding: 20px;
	border-radius: 4px;
	width: auto;
	text-align: center;
	position: absolute;
}

.create-isLoading i {
  	color: #eee;
}

.create-isLoading .el-loading-text {
  	color: #eee;
}
</style>

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

.content_page__chart_view {
	height: 45vh;
	padding-top: 2vh;
	margin-top: 3vh;
	background-color: rgba(234, 234, 234, 0.3);
}

.filter__picker_item {
	background: linear-gradient(rgba(1, 255, 255, 0.5), rgba(33, 96, 184, 0.5));
	border: none;
	color: #ffffff;
	font-weight: bold;
	text-align: center;
	font-size: 2vmin;
	height: 4vh;
	margin-right: 0.5vw;
}

option {
	background-color: rgba(33, 96, 184, 1);
	color: #ffffff;
	font-weight: bold;
}
</style>