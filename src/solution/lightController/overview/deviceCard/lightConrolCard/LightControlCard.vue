<template>
    <div
        class="content__devcard"
        :style="isAttrStatus ? 'opacity: 0.4; pointer-events: none;' : ''"
    >
        <div class="content__devcard__view">
            <span class="devcard__devname">
                <slot name="dev-name">{{ itemInfo.deviceName }}</slot>
            </span>
            <div class="devcard__devattr__carousel">
                <div class="swiper" style="height: 50%"></div>
                <swiper
                    class="swiper swiper-no-swiping"
                    style="height: 100%; position: absolute"
                    :options="swiperOption"
                    ref="mySwiper"
                >
                    <slot name="card">
                        <light-dimming
                            v-if="control && control.value_list.length == 11"
                            :control="control"
                            :itemInfo="itemInfo"
                            :data="data"
                            @changeValue="changeValue"
                        />
                        <light-switch
                            v-else
                            :control="control"
                            :itemInfo="itemInfo"
                            :data="data"
                            @changeValue="changeValue"
                        />
                    </slot>

                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>

                <!-- <span class="devcard__devslaveid--right"> 
                    {{ time? time: null }}
                </span> -->
                <span class="slave"> slave: {{ itemInfo.slave }} </span>
            </div>
        </div>
    </div>
</template>

<script>
import commandStoreMixin from "@/store/modules/deviceCommand/mixin"
import { getDeviceData } from "common/constant/ist";
import LightDimming from "./childCpn/LightDimming";
import LightSwitch from "./childCpn/LightSwitch";

import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

import ajaxTimerMixin from "common/mixin/ajaxTimerMixin";

import { mapState } from 'vuex'
import { createNamespacedHelpers } from 'vuex'
const { mapState: mapSubDeviceState, mapActions: mapSubDeviceAction, mapMutations: mapSubDeviceMutation } = createNamespacedHelpers('subDevice')

export default {
    props: {
        itemInfo: {
            type: Object,
            default: {},
        },
    },
    components: {
        LightDimming,
        LightSwitch,
        Swiper,
        SwiperSlide,
    },
    mixins: [
        ajaxTimerMixin,
        commandStoreMixin
        ],
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
            data: [],
            time: null,
            isAttrStatus: false,
            control: null,
            channel: null,
        };
    },
    async created() {
        this.control = this.deviceControlList[this.itemInfo.deviceId][0]
        await this.getDeviceData();
        // 給予定時器
        await this.recursive();
    },
    methods: {
        ...mapSubDeviceAction([
            "getControlList"
        ]),
        async getDeviceData() {
            let target_id = Object.values(this.deviceControlList[this.itemInfo.deviceId])[0].target_id;
            await getDeviceData(this.itemInfo.deviceId, this.itemInfo.typename).then(
                (res) => {
                        
                    if (res.connect == 1 || res.connect_status == 1 ) {
                        this.isAttrStatus = false
                    } else {
                        this.isAttrStatus = true
                    }
                    
                    if (!res) return;
                    this.time = res.time;
                    this.data = res.data;
                }
            );
        },
        changeValue() {
            // 控制之後對計時器進行重製
            clearTimeout(this.timer);
            this.timer = setTimeout(async () => { 
                await this.getDeviceData();
                //console.log("重置")
                this.recursive();
            }, 15000);
        }
    },
    computed: {
        ...mapState({
            deviceControlList: (state) => state.deviceCommand.deviceControlList,
        }),
        ...mapSubDeviceState([
            "controlInfoList",
            "controlAttrList",
        ]),
        swiper() {
            return this.$refs.mySwiper;
        },
    },
};
</script>