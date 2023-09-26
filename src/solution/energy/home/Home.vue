<template>
	<div>
		<hmi-setting-content :devicelist="meterList" @selectChange="selectChange">
			<template v-slot:hmiSettingName>
				{{ $t("GENERAL.DEV_METER") }}:
			</template>
		</hmi-setting-content>
		<div class="content">
			<main-info-bar>
				<template v-slot:attrname>{{ $t("ENERGY.HOME_1") }}</template>
				<template v-slot:attrvalue>
					<div ref="500900">-</div>
				</template>
				<template v-slot:attrunti>
					<div ref="energyUnit"></div>
				</template>
			</main-info-bar>
			<main-info-bar>
				<template v-slot:attrname>{{ $t("ENERGY.HOME_2") }}</template>
				<template v-slot:attrvalue>
					<div ref="501200">-</div>
				</template>
				<template v-slot:attrunti>
					<div ref="powerUnit"></div>
				</template>
			</main-info-bar>
			<div style="display: flex">
				<main-info-bar styleName="maininfobarshort">
					<template v-slot:attrname>{{ $t("GENERAL.ATTR_CURRENT_DEMAND") }}</template>
					<template v-slot:attrvalue><div ref="currentDemand">-</div></template>
					<template v-slot:attrunti>kW</template>
				</main-info-bar>
				<div style="width: 20vw; height: 20vh; margin: 0 1.25vw" v-if="currentDemand">
					<div
						style="
						display: flex;
						justify-content: center;
						border-width: 0px 0px 1.5px 0px;
						border-style: solid;
						border-image: linear-gradient(
							to left,
							rgba(33, 96, 184, 0),
							#01ffff,
							rgba(33, 96, 184, 0)
						);
						border-image-slice: 1;
						"
					>
						<span>{{ $t("GENERAL.RECIPROCAL_DEMAND") }}</span>
					</div>
					<div
						style="
						color: #ffff33;
						font-size: 5vw;
						display: flex;
						align-items: center;
						"
					>
						<div class="STOPWATCH__img"></div>
						<span name="reciprocal_time">{{ reciprocalTime }}</span>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import HmiSettingContent from "./HmiSettingContent";
import mainInfoBar from "components/content/mainInfoBar/mainInfoBar";
import NoDataBack from "components/common/noDataBack/NoDataBack"

import { getVirtualDemand } from "solution/energy/utils/virtualConfig";

import { getDeviceData , update_dev , delete_all } from "common/constant/ist";

import quarterTimerMixin from "common/mixin/quarterTimerMixin";

import { setFirstDevId, getFirstDevId } from "./temp"

import { getHistoryData } from "network/history"

import { formatDate } from "common/utile/utile"
import { thistle } from "color-name";

