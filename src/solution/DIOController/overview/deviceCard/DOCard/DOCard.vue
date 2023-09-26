<template>
  	<div :style="isAttrStatus ? 'opacity: 0.4; pointer-events: none;' : ''">
		<div class="main content_view" :style='stylerSize()'>
			<span class="slaveC _24" :style='stylerSize(100,10,0,0)'>
				<slot name="dev-name">{{ itemInfo.deviceName }}</slot>
			</span>
			<div class="slaveM" :style='stylerSize(100,90,0,10)' style="z-index: 0;">
				<swiper
					:style='stylerSize(100,100,0,0)'
					:options="swiperOption"
					ref="mySwiper"
				>
					<slot name="card">
						<div class="slaveC" :style='stylerSize(55,65,23,5)' v-debounce="itemClick">
							<img
								:style='stylerSize(100,100,0,0)'
								v-if="Number(data.value)"
								src="~assets/images/do_status_on.png"
								
							/>
							<img
								:style='stylerSize(100,100,0,0)'
								v-else
								src="~assets/images/do_status_off.png"
								
							/>
						</div>
					</slot>
				</swiper>
			</div>
			<img
				src="~assets/images/dio_control.png"
				class="slaveC" 
				:style='stylerSize(15,15,8,75)'
				style="opacity: 0.8;"
			/>
			<span class="slaveC _18" :style='stylerSize(50,8,50,84)'> 
				{{ time? time: null }}
			</span>
			<span class="slaveC _16" :style='stylerSize(25,8,0,93)'>
				slave: {{ itemInfo.slave }}
			</span>
      	</div>
    </div>
</template>

<script>
import { getDeviceData , set_Device_Data} from "common/constant/ist";

import { turnOn, turnOff } from "solution/DIOController/utils/DOcontrol";

import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

import ajaxTimerMixin from "common/mixin/ajaxTimerMixin"
import { mapState } from "vuex";

export default {
	props: {
		itemInfo: {
			type: Object,
			default: {},
		},
	},
	components: {
		Swiper,
		SwiperSlide,
	},
	data() {
		return {
			swiperOption: {
				spaceBetween: 5,
				pagination: {
					el: ".swiper-pagination",
					clickable: true,
					// circular: true,
					bulletClass: "my-bullet",
					bulletActiveClass: "my-bullet-active",
				},
				simulateTouch: false,
			},
			data: {},
			time: null,
			isAttrStatus: false,
			DOstatus: false, //OFF
		};
	},
	mixins: [ajaxTimerMixin],
	async created() {
		await this.getDeviceData()
		await this.recursive()
	},
	mounted() {},
	methods: {
		getDeviceData() {
			getDeviceData(this.itemInfo.deviceId, this.itemInfo.typename).then((res) => {
				if(res.status == 'fail' || res.connect_status == 0 || res.connect == 0)
					return this.isAttrStatus = true;
				else this.isAttrStatus = false;
				this.time = res.time;
                //console.log(res.data)
				this.data = res.data && res.data.find((item) => {
					return item.id == '100300';
				});
				res = null
			});
		},
		async itemClick() {
			this.clearTimer()

			this.$store.commit("setLoadingState");
			let { target_id, channel } = Object.values(this.deviceControlList[this.itemInfo.deviceId])[0];
			if (Number(this.data.value)) { // 如果為打開   
				const res = await turnOff(target_id, channel)
				this.$store.commit("setLoadingState");
				if(res == 0 ||res.status =="fail" ){
					return this.$notify({
						type: 'error',
						title: this.$t("GENERAL.CONTROL_FAIL"),
						message: res.err.msg,
					})
				}
				this.data.value = 0
				set_Device_Data(this.itemInfo.deviceId , '100300' , 0)
			} else {
				const res = await turnOn(target_id, channel)
				this.$store.commit("setLoadingState");
				if(res == 0 ||res.status =="fail" ){
					return this.$notify({
						type: 'error',
						title: this.$t("GENERAL.CONTROL_FAIL"),
						message: res.err.msg,
					})
				}
				this.data.value = 1
				set_Device_Data(this.itemInfo.deviceId , '100300' , 1)
			}
		},
	},
	computed: {
		...mapState({
			deviceControlList: state => state.deviceCommand.deviceControlList,
		}),
		swiper() {
			return this.$refs.mySwiper;
		},
	},
};
</script>

