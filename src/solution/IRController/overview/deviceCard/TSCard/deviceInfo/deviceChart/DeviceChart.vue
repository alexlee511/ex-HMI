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
					<select class="filter__picker_item" v-model="attrId">
						<option v-for="(attr, attr_index) in newAttrList" :key="attr_index" :value="attr.value">
							{{ attr.name }}
						</option>
					</select>
				</div>
				<div style="display: flex; flex: 8; justify-content: flex-end; align-self: center;">
					<button class="filter__picker_item" style="margin-left: 10vmin" @click="queryDate">
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
import attrDictionary from "@/solution/IRController/data/attributes/AttrDictionary";

export default {
	components: {
		DatePick,
		DataChart,
	},
	mixins: [deviceChartMixin],
	data() {
		return {
			newAttrList: {}
		};
	},
	created(){
		this.newAttrList = JSON.parse(JSON.stringify(this.attrList));
		for( let item of this.attrList){
			if( !attrDictionary[item.attr].showInChart){
				let index = this.newAttrList.findIndex( e => { return e.attr == item.attr; });
				if( index!= -1) this.newAttrList.splice( index, 1);
			}
		}
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