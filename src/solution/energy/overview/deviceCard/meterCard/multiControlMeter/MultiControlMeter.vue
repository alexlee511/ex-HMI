<template>
    <div :style="isAttrStatus ? 'opacity: 0.4; ' : ''"> <!--pointer-events: none;-->
        <div class="main content_view" :style='stylerSize()'>
            <span class="slaveC _24" :style='stylerSize(100,10,0,0)'> {{ itemInfo.deviceName }} </span>

            <div class="slaveM" :style='stylerSize(100,90,0,10)' style="z-index: 0;">
                <swiper :style='stylerSize(100,100,0,0)'
                    :options="swiperOption" ref="mySwiper">
                    <slot name="card">
                        <card-item v-for="(item, index) in data" :key="index" :item-info="item"></card-item>
                    </slot>
                    <div class="swiper-pagination" slot="pagination"></div>
                </swiper>
            </div>
            
            <div class="slaveM" :style='stylerSize(100,20,0,60)'>
                <img
                    :style='stylerSize(18,80,8,0)'
                    class="slaveC"
                    src="~assets/images/chart.png"
                    @click="infoClick"
                />

                <img class="slaveC" :style='stylerSize(20,75,33,0)' :src="cardMachineAlarm" />
                <button v-if="hasControl" class="slaveC _24 cardModeButton" :style='stylerSize(35,75,58,0)' @click="dialogVisible = !isAttrStatus;">
                    {{ this.cardMode }}
                </button>
            </div>

            <span class="slaveR _18" :style='stylerSize(50,8,48,84)'> {{ time }} </span>
            <span class="slaveL _16" :style='stylerSize(25,8,3,93)'> slave: {{ itemInfo.slave }} </span>

            <el-dialog custom-class="dialog_class" :visible.sync="dialogVisible" :append-to-body="true">
                <div class="top-tools">
                    <span> {{ hasControl.description }} </span>
                    
                </div>
                <div class="content">
                    <div v-for="(ctl, ctl_index) in hasControl.value_list" :key="ctl_index">
                        <button class="cardModeButton" style="width: auto; margin: 1vh;" @click="contorlMachineMode(ctl.value)">
                            {{ ctl.name }}
                        </button>
                    </div>
                </div>
            </el-dialog>  
        </div>
    </div>
</template>

<script>
import CardItem from "../MeterCardItem";
import { getDeviceData } from "common/constant/ist";
import { controlDevice } from "network/control"

