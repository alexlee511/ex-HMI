import { formatDate } from "common/utile/utile";
import { createNamespacedHelpers } from "vuex";
import { attrToClass, deviceStatisattr } from "../../../../../../config/statistics/statisType";
import { getStatisticsAcc_get, getStatisticsAvg_get } from "../../../../../../../../network/statistics";
const { mapState: mapCommandState } = createNamespacedHelpers('deviceCommand');

// define the interfval of statistics chart
const day_of_interval = 14;
const hour_of_interval = 2;
const month_of_interval = 12;

export default {
	data() {
		return {
			devId: this.$route.query.devId,
			attrId: "",
			// the parameters of normal statistics, and the default is displaying max value
			normalParms: [true, false, false],
			// the statistics chart mode(month: 0, date: 1, hour: 2)
			statisMode: "",
			// the setting time
			startTime: "",
			endTime: "",

			firstDay: this.today(),
			lastDay: this.today(),

			selectFirstTime: "",
			selectLastTime: "",

			normalStatisOption: [
				{
					value: 'max',
					name: this.$t("GENERAL.MAX_VALUE"),
				},
				{
					value: 'min',
					name: this.$t("GENERAL.MIN_VALUE"),
				},
				{
					value: 'avg',
					name: this.$t("GENERAL.AVG_VALUE"),
				}
			],
			loading: true
		}
	},
	watch: {
		// when change display mode, initialize
		statisMode(){
			//console.log(this.attrList)
			this.attrId = this.attrList[0].value;
			this.normalParms = [true, false, false];
			// month statistics
			if(this.statisMode == '0'){
				const nowTime = new Date();
				this.selectFirstTime = formatDate(new Date(nowTime.getFullYear() - 1, nowTime.getMonth(), 1), "yyyy-MM-dd") + "T00:00:00";
				this.selectLastTime = formatDate(new Date(), "yyyy-MM-dd") + "T23:59:59";
				this.$refs.firstMonth.state.date = formatDate(new Date(nowTime.getFullYear() - 1, nowTime.getMonth(), 1), "yyyy-MM-dd");
				this.getChartData(this.selectFirstTime, this.selectLastTime, this.statisMode);
			}
			// day statistics
			else if(this.statisMode == '1'){
				const nowTime = new Date();
				this.lastDay = this.today();
				this.firstDay = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate() - day_of_interval);
				this.selectFirstTime = formatDate(this.firstDay, "yyyy-MM-dd") + "T00:00:00";
				this.selectLastTime = formatDate(this.lastDay, "yyyy-MM-dd") + "T23:59:59";
				this.$refs.firstDate.state.date = this.firstDay;
				this.$refs.lastDate.state.disabledDates.to = this.firstDay;
				this.$refs.lastDate.state.disabledDates.from = this.lastDay;
				this.$refs.firstDate.state.disabledDates.to = this.firstDay;
				this.$refs.firstDate.state.disabledDates.from = this.lastDay;
				this.getChartData(this.selectFirstTime, this.selectLastTime, this.statisMode);
			}
			// hour statistics
			else if(this.statisMode == '2'){
				const nowTime = new Date();
				this.lastDay = this.today();
				// get the information which from the day before yesterday to now
				this.firstDay = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate() - hour_of_interval);
				this.endTime = this.getstTime();
				this.selectFirstTime = formatDate(this.firstDay, "yyyy-MM-dd") + "T" + this.startTime.replace(/\s*/g, '') + ":00";
				this.selectLastTime = formatDate(this.lastDay, "yyyy-MM-dd") + "T" + this.endTime.replace(/\s*/g, '') + ":59";
				this.$refs.firstDate.state.date = this.firstDay;
				this.$refs.lastDate.state.disabledDates.to = this.firstDay;
				this.$refs.lastDate.state.disabledDates.from = this.lastDay;
				this.$refs.firstDate.state.disabledDates.to = this.firstDay;
				this.$refs.firstDate.state.disabledDates.from = this.lastDay;
				this.getChartData(this.selectFirstTime, this.selectLastTime, this.statisMode);
			}
		}
	},
	computed: {
		...mapCommandState({
			deviceAttr: state => state.deviceAttrList,
		}),
		// return the filtered attribute list
		attrList(){
			
			//console.log(this.deviceAttr)
			//console.log(deviceStatisattr)
			//console.log(this.devId)
			if(this.devId){
				let all_list = this.deviceAttr[this.devId].filter(attr => {
					return attrToClass(attr.value) !== undefined;
				})
				/*return this.deviceAttr[this.devId].filter(attr => {
					return attrToClass(attr.value) !== undefined;
				});*/
				//console.log(all_list)
				let show_list = all_list.filter(attr => {
					return deviceStatisattr[this.devId].includes(attr.value) == true;
				})
				//console.log(show_list)
				return show_list
			}
		},
		// judging weather open the checkbox list or not
		isOpenAttrList(){
			if(this.attrId)
				return attrToClass(this.attrId) == 'avg';
		},
		hour() {
			let timeArray = [];
			let j = 0;
			for (let i = 0; i < 24; i++) {
				if(j.toString().length == 1){
					timeArray.push("0" + j + ": 00");
					timeArray.push("0" + j + ": 30");
				}
				else{
					timeArray.push(j + ": 00");
					timeArray.push(j + ": 30");
				}
				j++;
			}
			return timeArray;
		},
	},
	methods: {
		today(){
			return new Date(formatDate(new Date(), "yyyy-MM-dd"));
		},
		// get the nearest time with clock or half
		getstTime() {
			var date = new Date();
			if (date.getMinutes() > 30)
				return this.startTime = formatDate(new Date(), "hh") + ": 30";
			else
				return this.startTime = formatDate(new Date(), "hh") + ": 00";
		},
		// set first day and control datepicker which date can be choose
		pickFirstDate(date) {
			this.firstDay = date;
			if(this.statisMode == '1'){
				const disable_sate = new Date(this.firstDay.getFullYear(), this.firstDay.getMonth(), this.firstDay.getDate() + day_of_interval);
				this.$refs.lastDate.state.disabledDates.from = disable_sate > this.today() ? this.today() : disable_sate;
				this.$refs.firstDate.state.disabledDates.from = disable_sate > this.today() ? this.today() : disable_sate;
			}
			else if(this.statisMode == '2'){
				const disable_sate = new Date(this.firstDay.getFullYear(), this.firstDay.getMonth(), this.firstDay.getDate() + hour_of_interval);
				this.$refs.lastDate.state.disabledDates.from = disable_sate > this.today() ? this.today() : disable_sate;
				this.$refs.firstDate.state.disabledDates.from = disable_sate > this.today() ? this.today() : disable_sate;
			}
		},
		// set last day and control datepicker which date can be choose
		pickLastDate(date) {
			this.lastDay = date;
			if(this.statisMode == '1'){
				this.$refs.lastDate.state.disabledDates.to = new Date(this.lastDay.getFullYear(), this.lastDay.getMonth(), this.lastDay.getDate() - day_of_interval);
				this.$refs.firstDate.state.disabledDates.to = new Date(this.lastDay.getFullYear(), this.lastDay.getMonth(), this.lastDay.getDate() - day_of_interval);
			}
			else if(this.statisMode == '2'){
				this.$refs.lastDate.state.disabledDates.to = new Date(this.lastDay.getFullYear(), this.lastDay.getMonth(), this.lastDay.getDate() - hour_of_interval);
				this.$refs.firstDate.state.disabledDates.to = new Date(this.lastDay.getFullYear(), this.lastDay.getMonth(), this.lastDay.getDate() - hour_of_interval);	
			}
		},
		// get data of statistics chart
		async getChartData(start_date, end_date, statis_mode){
			const statis_type = attrToClass(this.attrId);
			const parms = this.normalParms;
			const dev_id = this.devId;
			const attr_id = this.attrId;
			if(statis_type == 'acc'){
				const res = await getStatisticsAcc_get(dev_id, attr_id, start_date, end_date, statis_mode);
				if(res.status == 'ok'){
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
					// search the attribute's name
					let key = this.deviceAttr[dev_id].find(attr => {
						return attr.value == attr_id;
					});
					if(key){
						dataObj[key.name] = [];
						for(let data of res.data){
							timeArr.push(data.time);
							dataObj[key.name].push(data.acc);
						}
						this.$refs.dataChart.chart_type = 'line';
						this.$refs.dataChart.x_val = timeArr;
						this.$refs.dataChart.y_val = dataObj;
						this.$refs.dataChart.createChart();
					}
				}
			}
			else if(statis_type == 'avg'){
				const res = await getStatisticsAvg_get(dev_id, attr_id, start_date, end_date, statis_mode);
				if(res.status == 'ok'){
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
					for(let i = 0; i < parms.length; i++)
						if(parms[i]) dataObj[this.normalStatisOption[i].name] = [];
					for(let data of res.data){
						timeArr.push(data.time);
						for(let i = 0; i < this.normalStatisOption.length; i++){
							const opt = this.normalStatisOption[i];
							if(parms[i]) dataObj[opt.name].push(data[opt.value]);
						}
					}
					this.$refs.dataChart.chart_type = 'line';
					this.$refs.dataChart.x_val = timeArr;
					this.$refs.dataChart.y_val = dataObj;
					this.$refs.dataChart.createChart();
				}
			}
			this.loading = false;
        }
	},
}