<template>
  <div class="content__devcard" :style="isAttrStatus ? 'opacity: 0.4;' : ''"> <!--pointer-events: none;-->
    <div class="content__devcard__view">
      <span class="devcard__devname">
        <slot name="dev-name">{{ itemInfo.deviceName }}</slot>
      </span>
      
      <div class="devcard__devattr__carousel">
        <div class="swiper" style="height: 50%"></div>
        <swiper
          class="swiper"
          style="height: 100%; position: absolute"
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

        <img
          class="slaveC"
          :style='stylerSize(17,17,5,30)'
          style="z-index: 3;"
          src="~assets/images/chart.png"
          @click="infoClick"
        />

        <div class="devcard__irc__basic_view">
          <div style="width: 30%" v-debounce="IRSwitch">
            <img
              v-if="IRStatus.power == 1"
              src="~assets/images/irc_status_on.png"
              style="width: 5.5vh"
            />
            <img
              v-else
              src="~assets/images/irc_status_off.png"
              style="width: 5.5vh"
            />
          </div>
          <div
            style="width: 70%; height: 6vh; display: flex; align-items: center"
          >
            <img
              v-debounce="tempDecrement"
              class="irc_temp_control_icon"
              src="~assets/images/arrow_left_01.png"
              :style="IRStatus.power?'opacity: 1':'opacity: .3; pointer-events: none;'"
            />
            <div  
              class="devcard__irc__temp_view"
              :style="IRStatus.power?'opacity: 1':'opacity: .3; pointer-events: none;'"
            >
              {{IRStatus.degree}}℃
            </div>
            <img
              v-debounce="tempIncrement"
              class="irc_temp_control_icon"
              src="~assets/images/arrow_right_01.png"
              :style="IRStatus.power?'opacity: 1':'opacity: .3; pointer-events: none;'"
            />
          </div>
        </div>

        <div class="devcard__irc__modebar">
          <div v-debounce="IRCoolControl" :style="IRStatus.power?'opacity: 1':'opacity: .3; pointer-events: none;'">
            <img
              v-if="IRStatus.mode == 1"
              class="devcard__irc__modebar__icon"
              src="~assets/images/irc_cool_on.png"
            />
            <img
              v-else
              class="devcard__irc__modebar__icon"
              src="~assets/images/irc_cool_off.png"            
            />
          </div>
          <div v-debounce="IRDryControl" :style="IRStatus.power?'opacity: 1':'opacity: .3; pointer-events: none;'">
            <img
              v-if="IRStatus.mode == 2"
              class="devcard__irc__modebar__icon"
              src="~assets/images/irc_dry_on.png"
            />
            <img
              v-else
              class="devcard__irc__modebar__icon"
              src="~assets/images/irc_dry_off.png"           
            />
          </div>
          <div v-debounce="IRFanControl" :style="IRStatus.power?'opacity: 1':'opacity: .3; pointer-events: none;'">
            <img
              v-if="IRStatus.mode == 0"
              class="devcard__irc__modebar__icon"
              src="~assets/images/irc_fan_on.png"
            />
            <img
              v-else
              class="devcard__irc__modebar__icon"
              src="~assets/images/irc_fan_off.png"
            />
          </div>
          <div>
            <img
              class="devcard__irc__modebar__icon"
              src="~assets/images/sync.png"
              style="width: 4vmin"
            />
          </div>
        </div>
        <!-- <span class="devcard__devslaveid--right">
          <slot name="slave-no">{{ time }}</slot>
        </span> -->
        <span class="slave">
          slave: {{ itemInfo.slave }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import CardItem from "./IRCardItem";

import { getDeviceData } from "common/constant/ist";
import { controlInstruction, getStatus } from "solution/IRController/utils/IRControl"

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
    Swiper,
    SwiperSlide,
  },
  mixins: [ajaxTimerMixin],
  data() {
    return {
      swiperOption: {
        spaceBetween: 5,
        // centeredSlides: true,
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
      testTimer: null
    };
  },
  async created() {
    await this.getDeviceData()
    await this.recursive()
    getStatus(this.itemInfo.deviceId).then(res => {
     this.IRStatus = res
    })
  },
  methods: {
    getDeviceData() {
      getDeviceData(this.itemInfo.deviceId, this.itemInfo.typename).then(
        (res) => {
          if (res.status == "fail" || res.connect == 0) {
            this.isAttrStatus = true;
          } else {
            this.isAttrStatus = false;
          }
          this.time = res.time;
          
          this.data = res.data;
        }
      );
      console.log(this.data)
    },
    async getIRStatus() {
      const res = await getStatus(this.itemInfo.deviceId)
      this.IRStatus = res
    },
    async IRSwitch() {
      if(this.IRStatus.power) {
        //console.log("冷氣關機")
        this.handleLoading("off")
      } else {
        //console.log("冷氣開機")
        this.handleLoading("on")
      }
    },
    async tempIncrement() {
      //console.log("溫度提高")
      let degree = this.IRStatus.degree+1
      if(degree < 20) degree = 20
      this.handleLoading(`temp_${degree}`)
    },
    async tempDecrement() {
      //console.log("溫度下降")
      let degree = this.IRStatus.degree-1
      if(degree < 20) degree = 20

      this.handleLoading(`temp_${degree}`)
    },
    async IRCoolControl() {
      //console.log("切換冷氣")
      this.handleLoading("cool")
    },
    async IRDryControl() {
      //console.log("切換暖氣")
      this.handleLoading("dry")
    },
    async IRFanControl() {
      //console.log("切換送風")
      this.handleLoading("fan")
    },
    async handleLoading(arg) {
      // 跑loading 不阻塞
      this.$store.commit("setLoadingState");
      const res = await controlInstruction( this.itemInfo.deviceId, arg)
      this.$store.commit("setLoadingState");
      if(res !== 0) return alert('fail')
      this.getIRStatus()
    },
    infoClick() {
      if(this.data.length == 0) return;
			let deviceType = this.$route.path.split("/");
			this.$router.push({
				path: "/" + deviceType[2] + "/TSControllerInfo/deviceDetailed",
				query: { devId: this.itemInfo.deviceId },
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
<style scoped>
.devcard__irc__basic_view {
  height: 6vh;
  width: 90%;
  display: flex;
  z-index: 1;
}
.devcard__irc__temp_view {
  height: 6vh;
  width: 8vw;
  background-color: #494949;
  border-radius: 1vh;
  margin: 0vw 1vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3vw;
}
.devcard__irc__modebar {
  display: flex;
  width: 90%;
  height: 6vh;
  justify-content: space-between;
  align-items: center;
  z-index: 1;
}
.devcard__irc__modebar__icon {
    width: 5.5vh;
}
</style>
