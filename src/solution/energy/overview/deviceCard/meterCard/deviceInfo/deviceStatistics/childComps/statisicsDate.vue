<template>
	<div>
		<div style="display: flex">
			<div style="display: flex">
				<date-pick ref="firstDate" @pickDate="pickFirstDate"></date-pick>
				<span style="font-size: 1vw; margin-right: 0.5vw;">~</span>
				<date-pick ref="lastDate" @pickDate="pickLastDate"></date-pick>
				<span style="opacity: 0;"> ~ </span>
				<select v-model="attrId" style="margin-right: 1vw;">
					<option v-for="(attr, attr_index) in attrList" :key="attr_index" :value="attr.value">
						{{ attr.name }}
					</option>
				</select>
				<div v-if="isOpenAttrList" style="display: inline-flex;">
					<div class="parms_view"  v-for="(parms, parms_index) in normalStatisOption" :key="parms_index">
						<input type="checkbox" v-model="normalParms[parms_index]">
							{{ parms.name }}
					</div>
				</div>
			</div>
			
			<div style="display: flex; flex: 8; justify-content: flex-end; align-self: center;">
				<button class="filter__picker_item" @click="queryDate">
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
</template>

<script>
import { formatDate } from "common/utile/utile";
import DatePick from "components/common/datePick/DatePick";
import DataChart from "components/common/dataChart/DataChart"
import statisticsMixin from "./statisticsMixin"

export default {
	components: {
		DatePick,
		DataChart,
	},
	mixins: [statisticsMixin],
	created(){
		this.statisMode = '1';
		this.attrId = this.attrList[0].value;
	},
	methods: {
		// click search and then send api to make chart again
		queryDate() {
			let _firstDay = formatDate(new Date(this.$refs.firstDate.state.date), "yyyy-MM-dd") + "T00:00:00";
			let _lastDay = formatDate(new Date(this.$refs.lastDate.state.date), "yyyy-MM-dd") + "T00:00:00";
			if(_lastDay < _firstDay){
				this.$notify({
					type: 'warning',
					title: this.$t("GENERAL.SETTING_ERROR"),
                    message: this.$t("GENERAL.SETTING_ERROR_STOP_DATE")
				})
				return;
			}
			else{
				this.loading = true;
				this.getChartData(_firstDay, _lastDay, this.statisMode);
			}
		},
	},
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
	margin-left: 10vmin;
}

select{
	background: linear-gradient(rgba(1, 255, 255, 0.8), rgba(33, 96, 184, 0.8));
	background-color: rgba(33, 96, 184, 0.8);
	border-width: 0px;
	color: #ffffff;
	font-weight: bold;
	border-radius: 2px;
}

option{
	background-color: rgba(33, 96, 184, 1);
	color: #ffffff;
	font-weight: bold;
}

.parms_view{
	display: flex;
	align-items: center;
	font-size: 1.2vw;
	margin-right: 0.5vw;
}

.parms_view > input[type="checkbox"]{
	margin-right: 0.3vw;
	width: 3vmin;
    height: 3vmin;
}
</style>