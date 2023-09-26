<template>
  <div :style="isAttrStatus ? 'opacity: 0.4;' : ''"> <!-- pointer-events: none;-->
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
            <card-item
              v-for="(item, index) in data"
              :key="index"
              :item-info="item"
            ></card-item>
          </slot>

          <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
      </div>

      <img class="slaveC" :style='stylerSize(35,25,33,57)' @click="toolsClick" src="~assets/images/irc_control.png" alt="">
      <img
        class="slaveC"
        :style='stylerSize(17,17,5,54)'
        src="~assets/images/chart.png"
        @click="infoClick"
      />

      <div class="slaveC" :style='stylerSize(15,17,5,73)' v-debounce="IRSwitch" >
        <img
          :style='stylerSize(100,100,0,0)'
          v-if="IRStatus.power == 1"
          src="~assets/images/irc_status_on.png"
        />
        <img
          :style='stylerSize(100,100,0,0)'
          v-else
          src="~assets/images/irc_status_off.png"

        />
      </div>

      <span class="slaveC _18" :style='stylerSize(50,8,50,84)'> {{ time }} </span>
      <span class="slaveC _16" :style='stylerSize(25,8,0,93)'>
        slave: {{ itemInfo.slave }}
      </span>

      <t-s-card-box ref="dialog" 
                    :IRStatus.sync="IRStatus"
                    @IRSwitch="IRSwitch"
                    @IRCoolControl="IRCoolControl"
                    @IRDryControl="IRDryControl"
                    @IRFanControl="IRFanControl"
                    @IRtempControl="IRtempControl"
                    @IRAutoControl="IRAutoControl"
                    @IRwindControl="IRwindControl"
                    />
    </div>
  </div>
</template>

<script>
import CardItem from "./TSCardItem";
import TSCardBox from "./TSCardBox"

import { getDeviceData } from "common/constant/ist";
import { changeStatusName } from "common/constant/profile";
import { controlInstruction } from "solution/IRController/utils/TSControl"

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
		CardItem,
		TSCardBox,
		Swiper,
		SwiperSlide
	},
	mixins: [ajaxTimerMixin],
	data(){
		return {
			swiperOption: {
				spaceBetween: 5,
				loop: true,
				pagination: {
					el: ".swiper-pagination",
					clickable: true,
					// circular: true,
					bulletClass: "my-bullet",
					bulletActiveClass: "my-bullet-active",
				},
			},
			data: {},
			time: {},
			isAttrStatus: false,
			IRStatus: {},
			dialogTableVisible: false,
      status_flag: 0,
      on_status: 0,
		};
	},
	async created() {
    //console.log(this.$store.state.deviceCommand)
    //console.log(this.itemInfo)
		await this.getDeviceData()
		await this.recursive()
	},
	methods: {
		infoClick() {
			if(this.data.length == 0) return;
			let deviceType = this.$route.path.split("/");
			this.$router.push({
				path: "/" + deviceType[2] + "/TSControllerInfo/deviceDetailed",
				query: { devId: this.itemInfo.deviceId },
			});
		},
		getDeviceData() {
			getDeviceData(this.itemInfo.deviceId, this.itemInfo.typename).then((res) => {
				if (res.connect == 1 || res.connect_status == 1)
					this.isAttrStatus = false;
				else this.isAttrStatus = true;

				let temp_res = JSON.parse(JSON.stringify(res))
						this.time = res.time;
						this.data =[];
						const obj = {};
						for(let info of temp_res.data){
				
				////console.log(info)
				switch(info.attr){
					case "100700":
						obj.power = this.isAttrStatus ? 0 : info.value;
						info.value = this.isAttrStatus ? 0 : info.value;
						break;
					case "701400":
						obj.mode = info.value;

						break;
					case "702200":
						obj.degree = info.value;

						break;
					case "701500":
						obj.wind = info.value;

						break;
					case "701550":
						obj.maxWind = info.value;

						break;
					default:
						//this.data.push(info);
						break;
				}

			}
			this.data = changeStatusName(temp_res.data, temp_res.dev_id)
			this.data = this.data.reverse()
			////console.log(this.data)
				this.IRStatus = obj
			});
          
		},
		async IRSwitch(value) {
      this.on_status = value
      this.status_flag = 1
			if(this.IRStatus.power == 1){
				//console.log("冷氣關機")
				this.handleLoading("off").then(res => {
					if(res == false){
              return
          }
					this.IRStatus.power = 0
					this.clearTimer()
				})
			}
			else{
				//console.log("冷氣開機")
				this.handleLoading("on").then(res => {
					if(res == false){
              return
          }
					this.IRStatus.power = 1
					this.clearTimer()
				})
        
			}
		},
		// async tempIncrement() {
		//   //console.log("溫度提高")
		//   let degree = this.IRStatus.degree+1
		//   if(degree < 18) degree = 18
		//   this.handleLoading(`temp_${degree}`).then(res => {
		//     if(!res) return
		//     this.IRStatus.degree = degree
		//     this.clearTimer()
		//   })
		// },
		// async tempDecrement() {
		//   //console.log("溫度下降")
		//   let degree = this.IRStatus.degree-1
		//   if(degree < 18) degree = 18

		//   this.handleLoading(`temp_${degree}`).then(res => {
		//     if(!res) return
		//     this.IRStatus.degree = degree
		//     this.clearTimer()
		//   })
		// },
		async IRtempControl(degree) {
			//console.log("控制溫度", degree)
			this.handleLoading(`temp_${degree}`).then(res => {
				if(!res) return
				this.IRStatus.degree = Number(degree)
				this.clearTimer()
			})
		},
		async IRwindControl(speed) {
			this.handleLoading(`wind_${speed}`).then(res => {
				if(!res) return
				this.IRStatus.wind = Number(speed)
				this.clearTimer()
			})
		},
		async IRCoolControl() {
			//console.log("切換冷氣")
			this.handleLoading("cool").then(res => {
				if(!res) return
				this.IRStatus.mode = 0
				this.clearTimer()
			})

		},
		async IRDryControl() {
			//console.log("切換除溼")
			this.handleLoading("dry").then(res => {
				if(!res) return
				this.IRStatus.mode = 1
				this.clearTimer()
			})

		},
		async IRFanControl() {
			//console.log("切換送風")
			this.handleLoading("fan").then(res => {
				if(!res) return
				this.IRStatus.mode = 2
				this.clearTimer()
			})

		},
		async IRAutoControl() {
			//console.log("切換自動")
			this.handleLoading("auto").then(res => {
				if(!res) return
				this.IRStatus.mode = 3
				this.clearTimer()
			})

		},
		async handleLoading(arg) {
			// 跑loading 不阻塞
			this.$store.commit("setLoadingState");
      
      this.$refs.dialog.dialogTableVisible = false
			const res = await controlInstruction( this.itemInfo.deviceId, arg)
      //console.log(res)
			this.$store.commit("setLoadingState");
      if(this.status_flag != 1 || this.on_status == 1){
          this.$refs.dialog.dialogTableVisible = true
      }
      this.status_flag = 0
      this.on_status = 0
			if(res.status !== "ok") {
				this.$notify({
            type: 'fail',
            title: this.$t("GENERAL.FAIL_TITLE"),
            message: this.$t("GENERAL.ERROR_MSG_015")
        })
				return false
			}
			return true
		},
		toolsClick() {
			this.$refs.dialog.dialogTableVisible = true
		},
	},
	computed: {
		swiper() {
			return this.$refs.mySwiper;
		},
	},
};
</script>

