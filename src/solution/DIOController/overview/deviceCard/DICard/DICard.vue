<template>
  <div :style="isAttrStatus ? 'opacity: 0.4' : ''">
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
            <div class="slaveC" :style='stylerSize(100,65,0,5)'>
              <img class="slaveC" :style='stylerSize(50,35,25,33)' v-if="Number(data.value)" src="~assets/images/di_status_on.png">
              <img class="slaveC" :style='stylerSize(50,35,25,33)' v-else src="~assets/images/di_status_off.png">
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
        {{ time }}
      </span>
      <span class="slaveC _16" :style='stylerSize(25,8,0,93)'>
        slave: {{ itemInfo.slave }}
      </span>
    </div>
  </div>
</template>

<script>
import { getDeviceData } from "common/constant/ist";

import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

import ajaxTimerMixin from "common/mixin/ajaxTimerMixin"

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
				simulateTouch: false
			},
			data: {},
			time: {},
			isAttrStatus: false,
		};
	},
	mixins: [ajaxTimerMixin],
	async created() {
		await this.getDeviceData()
		await this.recursive()
	},
	mounted() {},
	methods: {
		async getDeviceData() {
			await getDeviceData(this.itemInfo.deviceId, this.itemInfo.typename).then((res) => {
				if(res.status == 'fail' || res.connect_status == 0 || res.connect == 0)
					return this.isAttrStatus = true;
				else this.isAttrStatus = false;
				this.time = res.time;
				this.data = res.data.find((item) => {
					return item.id == '100300';
				});
				res = null
			});
		},
	},
	computed: {
		swiper() {
			return this.$refs.mySwiper;
		},
	},
};
</script>

