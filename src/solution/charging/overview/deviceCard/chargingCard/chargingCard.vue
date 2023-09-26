<template>
    <div class="main content_view" :style="stylerSize()">
        <span class="slaveC _24" :style='stylerSize(100,10,0,0)'> {{ itemInfo.deviceName }} </span>
        <img  class="slaveC"     :style='stylerSize(15,8,33,88)' src="~assets/images/control.png" @click="dialogTableVisible=true"/>
        <img  class="slaveC"     :style='stylerSize(15,8,52,88)' src="~assets/images/chart.png" @click="infoClick"/>
        <span class="slaveR _16" :style='stylerSize(35,5,60,95)'> {{ time }} </span>
        <el-dialog custom-class="dialog-class" :visible.sync="dialogTableVisible" :append-to-body="true" :style="stylerSize(100,100,0,0)">
            <div v-for="(pile, pile_index) in pileName" :key="pile_index">
                <span class="slaveC _32" :style='stylerSize(100/pileName.length,20,pile_index*(100/pileName.length),5)'>{{pile}}</span>
                <span v-for="(opt, index) in controlList" :key="index"
                    @click="buttonClick( index, pile_index)" class="slaveC _32 optionButton"
                    :style='stylerSize(100/(pileName.length+1),10,pile_index*100/pileName.length+(100/pileName.length-100/(pileName.length+1))/2,17+index*17)' > {{ opt }} 
                </span>
            </div>   
        </el-dialog>

        <div v-if="itemInfo.cntIdList == 1">
            <img  class="slaveC"              :style='stylerSize(15,8,65,15)' src="~/assets/images/balance.png" />
            <img  class="slaveC imageBorder"  :style='stylerSize(35,35,15,8)' src="~assets/images/單樁單槍卡片.png" />
            <span class="slaveC _24 grey"     :style='stylerSize(40,5,53,25)'> {{pileName[0]}} </span>
            <div class="slaveM background_02" :style='stylerSize(90,40,5,47)'>
                <span class="slaveC _24 bottomBorder" v-for="(data,index) in infoTitles" :key='index' :style='stylerSize(90,12,5,10+index*17)'>
                    <span class="slaveL _24 grey"            :style='stylerSize(50,100,0,0)'>{{data}}</span>
                    <span v-if="index==0" class="slaveC _24" :style='stylerSize(50,100,50,0)' :class="infoDataList[0][0][1]"> {{infoDataList[0][0][0]}} </span>
                    <span v-else class="slaveC _24 yellow"   :style='stylerSize(50,100,50,0)'>{{infoDataList[0][index]}}</span>
                </span>
            </div>
        </div>

        <div v-else>
            <img  class="slaveC imageBorder"  :style='stylerSize(35,35,33,7)' src="~assets/images/單樁雙槍卡片.png" />
            <img  class="slaveL"              :style='stylerSize(15,8,10,15)' src="~/assets/images/balance.png" />
            <img  class="slaveR"              :style='stylerSize(15,8,75,15)' src="~/assets/images/balance.png" />
            <span class="slaveC _24 grey"     :style='stylerSize(30,5,3,25)'> {{pileName[0]}} </span>
            <span class="slaveC _24 grey"     :style='stylerSize(30,5,68,25)'> {{pileName[1]}} </span>
            <div class="slaveM background_02" :style='stylerSize(90,40,5,47)'>
                <span class="slaveC _24 bottomBorder" v-for="(data,index) in infoTitles" :key='index' :style='stylerSize(90,12,5,10+index*17)'>
                    <span class="slaveC _24 grey" :style='stylerSize(40,12,30,0)'> {{data}} </span>
                    <div v-if="index==0">
                        <span class="slaveL _24"  :style='stylerSize(25,20,0,0)' :class="infoDataList[0][0][1]"> {{infoDataList[0][0][0]}} </span>
                        <span class="slaveR _24"  :style='stylerSize(25,20,70,0)' :class="infoDataList[1][0][1]"> {{infoDataList[1][0][0]}} </span>
                    </div>
                    <div v-else>
                        <span class="slaveL _24 yellow" :style='stylerSize(25,20,0,0)'> {{infoDataList[0][index]}} </span>                    
                        <span class="slaveR _24 yellow" :style='stylerSize(25,20,70,0)'> {{infoDataList[1][index]}} </span>
                    </div>
                </span>
            </div>
        </div>
    </div>