export default {
	components: {
		mainInfoBar,
		HmiSettingContent,
		NoDataBack
	},
	data() {
		return {
			devicelist: [],
			meterList: [],
			demandList: [],
			monthPower: null,
			currentDemandId: null,
			currentDemand: null,
			timer: null,
			timer2: null,
			devId: null,
			flagStopTimer: false,
		};
	},
	mixins: [quarterTimerMixin],
	async created() {
		const res = await getVirtualDemand();
		this.demandList = res;
		await this.$store.dispatch("getSolutionData"); //取得電錶資料
		await this.getCard();
	},
	beforeDestroy() {
		clearTimeout(this.timer);
		this.timer = null;
		this.flagStopTimer = true
	},
	computed: {
		lang() {
			return this.$store.state.backData.lang;
		},
	},
	methods: {
		async selectChange(info) {
			delete_all();
            this.clearDeviceData()
			let currentDemandId = this.demandList.filter((item) => {
				return item.srcId == info;
			})[0];
			if(currentDemandId){
				update_dev([[{'deviceId':currentDemandId.devId},{'deviceId':info}]]);
			}
			else{
				update_dev([[{'deviceId':info}]]);
			}
			
			//呼叫API將所選取的設備打入後端
			if( info && this.meterList) await this.setCurrentDevice(info)
			
			// 清空上一組定時器
			clearTimeout(this.timer)
			this.timer = null

			//獲取子組件ID並透過ID拿到數據
			const getInfo = async (info) => {
				 //console.log(`獲得資料${info}`);
				this.devId = info;
				await this.getDeviceData(this.devId);

				let currentDemandId = await this.demandList.filter((item) => {
					return item.srcId == this.devId;
				})[0];
				
				if(currentDemandId) {
					this.currentDemandId = currentDemandId;
					
					await getDeviceData(this.currentDemandId.devId).then((res) => {
						if(res.status != 'fail'){
                            let tmp = res.data.filter((item) => {
								return item.id == "540300";
							})[0].value;
                            this.$refs.currentDemand.innerHTML = tmp
                            this.currentDemand = true
                            
						}
					});
				}
				else{
					this.currentDemandId = null;
				}
				// 掛載定時器
				this.timer = setTimeout(() => {
					if(this.flagStopTimer) return
					//console.log("計時器")
					getInfo(info)
				}, 3000);
			};
			getInfo(info)
		},
		addFootText(text){
			//改變footer的文字
			// const text = this.$t("GENERAL.ATTR_CONTRACT_CAPACITY") + contract + "kW";
			this.$store.commit("addFootText", text);
		},
		async getCard(){
			let devlist = []
			for(let item of this.$store.state.solutionData.energy.card){
				if(item.cardType.indexOf("Meter") != -1){
					// 找到所有被設置需量的電錶
					const res = item.device;
					devlist = devlist.concat(res.reverse());
				}
			}
			//call API get first device if available
			let demand_id = await getFirstDevId();
			if(demand_id.status!='ok' && devlist.length > 0){
				console.error('Error getting first device.')
				//unavailable --> set device
				let res = await setFirstDevId(devlist[0].deviceId)
				if(res.status!='ok')
					console.error('Error while setting first device.\n')
			}else if(demand_id.data){
				demand_id = demand_id.data.dev_id
				if(demand_id!='NULL'){
					//rearrange devlist as first device changed
					let index = 0;
					for(let dev of devlist){
						if(!dev) continue;
						if(dev.deviceId==demand_id) break
						index += 1;
					}
                    if(index < devlist.length ){
                        let target_dev = devlist[index]
                        console.log(devlist)
                        //remove 1 item on selected index
                        devlist.splice( index, 1)
                        //remove 0 item, insert 1 item on index 0 (to the front)
                        devlist.splice( 0, 0, target_dev)
                    }
					
				}
			}
			//if none of the actions above succeed, use instant devlist
			this.meterList = devlist;
            console.log("😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀😀")
            console.log(this.meterList)
            console.log(this.$store.state.solutionData.energy.card)
		},
        clearDeviceData(){
            this.$refs.energyUnit.innerHTML = ''
            this.$refs.powerUnit.innerHTML  = ''
            this.$refs["500900"].innerHTML  = '-';
            this.$refs["501200"].innerHTML  = '-';
            this.$refs.currentDemand.innerHTML  = '-';
            this.currentDemand = false ;
        },
		getDeviceData(selectDevId) {
			//獲取各屬性值
			getDeviceData(selectDevId).then(async (res) => {
                //console.log("👍👍👍")
                //console.log(res)
				if(res.status == 'fail') return;
				this.time = res.time;
				for (let item of res.data) {
					if(item.attr == "500900"){
						this.$refs.energyUnit.innerHTML = item.unit;
						this.$refs["500900"].innerHTML = item.value;
					}
					else if(item.attr == "501200"){
						// if not initialize the month power, or the date is over a month or a year, updating the month power
						const today = new Date();
						if(!this.monthPower || selectDevId !== this.monthPower.dev_id ||
							new Date(today.getFullYear(), today.getMonth(), 1) > this.monthPower.date){		
							// some meters' attributes are old, so the energy delivered is not '501200' probably
							//console.log(item)
                            const attr_id = item.id || "501200";
							await this.updatePower(this.devId, item.id);
                            this.powerValueChange(item.value, item.unit);
						}
						else this.powerValueChange(item.value, item.unit);
					}
				}
			});
		},
		async updatePower(dev_id, attr_id){
			const today = new Date();
			const lastDay = formatDate(new Date(), "yyyy-MM-dd") + "T23:59:59";
			const firstDay = formatDate(new Date(today.getFullYear(), today.getMonth(), 1), "yyyy-MM-dd") + "T00:00:00";
			console.log(lastDay,firstDay)
			let res = await getHistoryData(dev_id, attr_id, firstDay, lastDay, "mon")
			console.log(res)
			if(res.status == 'ok' && res.data.length > 0){
                //console.log(res.data[0])
                //console.log(res.data[1])
				this.monthPower = {
					dev_id: dev_id,
					date: new Date(today.getFullYear(), today.getMonth(), 1),
					power: Number(res.data[0][attr_id])
				}
			}
			// if getting data is fail, the program will execute for 3 times
			if(!this.monthPower){
				this.monthPower = {
					date: new Date(today.getFullYear(), today.getMonth(), 1),
					power: 0,
				}
			}
			//console.log(this.monthPower)
		},
		powerValueChange(power, unit){
			// the power is less than 1000
			//console.log("||||||||||",this.monthPower)
			//console.log(power, unit)
			
			if(unit == "KWh"){
				let num = Number(power) - this.monthPower.power;
				this.$refs["501200"].innerHTML = Number(num.toFixed(2));
                this.$refs.powerUnit.innerHTML = unit;
				return;
			}
			// otherwise
			while(unit !== "KWh"){
                //console.log(unit)
				switch(unit){
					case "MWh":
						unit = "KWh";
						power *= 1000;
						break;
					case "GWh":
						unit = "MWh";
						power *= 1000;
						break;
					case "TWh":
						unit = "GWh";
						power *= 1000;
                    case "Wh":
						unit = "KWh";
						power /= 1000;
						break;
					default:
						break;
				}
			}
			//console.log("第一次處理",power, unit)
			if(Number.isNaN(this.monthPower.power)){
				//console.log("有NAN")
				this.$refs["501200"].innerHTML = Number(power.toFixed(2));
                this.$refs.powerUnit.innerHTML = unit
				return
			}
            
			power -= this.monthPower.power;
			while(power >= 10000){
				if(unit == "Twh") break;
				switch(unit){
					case "KWh":
						unit = "MWh";
						power /= 1000;
						break;
					case "MWh":
						unit = "GWh";
						power /= 1000;
						break;
					case "GWh":
						unit = "Twh";
						power /= 1000;
					default:
						break;
				}
			}
			this.$refs.powerUnit.innerHTML = unit;
			this.$refs["501200"].innerHTML = Number(power.toFixed(2));
		},
		async setCurrentDevice(selectDevId){
			/*clear last called timeout if another device is selected*/
			clearTimeout(this.timer2);
			this.timer2 = null;
			
			this.timer2 = setTimeout(() => {
				//console.log("5 secs later")
				/*update database*/
				setFirstDevId(selectDevId)
			}, 5000);
		}
	},
	watch: {
		currentDemandId: function () {
			const text = this.currentDemandId ? this.$t("GENERAL.ATTR_CONTRACT_CAPACITY") +
				this.currentDemandId.contractCap + "kW" : "";
			this.addFootText(text);
		},
	}
};
</script>

<style scoped>
.content {
	position: absolute;
	width: 100vw;
	height: 90vh;
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	font-size: 2.5vw;
	left: 0px;
	top: 0px;
}
.STOPWATCH__img {
	background-image: url("~assets/images/stopwatch.png");
	background-repeat: no-repeat;
	background-size: contain;
	background-position: center;
	height: 10vmin;
	width: 10vmin;
}
</style>