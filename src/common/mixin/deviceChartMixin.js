import { formatDate } from "common/utile/utile";
import { getOldData } from "network/history"
import { createNamespacedHelpers } from "vuex";
const { mapState: mapCommandState } = createNamespacedHelpers('deviceCommand');

const time_of_interval = 14;

export default {
	data() {
		return {
			devName: "",

			devId: this.$route.query.devId,
			attrId: "",

			startTime: "",
			endTime: "",

			firstDay: this.today(),
			lastDay: this.today(),

			selectFirstTime: "",
			selectLastTime: "",
			initflag : true,
			loading: false,
		}
	},
	created(){
		if(this.attrList) this.attrId = this.attrList[0].attr;
		this.devName = this.$store.state.deviceName[this.devId] || this.devId;
		console.log(this.devId, this.deviceAttr)
		console.log(this.deviceAttr[this.devId])
	},
	mounted(){
		this.endTime = this.getstTime();
		const nowTime = new Date();
		this.lastDay = this.today();
		this.firstDay = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate() - time_of_interval);
		this.selectFirstTime = formatDate(this.firstDay, "yyyy-MM-dd") + "T" + this.startTime.replace(/\s*/g, '') + ":00";
		this.selectLastTime = formatDate(this.lastDay, "yyyy-MM-dd") + "T" + this.endTime.replace(/\s*/g, '') + ":00";
		//console.log(this.firstDay)
		this.$refs.firstDate.state.date = this.firstDay;
		this.$refs.lastDate.state.disabledDates.to = "";
		this.$refs.lastDate.state.disabledDates.from = this.lastDay;
		this.$refs.firstDate.state.disabledDates.to = "";
		this.$refs.firstDate.state.disabledDates.from = this.lastDay;
		if(this.initflag){
			this.getChartData(this.selectFirstTime, this.selectLastTime);
		}		
	},
	computed: {
		...mapCommandState({
			deviceAttr: (state) => state.deviceAttrList,
		}),
		// return the filtered attribute list
		attrList(){
			if(this.devId){ 
				return this.deviceAttr[this.devId];
			}	
		},
		hour() {
			let timeArray = [];
			let j = 0;
			for (let i = 0; i < 24; i++) {
				if (j.toString().length === 1) {
					timeArray.push("0" + j + ": 00");
					timeArray.push("0" + j + ": 30");
				}
				else {
					timeArray.push(j + ": 00");
					timeArray.push(j + ": 30");
				}
				j++;
			}
			return timeArray;
		},
	},
	methods: {
		today() {
			return new Date(formatDate(new Date(), "yyyy-MM-dd"));
		},
		/*yesterday(){
			let now = new Date();
			console.log(now)
    		now.setDate(now.getDate()-1);

		},*/
		pickFirstDate(date) {
			this.firstDay = date;
			const disable_sate = new Date(this.firstDay.getFullYear(), this.firstDay.getMonth(), this.firstDay.getDate() + 14);
			console.log(disable_sate)
			let temp_day = formatDate(new Date(this.firstDay), "yyyy-MM-dd")
			this.$refs.lastDate.state.disabledDates.from = disable_sate > this.today() ? this.today() : disable_sate;
			this.$refs.lastDate.state.disabledDates.to = new Date(new Date(temp_day).setDate(new Date(temp_day).getDate()-1))
			this.$refs.firstDate.state.disabledDates.from = this.today()
			this.$refs.lastDate.state.date = this.$refs.lastDate.state.disabledDates.from
			//new Date(this.firstDay.getFullYear(), this.firstDay.getMonth(), this.firstDay.getDate() - time_of_interval);
		},
		pickLastDate(date) {
			this.lastDay = date;
			this.$refs.lastDate.state.disabledDates.to = new Date(this.lastDay.getFullYear(), this.lastDay.getMonth(), this.lastDay.getDate() - time_of_interval);
			//this.$refs.firstDate.state.disabledDates.to = new Date(this.lastDay.getFullYear(), this.lastDay.getMonth(), this.lastDay.getDate() - time_of_interval);
			console.log(this.$refs.lastDate.state)
			console.log(this.$refs.firstDate.state)
		},
		getstTime(){
			var date = new Date();
			if(date.getMinutes() > 30)
				return this.startTime = formatDate(new Date(), "hh") + ": 30";
			else
				return this.startTime = formatDate(new Date(), "hh") + ": 00";
		},
		queryDate(){
			let _firstDay = formatDate(new Date(this.$refs.firstDate.state.date), "yyyy-MM-dd") + "T" + this.startTime.replace(/\s*/g, "") + ":00";
			let _lastDay = formatDate(new Date(this.$refs.lastDate.state.date), "yyyy-MM-dd") + "T" + this.endTime.replace(/\s*/g, "") + ":00";
			console.log(this.$refs.firstDate.state.date,this.startTime)
			console.log(this.$refs.lastDate.state.date,this.endTime)
			console.log(_firstDay)
			console.log(_lastDay)
			console.log(this.attrId)

			if(this.attrId.length==0){
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
				this.getChartData(_firstDay, _lastDay);
			}
		},
		async getChartData(start_date, end_date){
            this.loading = true;
			let res = await getOldData(this.devId, this.attrId, start_date, end_date);
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
				// search the attribute's name
				let key = this.deviceAttr[this.devId].find((attr) => {
					return attr.value === this.attrId;
				});
				if(key){
					dataObj[key.name] = [];
					for(let data of res.data){
						timeArr.push(data.timestamp);
						dataObj[key.name].push(data[this.attrId]);
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