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
                    <swiper-slide 
                        v-for="(item, index) in data"
                        :key="index"
                        :item-info="item"
                    >
                        <item  :item-info="item" />
                    </swiper-slide>
                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
            </div>
            <div class="slaveM" :style='stylerSize(100,20,0,63)'>
                <img
                    class="slaveC"
				    :style='stylerSize(18,80,8,0)'
                    src="~assets/images/chart.png"
                    @click="infoClick"
                />
            </div>
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
import item from "./item/item";
export default {
    props: {
        itemInfo: {
            type: Object,
            default: {},
        },
    },
    components: {
        item,
        Swiper,
        SwiperSlide,
    },
    mixins: [ajaxTimerMixin],
    data() {
        return {
            swiperOption: {
                effect: 'cube',
                loop: true,
                grabCursor: true,
                cubeEffect: {
                    shadow: false,
                    slideShadows: false,
                    shadowOffset: 1,
                    shadowScale: 0.1,
                },
                pagination: {
                    el: ".swiper-pagination",
                    clickable: true,
                    bulletClass: "my-bullet",
                    bulletActiveClass: "my-bullet-active",
                },
            },
            data: {},
            time: null,
            isAttrStatus: false,
        };
    },
    async created() {
        await this.getDeviceData()
        await this.recursive()
    },
    methods: {
        infoClick() {
        let deviceType = this.$route.path.split("/");
        this.$router.push({
            path: "/" + deviceType[2] + "/waterInfo/deviceDetailed",
            query: { devId: this.itemInfo.deviceId },
        });
        },
        async getDeviceData() {
            await getDeviceData(this.itemInfo.deviceId, this.itemInfo.typename).then(
                (res) => {
                // //console.log(res)
                if (res.status == "fail" || res.connect == 0 || res.connect_status == 0) {
                    this.isAttrStatus = true;
                } else {
                    this.isAttrStatus = false
                }
                this.time = res.time;
                this.data = res.data.reverse();
            }
        );
    },
  },
  computed: {
    swiper() {
      return this.$refs.mySwiper;
    },
  },
  watch: {},
};
</script>