</template>

<script>
import { getDeviceData, getDeviceData2 } from "common/constant/ist";
import { remoteStart, remoteStop, remoteEnable, remoteDisable, remoteReset, 
         getChargingPileTradeInfo } from "solution/charging/data/data/data"

import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";

import ajaxTimerMixin from "common/mixin/ajaxTimerMixin"
//import item from "./item/item";
import DialogBox from "components/content/dialog/Dialog";

export default {
    props: {
        itemInfo: {
            type: Object,
            default: {},
        },
    },
    components: {
        //item,
        Swiper,
        SwiperSlide,
        DialogBox,
    },
    mixins: [ajaxTimerMixin],
    data() {
        return {
            //isAttrStatus: false, //+ isAttrStatus ? ' opacity: 0.4 ' : ''
            dialogTableVisible: false,
            pileName: [],
            time: '',
            infoDataList: [["-", "-", "-", "-", "-"], ["-", "-", "-", "-", "-"]],
            infoTitles:{
                '0': this.$t("CHARGING.CHARGING_STATUS"),
                '1': this.$t("CHARGING.CHARGING_VOLTAGE"),
                '2': this.$t("CHARGING.CHARGING_ELECTRICITY"),
                '3': this.$t("CHARGING.CHARGING_TOTAL_TIME"),
                '4': this.$t("CHARGING.CHARGING_DURATION"),
            },
            infoDataTable:{
                '103800': 0,
                '500500': 1,
                '500600': 2,
            },
            pileStatusClass: { //0: status, 1: colour class
                '0': [this.$t("CHARGING.CHARGING_AVAILABLE"),'yellow'],
                '1': [this.$t("CHARGING.CHARGING_PREPARING"),'yellow'],
                '2': [this.$t("CHARGING.CHARGING_CHARGING"),'green'],
                '3': [this.$t("CHARGING.CHARGING_SUSPENDED_EVSE"),'yellow'],
                '4': [this.$t("CHARGING.CHARGING_SUSPENDED_EV"),'yellow'],
                '5': [this.$t("CHARGING.CHARGING_FINISHING"),'yellow'],
                '6': [this.$t("CHARGING.CHARGING_RESERVED"),'green'],
                '7': [this.$t("CHARGING.CHARGING_UNAVAILABLE"),'red'],
                '8': [this.$t("CHARGING.CHARGING_FAULTED"),'red'],
            },
            controlList:{
                '0': this.$t("CHARGING.CHARGING_START_CHARGING"),
                '1': this.$t("CHARGING.CHARGING_STOP_CHARGING"),
                '2': this.$t("CHARGING.CHARGING_DISABLE"),
                '3': this.$t("CHARGING.CHARGING_ENABLE"),
                '4': this.$t("CHARGING.CHARGING_RESTART"),
            },
            notifyMsg:{
                "Accepted" : this.$t("CHARGING.CHARGING_SUCCESS_ACCEPT"),
                "Rejected" : this.$t("CHARGING.CHARGING_FAIL_REJECT"),
                "Scheduled" : this.$t("CHARGING.CHARGING_FAIL_SCHEDULED"),
            },
            //img_status: require('@/assets/images/負載平衡監控模式.png')
        };
    },
    async created() {
        await this.getDeviceData()
        await this.recursive()
    },
    methods: {
        infoClick() {
            let deviceType = this.$route.path.split("/");
            //console.log(deviceType)
            this.$router.push({
                path: "/" + deviceType[2] + "/chargingInfo/deviceDetailed",
                query: { devId: this.itemInfo.deviceId },
            });
        },
        async buttonClick(index, pile_index){
            this.dialogTableVisible = false //close button dialog
            this.$store.state.loading = true //show loading

            let res = {}
            let cpId = this.itemInfo.cpId
            let cntId = this.itemInfo.cntIdList[pile_index]
            switch(index){
                case'0':
                    res = await remoteStart(cpId, cntId)
                    break
                case'1':
                    res = await remoteStop(cpId)
                    break
                case'2':
                    res = await remoteDisable(cpId, cntId)
                    break
                case'3':
                    res = await remoteEnable(cpId, cntId)
                    break
                case'4':
                    res = await remoteReset(cpId)
                    break
                default:
                    break
            }

            if(res.status=="fail") {
                this.$notify({
                    type: 'warning',
                    title: this.$t("CHARGING.CHARGING_FAIL_MSG") ,
                    message: this.notifyMsg[res.err.msg]
                })
            }
            else if(res.result.exe_status=="fail"){
                this.$notify({
                    type: 'warning',
                    title: this.$t("CHARGING.CHARGING_FAIL_MSG") ,
                    message: this.notifyMsg[res.result.raw_status]
                })
            }
            else{
                this.$notify({
                    type: 'success',
                    title: this.$t("CHARGING.CHARGING_SUCCESS_MSG") ,
                    message: this.notifyMsg[res.result.raw_status]
                })
                await getDeviceData2()
                this.$forceUpdate()
            } 
            this.$store.state.loading = false //stop loading
        },
        async getDeviceData() {
            this.getCPusedTimeAndCurrent()
            this.pileName = []
            for(let i in this.itemInfo.cntIdList){
                //if pile name not set --> pad pile id
                let pileId = this.itemInfo.deviceId + '|' + this.itemInfo.cntIdList[i].padStart(2, '0')
                let pile = this.itemInfo.pileNameList[i]
                this.pileName.push(pile)

                let res = await getDeviceData( pileId, this.itemInfo.typename)
                //let res = this.gettmp(pileId)
                // if (res.status == "fail" || res.connect == 0 || res.connect_status == 0) this.isAttrStatus = true //else this.isAttrStatus = false
                
                for (let j = 0; j < res.data.length; j++){
                    if(res.data[j].attr=='103800'){
                        this.infoDataList[i][this.infoDataTable[103800]] = this.pileStatusClass[res.data[j].value]
                    }else
                        this.infoDataList[i][this.infoDataTable[res.data[j].attr]] = res.data[j].value
                }
                
                if(res.time) this.time = res.time
            }
        },
        async getCPusedTimeAndCurrent(){
            let res = await getChargingPileTradeInfo(this.itemInfo.cpId)
            //console.log("cpDataObj in chargingCard: ", JSON.stringify(res,null,4))
            if(res && res[0].length>1){
                for(let i in this.itemInfo.cntIdList){
                    this.infoDataList[i][3] = res[i][1] == -1 ? '-' : res[i][1]
                    this.infoDataList[i][4] = res[i][2] == -1 || res[i][2] == '-' ? '-' : 
                        Math.abs(Math.round((res[i][2]/1000 + Number.EPSILON) * 100) / 100)
                }
            }
        },
    },
    computed: {},
    watch: {},
};
</script>

<style >
.dialog-class {
    font-weight: bold;
    height: 60%;
    width: 50%;
    background-color: rgba(65, 101, 138, 0.8);/*rgba(10, 38, 81, 0.8)*/
    border-style: solid;
    border-width: 2px;
    border-color: #0b6f94;
    white-space: nowrap;
}

.imageBorder{
    border-radius:10px;
    border: 2px solid rgb(12, 29, 90);
    padding: 3px;
}
</style>
