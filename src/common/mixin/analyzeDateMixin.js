import { formatDate } from "common/utile/utile";


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

			loading: false,
		}
	},
	created(){
		
	},
	mounted(){
		this.endTime = this.getstTime();
		const nowTime = new Date();
		console.log(this.startTime)
		console.log(this.endTime)
		this.lastDay = this.today();
		this.firstDay = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate());
		this.selectFirstTime = formatDate(this.firstDay, "yyyy-MM-dd") + "T" + this.startTime.replace(/\s*/g, '') + ":00";
		this.selectLastTime = formatDate(this.lastDay, "yyyy-MM-dd") + "T" + this.endTime.replace(/\s*/g, '') + ":00";
		console.log(this.firstDay)
		//this.$refs.firstDate.state.date = this.firstDay;
		this.$refs.lastDate.state.disabledDates.to = "";
		this.$refs.lastDate.state.disabledDates.from = this.lastDay;
		this.$refs.firstDate.state.disabledDates.to = "";
		this.$refs.firstDate.state.disabledDates.from = this.lastDay;
		//this.getChartData(this.selectFirstTime, this.selectLastTime);
	},
	computed: {
		hour() {
			let timeArray = [];
			let j = 0;
			for (let i = 0; i < 24; i++) {
				if (j.toString().length === 1) {
					timeArray.push("0" + j + ":00");
					timeArray.push("0" + j + ":30");
				}
				else {
					timeArray.push(j + ":00");
					timeArray.push(j + ":30");
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
		pickFirstDate(date) {
			this.firstDay = date;
			const disable_sate = new Date(this.firstDay.getFullYear(), this.firstDay.getMonth(), this.firstDay.getDate());
			console.log(disable_sate)
			let temp_day = formatDate(new Date(this.firstDay), "yyyy-MM-dd")
			this.$refs.lastDate.state.disabledDates.from = this.today()
			this.$refs.lastDate.state.disabledDates.to = this.firstDay
			this.$refs.firstDate.state.disabledDates.from = this.today()
			this.$refs.lastDate.state.date = this.$refs.lastDate.state.disabledDates.from
			//new Date(this.firstDay.getFullYear(), this.firstDay.getMonth(), this.firstDay.getDate() - time_of_interval);
			console.log(this.$refs.firstDate.state.date)
		},
		pickLastDate(date) {
			this.lastDay = date;
			this.$refs.lastDate.state.disabledDates.to = new Date(this.lastDay.getFullYear(), this.lastDay.getMonth(), this.lastDay.getDate());
			//this.$refs.firstDate.state.disabledDates.to = new Date(this.lastDay.getFullYear(), this.lastDay.getMonth(), this.lastDay.getDate() - time_of_interval);
			console.log(this.$refs.lastDate.state)
			console.log(this.$refs.firstDate.state)
		},
		getstTime(){
			var date = new Date();
			if(date.getMinutes() > 30)
				return this.startTime = formatDate(new Date(), "hh") + ":30";
			else
				return this.startTime = formatDate(new Date(), "hh") + ":00";
		},
		
		
	},
}