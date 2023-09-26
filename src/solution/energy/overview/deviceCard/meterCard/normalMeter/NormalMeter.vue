<template>
	<div class="main content_view" :style="styler()">
		<span class="_24 slaveC" :style='stylerSize(100,10,0,0)'> {{ itemInfo.deviceName }} </span>
		<div class="slaveM" :style='stylerSize(100,90,0,10)' style="z-index: 0;">
			<swiper :style='stylerSize(100,100,0,0)' :options="swiperOption" ref="mySwiper" >
				<slot name="card">
					<card-item v-for="(item, index) in data" :key="index" :item-info="item"></card-item>
				</slot>
				<div class="swiper-pagination" slot="pagination"></div>
			</swiper>
		</div>

		<span class="slaveC _20 light_grey" :style='stylerSize(35,10,23,55)' name="reciprocal_time" v-if="demandList">
			{{ $t("GENERAL.REMAINING_TIME_IN_THIS_PERIOD") }}
		</span>
		<span class="slaveC _20 light_grey" :style='stylerSize(15,10,60,55)' name="reciprocal_time" v-if="demandList">{{ reciprocalTime }}</span>

		<div class="slaveM" :style='stylerSize(100,20,0,65)'> <!--v-if="!isAttrStatus"-->
			<img
				class="slaveC"
				:style='stylerSize(18,80,8,0)'
				src="~assets/images/chart.png"
				@click="infoClick"
			/>
			<img
				class="slaveC"
				name="guard_lamp"
				v-if="demandList"
				:style='stylerSize(17,80,30,0)'
				:src="greenImg"
				@click="CloseAlarm"
			/>
			<img
				class="slaveC"
				name="guard_lamp_r"
				v-if="demandList"
				:style='stylerSize(17,80,50,0)'
				:src="redImg"
				@click="CloseAlarm"
			/>
		</div>
		<span class="slaveC _18" :style='stylerSize(50,8,50,84)'> {{ time }} </span>
		<span class="slaveC _16" :style='stylerSize(25,8,0,93)'> slave: {{ itemInfo.slave }} </span>
	</div>
</template>

<script>
import CardItem from "../MeterCardItem";

import { getDeviceData } from "common/constant/ist";


import { getDemandList , CloseAlarm} from "common/constant/demand";

import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

import quarterTimerMixin from "common/mixin/quarterTimerMixin";
import ajaxTimerMixin from "common/mixin/ajaxTimerMixin";

export default {
	props: {
		itemInfo: {
			type: Object,
			default: {},
		},
		index: {
			type: Number,
			default: 0,
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
			demandList: null,
			greenAlarm: false,
			redAlarm: false,
			isAttrStatus: true,
		};
	},
	mixins: [quarterTimerMixin, ajaxTimerMixin],
	async created() {
		this.getDeviceData();
		//console.log(this.index)
		const res = await getDemandList(this.itemInfo.deviceId);
		// //console.log(res)
		if (res.status == "ok") {
			//判斷有無需量
			this.demandList = res;
			this.getDemandData(res);
		}

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
		async getDeviceData() {
			//獲取各屬性值
			await getDeviceData(this.itemInfo.deviceId, this.itemInfo.typename).then((res) => {
				
                if(res.status =="fail"){
                    this.isAttrStatus = true;
                    return
                }
                ////console.log(res)
				if(res.connect == 1 )
					this.isAttrStatus = false
				else this.isAttrStatus = true;
				
				this.time = res.time;
				this.data = [];
                let tmp = []
				for(let info of res.data){
					if(!isNaN(Number(info.value)))
						info.value = Number(Number(info.value).toFixed(2));
					tmp.push(info);
				}
				let first = tmp.shift();
                if(first != undefined){
                    tmp.push(first);
                }
				
                this.data = tmp;
                
			});
            ////console.log(this.itemInfo.deviceId)
			await getDemandList(this.itemInfo.deviceId).then((res) => {
                ////console.log(res)
				if (res.status == "ok") {
					this.demandList = res;
					this.getDemandData(res);
					res = null
				}
			});
		},
		getDemandData(res) {
			switch(res.data){
				case "0":
					this.greenAlarm = false;
					this.redAlarm = false;
					break;
				case "1":
					this.greenAlarm = true;
					this.redAlarm = false;
					break;
				case "2":
					this.greenAlarm = true;
					this.redAlarm = true;
					break;
				case "3":
					this.greenAlarm = true;
					this.redAlarm = true;
					break;
				default:
					this.greenAlarm = false;
					this.redAlarm = false;
					break;
			}

		},
		CloseAlarm() {
			CloseAlarm(this.itemInfo.deviceId).then(res => {
				////console.log(res)
			})
		}
	},
	computed: {
        styler: function(){
          return function(w=100,h=100,k=0,t=0){
              if (this.isAttrStatus){
                  return "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;opacity: 0.4;"; 
              }else{
                  return "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+t+"%;"; 
              }
              
          }
        },
		swiper() {
			return this.$refs.mySwiper;
		},
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
