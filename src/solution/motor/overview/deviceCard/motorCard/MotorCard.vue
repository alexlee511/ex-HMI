<template>
    <div class="content__devcard" :style="isAttrStatus ? 'opacity: 0.4' : ''">
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
                    <swiper-slide 
                        v-for="(item, index) in data"
                        :key="index"
                        :item-info="item"
                    >
                        <Power  v-if="item.page_type=='power'" :item-info="item" />
                        <Sensor v-if="item.page_type=='scence'" :item-info="item" />
                        <vibration-kurtosis v-if="item.page_type=='vibration'" :item-info="item" />
                        <vibration-rms v-if="item.page_type=='vibrationrms'" :item-info="item" />
                    </swiper-slide>
                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
                <div
                    name="reciprocal_item"
                    style="height: 20.5vh; color: rgb(201, 201, 201)"
                >
                </div>
                <div class="devcard__toolbar">
                    <img
                        class="devcard__toolicon"
                        src="~assets/images/chart.png"
                        @click="infoClick"
                    />
                </div>
                <span class="devcard__devslaveid--right">
                    {{ time }}
                </span>
                <span class="slave">
                    slave: {{ itemInfo.slave }}
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { getDeviceData } from "common/constant/ist";

import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

import ajaxTimerMixin from "common/mixin/ajaxTimerMixin"
import Power from "./item/Power";
import Sensor from "./item/Sensor";
import VibrationRms from "./item/VibrationRms";
import VibrationKurtosis from "./item/VibrationKurtosis";
export default {
    props: {
        itemInfo: {
            type: Object,
            default: {},
        },
    },
    components: {
        Power,
        Sensor,
        VibrationKurtosis,
        VibrationRms,
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
                path: "/" + deviceType[2] + "/motorInfo/deviceDetailed",
                query: { devId: this.itemInfo.deviceId },
            });
        },
        async getDeviceData() {
            //這邊會往下問很多次
            this.isAttrStatus = false;
            let req = [];
            for(let item of this.itemInfo.complex){
                let tmp = JSON.parse(JSON.stringify(item));
                tmp.ist = await getDeviceData(item.deviceId)
                req.push(tmp)
                //震動規有兩個
                if(tmp.page_type == "vibration"){
                    let tmp2 = JSON.parse(JSON.stringify(tmp));
                    tmp2.page_type = 'vibrationrms'
                    req.push(tmp2)
                }
                
            }
            this.data = req;
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
<style >
@import "~assets/css/cardItem.css";

</style>