import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import { debounce } from "lodash";
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
            dialogVisible: false,
            cardMode: "",
        };
    },
    mixins: [ajaxTimerMixin],
    async created() {
        this.getDeviceData();
        switch(this.itemInfo.typename){
            case "EM1100P":
                this.attr_103800 = {
                    "0" : "MISSED_CARD_READER",
                    "1" : "CARD_INSERTED",
                    "2" : "CARD_INSERTED",
                }
                this.attr_103801 = {
                    "0" : "NO_CARD_INSERTED",
                    "1" : "DEPOSIT_CARD",
                    "2" : "MAINTAIN_CARD",
                    "3" : "INTERVAL_CARD",
                    "4" : "ENFORCE_CARD",
                    "5" : "FREE_CARD",
                }
                this.attr_103802 = {
                    "0" : "CARD_MODE",
                    "2" : "FREE_MODE",
                    "3" : "DISABLE_MODE",
                }
                break
            case "KEM513":
                this.attr_103800 = {
                    "0" : "MISSED_CARD_READER",
                    "1" : "CARD_INSERTED",
                }
                this.attr_103801 = {
                    "0"   : "USER_CARD",
                    "1"   : "TEST_CARD",
                    "2"   : "TIME_CARD",
                    "3"   : "FREE_CARD",
                    "4"   : "DISABLE_CARD",
                    "5"   : "NOMONY_CARD",
                    "6"   : "RETURN_CARD",
                    "255" : "NO_CARD_INSERTED",
                }
                //0=插卡使用,1=卸載模式,2=免費模式,3=禁用模式,4=賒帳模式,255=未啟用
                this.attr_103802 = {
                    "0"   : "CARD_MODE",
                    "1"   : "UNINSTALL_MODE",
                    "2"   : "FREE_MODE",
                    "3"   : "DISABLE_MODE",
                    "4"   : "CREDIT_MODE",
                    "255" : "NOT_ACTIVATED_MODE",
                }
                break
            case "DEMS":
                this.attr_103800 = {
                }
                this.attr_103801 = {
                }
                this.attr_103802 = {
                    "0" : "CARD_MODE",
                    "2" : "FREE_MODE",
                    "3" : "DISABLE_MODE",
                }
                break
            case "EM310":
                this.attr_103800 = {
                    "0" : "MISSED_CARD_READER",
                    "1" : "NO_CARD_INSERTED",
                    "2" : "CARD_INSERTED",
                }
                this.attr_103801 = {
                    "0" : "NO_CARD_INSERTED",
                    "1" : "DEPOSIT_CARD",
                    "2" : "MAINTAIN_CARD",
                    "3" : "INTERVAL_CARD",
                    "4" : "ENFORCE_CARD",
                    "5" : "FREE_CARD",
                }
                this.attr_103802 = {
                    "0" : "CARD_MODE",
                    "2" : "FREE_MODE",
                    "3" : "DISABLE_MODE",
                }
                break
            default:
                break;
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
        //特殊變化
        change_value(info , res){
            switch(info.attr){
                case "100030201": // 低餘額警報事件
                    this.lowValue = info.value 
                    break;
                case "100700": // 保護電驛狀態
                    info.value = info.value == '1' ? this.$t("ENERGY.POWER_UPS") : this.$t("ENERGY.NO_POWER");
                    info.name  = this.$t("ENERGY.PROTECT_STATUS") ;
                    this.data.push(info);
                    break;
                case "103800"://讀卡機狀態
                    //第一階段值修改
                    // console.log(info)
                    // console.log(this.attr_103800)
                    let status = this.attr_103800[info.value];
                    
                    //名稱修改
                    info.name = this.$t("ENERGY.READER_STATUS") ; 
                    //尋找讀卡機狀態
                    let index = res.findIndex(item => item.attr == '103801');
                    if(index != -1){
                        let cardType = this.attr_103801[res[index].value];
                        info.value = this.$t("ENERGY." + status) + '- ' + this.$t("ENERGY." + cardType) ;
                    }else{
                        info.value = this.$t("ENERGY." + status) ;
                    }
                    this.data.push(info);
                    this.readerStatus = info.value // 讀卡機狀態*
                    break;
                case "103801":
                    let tmp = res.findIndex(item => item.attr == '103800');
                    if(tmp == -1){
                        let cardType = this.attr_103801[info.value];
                        info.name = this.$t("ENERGY.READER_STATUS") ; 
                        info.attr = "103800" ; 
                        info.value = this.$t("ENERGY." + cardType) ; 
                        this.data.push(info);
                    }
                    break;
                case "103802":
                    this.cardMode = this.$t("ENERGY." + this.attr_103802[info.value]);
                    break;
                default:
                    this.data.push(info);
                    break;
            }
            
        },
        async getDeviceData(){
            //獲取各屬性值
            await getDeviceData(this.itemInfo.deviceId, this.itemInfo.typename).then((res) => {
                console.log(res)
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
        contorlMachineMode: debounce(async function (value){
            if(this.isAttrStatus) return;
            const { writeCmd: cmd, channel: ch, attrId: attr } = this.hasControl;
            this.$store.commit("setLoadingState");
            const res = await controlDevice(this.itemInfo.deviceId, cmd, `${ch}_${attr}_${value}` , "103802");
            this.$store.commit("setLoadingState");
            
            if(res.status == 'fail'){
                return this.$notify({
                    type: 'error',
                    title: this.$t("GENERAL.CONTROL_FAIL"),
                    message: res.err.msg,
                });
            }
            else{
                this.dialogVisible = false;
                this.cardMode = {
                    0: this.$t("ENERGY.CARD_MODE"),
                    2: this.$t("ENERGY.FREE_MODE"),
                    3: this.$t("ENERGY.DISABLE_MODE"),
                }[value];
            }
        }, 500),
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
        hasControl(){
            if(this.deviceControlList[this.itemInfo.deviceId]){
                let req = [];
                for(let i of Object.keys(this.deviceControlList[this.itemInfo.deviceId])){
                    let tmp = this.deviceControlList[this.itemInfo.deviceId][i]
                    if(tmp.range == '1' && tmp.attrId == "103802"){
                        return tmp
                    }
                }
                return req ;
            }
            else return false;
        },
    },
};
</script>


<style scoped>
@import "~assets/css/card.css";

.content {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
}

.top-tools {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    align-items: center;
}
</style>
