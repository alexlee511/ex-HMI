<template>
    <div class="content__devcard" :style="isAttrStatus ? 'opacity: 0.8' : ''">
        <div class="content__devcard__view">
            <span class="devcard__devname _48">
                <slot name="dev-name">{{ itemInfo.deviceName }}</slot>
            </span>
            <div class="devcard__devattr__carousel">
                <div class="swiper" style="height: 10%"></div>
                <div style="width: 100%; height: 100%; left: 0%; top: 0%; position: absolute">
                    <Restart :item-info="itemInfo" />
                </div>
                <div
                    name="reciprocal_item"
                    style="height: 20.5vh; color: rgb(201, 201, 201)"
                >
                </div>
                <div class="devcard__toolbar">
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

import Restart from "./item/Restart";
export default {
    props: {
        itemInfo: {
            type: Object,
            default: function () {
                return {'slave' : 'X',
                        'deviceName' : '', 
                        'deviceId': '' }
            },
        },
    },
    components: {
        Restart,
        Swiper,
        SwiperSlide,
    },
    mixins: [],
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
    },
    methods: {
        getData(){
        }

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
