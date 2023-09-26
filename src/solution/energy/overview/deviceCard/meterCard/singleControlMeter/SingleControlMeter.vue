<template>
	<div class="content__devcard" :style="isAttrStatus ? 'opacity: 0.4;' : ''">
		<div class="content__devcard__view">
			<span class="devcard__devname"> {{ itemInfo.deviceName }} </span>
			<div class="devcard__devattr__carousel">
				<div class="swiper" style="height: 50%"></div>
				<swiper class="swiper" style="height: 100%; position: absolute"
					:options="swiperOption" ref="mySwiper">
					<slot name="card">
						<card-item v-for="(item, index) in data" :key="index" :item-info="item"></card-item>
					</slot>
					<div class="swiper-pagination" slot="pagination"></div>
				</swiper>
				<div class="devcard__toolbar">
					<img
						:style="isAttrStatus && 'opacity: 0'"
						class="devcard__toolicon"
						src="~assets/images/chart.png"
						@click="infoClick"
					/>
					<div class="card-machine">
						<img class="devcard__toolicon" :src="cardMachineAlarm" />
						<button v-if="hasControl" class="button" @click="controlElectricStation" :style="cardMachinePower">
							{{ this.switch == "1" ? $t('ENERGY.POWER_UPS') : $t('ENERGY.NO_POWER') }}
						</button>
						<button v-else class="button" :style="cardMachinePower">
							{{ $t("ENERGY.UNKNOWN") }}
						</button>
					</div>
				</div>
				<span class="devcard__devslaveid--right"> {{ time }} </span>
				<span class="slave"> slave: {{ itemInfo.slave }} </span>
			</div>
		</div>
	</div>
</template>

<script>
import CardItem from "../MeterCardItem";
import { getDeviceData } from "common/constant/ist";
import { controlDevice } from "network/control"

import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

import ajaxTimerMixin from "common/mixin/ajaxTimerMixin";

import { mapState } from "vuex";

export default {
	props: {
		itemInfo: {
			type: Object,
			default: {},
		},
	},
	components: {
		CardItem,
		Swiper,
		SwiperSlide,
	},
	data() {
		return {
			swiperOption: {
                spaceBetween: 5,
				loop: true,
				pagination: {
					el: ".swiper-pagination",
					clickable: true,
					bulletClass: "my-bullet",
					bulletActiveClass: "my-bullet-active",
				},
				passiveListeners: false,
            },
			data: [],
			time: null,
			isAttrStatus: false,
			machineStatus: 0,
			lowValue: 0,
			switch: 0,
            card_name : {
					"0": this.$t("ENERGY.NO_CARD_INSERTED"),
					"1": this.$t("ENERGY.DEPOSIT_CARD"),
					"2": this.$t("ENERGY.MAINTAIN_CARD"),
					"3": this.$t("ENERGY.INTERVAL_CARD"),
					"4": this.$t("ENERGY.ENFORCE_CARD"),
					"5": this.$t("ENERGY.FREE_CARD"),
                    "16": this.$t("ENERGY.BILLING_CARD"),
                    "17": this.$t("ENERGY.FREE_CARD"),
                    "18": this.$t("ENERGY.ENFORCE_CARD"),
                    "20": this.$t("ENERGY.STUDEN_CARD"),
                    "255": this.$t("ENERGY.NO_CARD_INSERTED"),
				},
            
            
		};
	},
	mixins: [ajaxTimerMixin],
	async created() {
		this.getDeviceData();

		// 給予定時器
		await this.recursive();
	},
	methods: {
		infoClick() {
			// if(this.isAttrStatus) return;
			let deviceType = this.$route.path.split("/");
			this.$router.push({
				path: "/" + deviceType[2] + "/meterInfo/deviceDetailed",
				query: { devId: this.itemInfo.deviceId },
			});
		},
        //特殊變化
        change_value(info , res){
            switch(info.attr){
                case "100030201": // 低餘額警報事件
                    this.lowValue = info.value 
                    break;
                case "100700": // 低餘額警報事件
                    this.switch = info.value ;
                    break;
                case "103800"://讀卡機狀態
                    //第一階段值修改
                    let status = this.$t("ENERGY.CARD_INSERTED")
                    if([info.value] == 0){
                        status = this.$t("ENERGY.MISSED_CARD_READER")
                    }
                    //名稱修改
                    info.name = this.$t("ENERGY.READER_STATUS") ; 
                    //尋找讀卡機狀態
                    let index = res.findIndex(item => item.attr == '103801');
                    if(index != -1){
                        const cardType = this.card_name[res[index].value];
                        info.value = status + '- ' + cardType ;
                    }else{
                        info.value = status ;
                    }
                    this.data.push(info);
                    break;
                case "103801":
                    let tmp = res.findIndex(item => item.attr == '103800');
                    if(tmp == -1){
                        const cardType = this.card_name[info.value];
                        info.name = this.$t("ENERGY.READER_STATUS") ; 
                        info.attr = "103800" ; 
                        info.value = cardType ; 
                        this.data.push(info);
                    }
                    break;
                default:
                    this.data.push(info);
					break;
            }
        },
		async getDeviceData() {
			//獲取各屬性值
			await getDeviceData(this.itemInfo.deviceId, this.itemInfo.typename).then((res) => {
				//console.log(res)
                if(res.connect == 1 || res.connect == 1)
                    this.isAttrStatus = false
                else this.isAttrStatus = true;
				this.time = res.time;
                let data_tmp = JSON.parse(JSON.stringify(res.data));
				this.data = [];
				for(let info of data_tmp){
                    this.change_value(info , data_tmp );
                }
				this.data = this.data.reverse()
			});
		},
		async controlElectricStation() {
			// if(this.isAttrStatus) return;
			// 控制之後對計時器進行重製
			clearTimeout(this.timer);
			this.timer = setTimeout(async () => { 
				await this.getDeviceData();
				//console.log("計時器")
				this.recursive();
			}, 15000);
			
			const { writeCmd: cmd, channel: ch, attrId: attr } = this.hasControl;
			this.$store.commit("setLoadingState");
			if(this.deviceControlList[this.itemInfo.deviceId])
			if(this.switch == "1") {
				const res = await controlDevice(this.itemInfo.deviceId, cmd, `${ch}_${attr}_0` , "100700");
				this.$store.commit("setLoadingState");
				if(res.status == "fail"){
					return this.$notify({
						type: 'error',
						title: this.$t("GENERAL.CONTROL_FAIL"),
						message: res.err.msg,
					})
				}
				this.switch = "0"
				//console.log('關')
			} else {
				const res = await controlDevice(this.itemInfo.deviceId, cmd, `${ch}_${attr}_1` , "100700")
				this.$store.commit("setLoadingState");
				if(res.status == "fail"){
					return this.$notify({
						type: 'error',
						title: this.$t("GENERAL.CONTROL_FAIL"),
						message: res.err.msg,
					})
				}
				this.switch = "1"
				//console.log('開')
			}
		},
	},
	computed: {
		...mapState({
			deviceControlList: (state) => state.deviceCommand.deviceControlList
		}),
		swiper() {
			return this.$refs.mySwiper;
		},
		cardMachineAlarm() {
			if(this.lowValue == "1") {
				return require('@/assets/images/low_quota.png')
			} else {
				return require('@/assets/images/normal_quota.png')
			}
		},
		cardMachinePower() {
			if(this.switch == "1") {
				return 'background: linear-gradient(rgb(220 222 119), rgb(154, 184, 33));'
			} else {
				return 'background: linear-gradient(rgb(129, 118, 178), rgba(33, 96, 184));'
			}
		},
		hasControl(){
			if(this.deviceControlList[this.itemInfo.deviceId])
				return this.deviceControlList[this.itemInfo.deviceId][0];
			else return false;
		}
	},
};
</script>
<style scoped>
.card-machine {
  display: flex;
  justify-content: space-around;
  flex: 1;
}
.button {
  height: 5.5vh;
  
  border-width: 0px;
  border-radius: 1vh;
  color: #ffffff;
  font-weight: bold;
  width: 6vw;
  margin: 1vh;
  z-index: 1;
}
</style>
