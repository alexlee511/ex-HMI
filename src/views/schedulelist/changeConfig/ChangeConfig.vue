<template>
    <!--div :style='stylerSize(9.75,8,2,2)'-->
    <div class="hmi_setting_content main">
        
        <!-- 行程名稱跟內容 -->   
        <span class="slaveL _36" :style='stylerSize(10,7,5,2)'> {{ $t("GENERAL.SCHEDULE_NAME") }} </span>
        <input class="slaveC hmi_setting_content_input" :style='stylerSize(25,8,5,10)' maxlength="15" v-model="currentName">
        
        <span class="slaveL _36" :style='stylerSize(10,8,32,2)'> {{ $t("GENERAL.CLASS") }} </span>
        <select class="slaveC _36 " :style='stylerSize(25,8,32,10)' v-model="currentClass">
            <option
                v-for="(item, index) in ClassKind"
                :value="item"
                :key="index">
                {{ item }}
            </option>
        </select>
        
        <span class="slaveL _36" :style='stylerSize(10,8,59,2)'> {{ $t("GENERAL.CONTROL_DEVICE_LIST") }} </span>
        <select class="slaveC _36 " :style='stylerSize(37,8,59,10)' v-model="currentDevice" :disabled="isDeviceListOpen">
            <option v-if="isDeviceListOpen" value="0">
                {{ $t("GENERAL.NO_DEVICE_SETTING") }}
            </option>
            <option
                v-for="(item, index) in commandDeviceList2[currentInfo.type]"
                :value="item.scene_id||item.dev_id"
                :key="index">
                {{ item.dev_name || item.scene_name }}
            </option>
        </select>

        <!-- 單次 or 重複 -->
        <div class="slaveL" :style='stylerSize(20,5,10*index + 4.5,30)' v-for="(item, index) in periodList" :key="index">
            <input type="radio" name="mode_value" @input="changeModeValue(item.value)" :checked="periodValue - 1 == item.value">
                <div class="_36 slaveL" :style='stylerSize(40,100,15,0)'>{{ item.text }}</div>
        </div>
        
        <!-- 執行時間 -->
        <span class="slaveL _36" :style='stylerSize(10,10,59,30)'> {{ $t("GENERAL.SPECIFIED_TIME") }} </span>
        
        <select class="slaveC _36 " :style='stylerSize(6,8,69,30)' :value="hourSelect" @change="hourChange">
            <option v-for="(item, index) in 24" :key="index">
                {{ index.toString().length === 1 ? "0" + index : index + "" }}
            </option>
        </select>
        <span class="slaveC _36" :style='stylerSize(5,5,74,30)'>&nbsp;:&nbsp;</span>
        <select class="slaveC _36 " :style='stylerSize(6,8,78,30)' :value="minuteSelect" @change="minuteChange">
            <option v-for="(item, index) in 60" :key="index">
                {{ index.toString().length === 1 ? "0" + index : index + "" }}
            </option>
        </select>
            
        
        <!--開始與結束日期-->
        <div class="slaveC" :style='stylerSize(90,20,4,45)'>
            
            <span class="slaveL _36" :style='stylerSize(10,50,1.5,0)' v-if="isStartDateOpen"> {{ $t("GENERAL.START_DATE") }} </span>
            <big-date-pick
                :style='stylerSize(20,10,13,10)'
                :big="true"
                v-if="isStartDateOpen"
                ref="firstPick"
                :date="dateValue"
                class="slaveL"
                @pickDate="changeDateValue" />
            


            <span :class="!isEndDateOpen && 'hideComponent'" class="slaveL _36" :style='stylerSize(15,50,61,0)'>
                <input type="checkbox" :checked="currentInfo.stop_date" @input="showEndDate">
                    {{ $t("GENERAL.END_DATE") }}
            </span>
            <big-date-pick  v-if="currentInfo.stop_date"
                            :style='stylerSize(20,10,76,0)'
                            :big="true"
                            ref="lastPick"
                            :date="endDateValue"
                            class="slaveL"
                            :class="!isEndDateOpen && 'hideComponent'"
                            @pickDate="changeEndDateValue" />

        </div>

        <div v-if="isWeekListOpen" class="slaveL" :style='stylerSize(80,20,4.5,58)'>
            <div class="slaveL _36" :style='stylerSize(20,10,13*index,0)' v-for="(item, index) in weekList" :key="index">
                <input type="checkbox"
                    :value="item.value"
                    @input="changeWeekSelect(item.value)"
                    :checked="weekSelect.indexOf(item.value) !== -1" />
                    {{ item.text }}
            </div>
        </div>
        
        <!--執行動作-->
        <div v-if="currentInfo.type!='98'">
            <span class="slaveL _36" :style='stylerSize(10,15,5,70)'> {{ $t("GENERAL.SPECIFIED_ACTION") }} </span>
            <div class="slaveL _36" :style='stylerSize(60,20,15*ctl_index+15,80)' v-for="(ctl_info, ctl_index) in ctlInfoList" :key="ctl_info.target_id + '_' + ctl_index">
                
                <input type="checkbox" @input="showCommandValue(ctl_info)" v-model="controlChecked[ctl_info.control_type]">
                {{ controlClassList[currentInfo.module_name][ctl_info.control_type].description }}
                
                <div v-if="controlChecked[ctl_info.control_type] " :key="controlChecked[ctl_info.control_type]">
                    <select class="" :style='stylerSize(20,20,0,0)' v-if="controlRangeValue(ctl_info.control_type) === 1" v-model="controlValue[ctl_info.control_type]">
                        <option v-for="(item, index) in controlSelectList(ctl_info.control_type)" :key="index" :value="item.value">
                            {{ item.name }}
                        </option>
                    </select>
                    <input v-if="controlRangeValue(ctl_info.control_type) === 2" type="text" v-model="controlValue[ctl_info.control_type]">
                    <select class="" :style='stylerSize(20,20,0,0)' v-if="controlRangeValue(ctl_info.control_type) === 3">
                        <option v-for="(value, index) in controlSelectList(ctl_info.control_type)" :key="index">
                            {{ value }}
                        </option>
                    </select>
                </div>
            </div>
        </div>
  
    </div>
</template>

<script>
import BigDatePick from '@/components/common/datePick/BigDatePick.vue';
import scheduleStoreMixin from "../mixin/scheduleStoreMixin";
import commandStoreMixin from "@/store/modules/deviceCommand/mixin"
import { typeToKind } from "common/constant/type"
import { Notification } from "element-ui"
import moment from 'moment';

export default {
    mixins: [
        scheduleStoreMixin,
        commandStoreMixin
    ],
    data() {
        return {
            weekList: [
                {
                    value: 0,
                    text: this.$t("GENERAL.SUNDAY"),
                },
                {
                    value: 1,
                    text: this.$t("GENERAL.MONDAY"),
                },
                {
                    value: 2,
                    text: this.$t("GENERAL.TUESDAY"),
                },
                {
                    value: 3,
                    text: this.$t("GENERAL.WEDNESDAY"),
                },
                {
                    value: 4,
                    text: this.$t("GENERAL.THURSDAY"),
                },
                {
                    value: 5,
                    text: this.$t("GENERAL.FRIDAY"),
                },
                {
                    value: 6,
                    text: this.$t("GENERAL.SATURDAY"),
                },
            ],
            periodList: [
                {
                    value: 0,
                    text: this.$t("GENERAL.PERIOD_ONCE"),
                },
                {
                    value: 1,
                    text: this.$t("GENERAL.PERIOD_DAY"),
                },
                {
                    value: 2,
                    text: this.$t("GENERAL.PERIOD_WEEK"),
                }
            ],
            scheduleId: this.$route.query.scheduleId,
            currentInfo: {
                type: Object,
            },
            ctlInfoList: [],
            controlChecked: {},
            controlValue: {},
            commandDeviceList2:{},
            Context_List_Obj: {},
            modifiedId: '',
            instantPickStartDate: '',
            instantPickStopDate: '',
            infoBeforeEdit: {},
            goBack: false,
        }
    },
    async created() {
        for(let type of Object.keys(this.commandDeviceList)){
            if(this.commandDeviceList[type].length != 0){
                this.commandDeviceList2[type] = this.commandDeviceList[type];
            }
        }

        /*Get Context Info*/
        for(let card of this.$store.state.solutionData.context.card){
            for(let context of card.device){
                let tmp_obj = {};
                //remove property 'scene_enable' and copy the rest to new obj
                tmp_obj = Object.keys(context).reduce(function(obj, k) {
                    if (k != 'scene_enable' && k != 'control_list' && k != 'scene_id') obj[k] = context[k];
                    return obj;
                }, {});
                this.Context_List_Obj[context.scene_id] = tmp_obj;

                let list = [];
                for( let ctrl_dev of context.control_list){
                    list.push(ctrl_dev.dev_id)
                }
                this.Context_List_Obj[context.scene_id]['control_device_list'] = list;
            }
        }

        /*Add context setting*/
        this.commandDeviceList2['98'] = []
        let cnt = 0;
        for(let context of Object.keys(this.Context_List_Obj)){
            this.commandDeviceList2['98'].push(this.Context_List_Obj[context])
            this.commandDeviceList2['98'][cnt]['scene_id'] = context;
            cnt += 1;
        }
        if(this.commandDeviceList2['98'].length==0) delete this.commandDeviceList2['98'];

        console.log(this.commandDeviceList2)
        // modify schedule
        if(this.scheduleId) {
            const info = this.scheduleList.find(item => {
                return item.sid === this.scheduleId;
            });
            this.currentInfo = info;
            console.log("INIT info", info)

            if(info.schedule_type=='cav'){
                this.modifiedId = JSON.parse(JSON.stringify(info.dev_id.split('|')[0] + ' ' + info.sid)) //deep copy

                // 初始化dev_id // info.dev_id在第一次初始化時整個排程設定介面時不包含子回路
                if(info.cav && !this.currentInfo.dev_id.includes('|') && info.cav[0].split('_')[0] != 'NULL'){
                    this.currentInfo.dev_id += '|' + info.cav[0].split('_')[0];
                }

                //初始化控制資訊
                if(this.currentInfo.dev_id.includes('|')){
                    let target_channel = this.currentInfo.dev_id.split('|')[1];
                    let findDevIndex = this.commandDeviceList2[info.type].findIndex( e => {
                        return e.dev_id == this.currentInfo.dev_id;
                    })  
                    let notifyDataMissing = false;
                    if(findDevIndex != -1){
                        let findCtlInfo = this.commandDeviceList2[info.type][findDevIndex].ctl_info.findIndex( e => {
                            return e.channel == target_channel;
                        })
                        if(findCtlInfo != -1){
                            this.ctlInfoList = this.commandDeviceList2[info.type][findDevIndex].ctl_info[findCtlInfo];
                        }else{
                            console.log("MISSING 1")
                            notifyDataMissing = true;
                        }
                    }else{
                        console.log("MISSING 2")
                        notifyDataMissing = true;
                    }
                    if(notifyDataMissing){
                        Notification({
                            type: 'error',
                            title: this.$t("GENERAL.DATA_MISSING"),
                            message: this.$t("GENERAL.DATA_MISSING_COMMAND")
                        });
                    }
                }
            }
            // 初始化情境
            else{
                this.modifiedId = JSON.parse(JSON.stringify(info.scene_id + ' ' + info.sid))
            }
            console.log("INIT dev_id", info.dev_id)
            
            this.instantPickStartDate = info.start_date
            this.instantPickStopDate = info.stop_date
            this.infoBeforeEdit = JSON.stringify(this.currentInfo);
            this.currentDevice = info.dev_id || info.scene_id;
        }else {
            // currentInfo init
            const obj = {};
            obj.enable = 'yes';
            obj.schedule_name = "";
            obj.type = Object.keys(this.commandDeviceList2)[0];
            obj.sid = new Date().getTime().toString();
            obj.trigger_mode = "once";
            obj.year = moment().format('YYYY');
            obj.month = moment().format('MM');
            obj.day = moment().format('DD');
            obj.hour = moment().format('hh');
            obj.minute = moment().format('mm');
            obj.stop_date = "*";
            obj.day_of_week = "*";
            if(obj.type!='98'){
                obj.dev_id = this.commandDeviceList2[obj.type][0].dev_id;
                obj.dev_name = this.commandDeviceList2[obj.type][0].dev_name;
                obj.module_name = Object.keys(this.controlClassList)[0];
                obj.cmd = new Object();
                obj.cav = new Object();
                this.ctlInfoList = this.commandDeviceList2[obj.type][0].ctl_info;
                // console.log("[controlClassList]\n", JSON.stringify(this.controlClassList, null, 4))
                this.controlValue = {};
                this.controlChecked = {};
            }else{
                obj.scene_id = this.commandDeviceList2['98'][0].scene_id;
                obj.scene_name = this.commandDeviceList2['98'][0].scene_name;
                //obj.control_device_list = this.commandDeviceList2['98'][0].control_device_list;
            }
            this.currentInfo = obj;
            console.log(obj.dev_id);
            this.currentDevice = obj.dev_id;
        }
    },
    mounted() {
        this.$bus.$on("configLoad", async () => {
            // 資料缺失判斷
            if(!this.currentInfo.dev_id && !this.currentInfo.scene_id){
                Notification({
                    type: 'error',
                    title: this.$t("GENERAL.DATA_MISSING"),
                    message: this.$t("GENERAL.NO_DEVICE_SETTING"),
                });
                return;
            }
            if(!Object.keys(this.controlValue).length && this.currentInfo.type!='98'){
                Notification({
                    type: 'error',
                    title: this.$t("GENERAL.DATA_MISSING"),
                    message: this.$t("GENERAL.DATA_MISSING_COMMAND")
                });
                return;
            }
            for(let ctl_type of Object.keys(this.controlValue)){
                if(this.controlClassList[this.currentInfo.module_name][ctl_type].range === '2'){
                    let valueStr = this.controlValue[ctl_type][0] === ' ' ?
                        this.controlValue[ctl_type].substr(1) : this.controlValue[ctl_type];
                    if(valueStr.match(/[^\d]+/g)){
                        Notification({
                            type: 'error',
                            title: this.$t("GENERAL.SETTING_ERROR"),
                            message: this.$t("GENERAL.SETTING_ERROR_COMMAND_INPUT"),
                        })
                        return;
                    }
                }
            }

            // 最後設定執行動作的數值
            for(let ctl_type of Object.keys(this.controlValue)){
                let cavArr = this.currentInfo.cav[ctl_type].split('_');
                cavArr[2] = this.controlValue[ctl_type];
                this.currentInfo.cav[ctl_type] = cavArr.join('_');
            }

            if(this.scheduleId){
                if(this.checkDateReasonable( this.instantPickStartDate, this.instantPickStopDate)){
                    this.currentInfo.start_date = this.instantPickStartDate
                    this.currentInfo.stop_date = this.instantPickStopDate
                }
                //delete modified schedule
                if(this.modifiedId != this.currentInfo.dev_id+' '+this.currentInfo.sid 
                    && this.modifiedId != this.currentInfo.scene_id+' '+this.currentInfo.sid){
                        this.deleteScheduleList(this.modifiedId)
                }
                this.modifyScheduleList(this.currentInfo);
            }else{
                this.addScheduleList(this.currentInfo);
            }
            this.$router.back();
        });
        this.$bus.$on("previousPage", async ()=>{
            //不套用新資料
            this.goBack = true;
        });
    },
    beforeDestroy() {
        this.$bus.$off("configLoad");
        this.$bus.$off("previousPage");

        if(this.goBack && typeof this.infoBeforeEdit !== "object") {
            let i=0;
            this.infoBeforeEdit = JSON.parse(this.infoBeforeEdit);
            for(let schedule of this.scheduleList){
                if(schedule.sid === this.scheduleId){
                    this.scheduleList[i] = schedule = this.infoBeforeEdit;
                    this.currentInfo.type = this.infoBeforeEdit.type
                    this.currentInfo.cav = this.infoBeforeEdit.cav
                    this.currentInfo.cmd = this.infoBeforeEdit.cmd
                    this.currentInfo.schedule_name = this.infoBeforeEdit.schedule_name
                    break;
                }
                i += 1;
            }
        }
        
        this.currentInfo.start_date = this.instantPickStartDate
        this.currentInfo.stop_date = this.instantPickStopDate

        let path = this.$route.path.split('/');
        if(path[path.length - 1] !== "scheduleList") this.resetScheduleList();
    },
    components: {
        BigDatePick,
    },
    methods: {
        checkDateReasonable(startDate, endDate) {
            console.log(startDate,endDate)
            if(endDate){
                if( endDate != '*' && startDate > endDate){
                    Notification({
                        type: 'warning',
                        title: this.$t("GENERAL.SETTING_ERROR"),
                        message: this.$t("GENERAL.SETTING_ERROR_STOP_DATE")
                    });
                }else{
                    this.currentInfo.start_date = startDate;
                    this.currentInfo.stop_date = endDate;
                }
            }
        },
        // 修改trigger_mode 同時修改一些currentInfo的資料
        changeModeValue(value) {
            const newObj = {...this.currentInfo};
            if(!newObj.start_date){
                newObj.start_date = Date.now();
                this.instantPickStartDate = Date.now();
            }

            if(value == 0) {
                newObj.trigger_mode = "once";
                if(newObj.start_date){
                    const dateArr = newObj.start_date.split('-');
                    newObj.year = dateArr[0];
                    newObj.month = dateArr[1];
                    newObj.day = dateArr[2];
                }
                delete newObj.day_of_week;
                //delete newObj.start_date;
            }
            else if(value == 1){
                if(newObj.month === '*' && newObj.day === '*')
                    newObj.start_date = newObj.start_date;
                else
                    newObj.start_date = `${newObj.year}-${newObj.month}-${newObj.day}`;
                newObj.year = '*';
                newObj.month = '*';
                newObj.day = '*';
                newObj.trigger_mode = "period";
                newObj.day_of_week = '*';
            }
            else{
                if (newObj.month === '*' && newObj.day === '*' )
                    newObj.start_date = newObj.start_date;
                else
                    newObj.start_date = `${newObj.year}-${newObj.month}-${newObj.day}`;
                newObj.year = '*';
                newObj.month = '*';
                newObj.day = '*';
                newObj.trigger_mode = "period";
                newObj.day_of_week = "0,1,2,3,4,5,6";
            }
            this.currentInfo = newObj;
        },
        // 更新日期
        changeDateValue(value) {
            this.checkDateReasonable(value, this.instantPickStopDate)
            this.instantPickStartDate = value
            if(this.currentInfo.trigger_mode === 'once'){
                const dateArr = value.split('-');
                this.currentInfo.day = dateArr[2];
                this.currentInfo.month = dateArr[1];
                this.currentInfo.year = dateArr[0];
            }
        },
        // 更新 day_of_week
        changeWeekSelect(value){
            let weekArr = new Array();
            if(this.currentInfo.day_of_week === '-1')
                weekArr = [];
            else weekArr = Array.from(this.currentInfo.day_of_week.split(','), value => Number(value));
            let index = weekArr.indexOf(value);
            
            if(index !== -1)
                weekArr.splice(index, 1);
            else{
                weekArr.push(value);
                weekArr.sort(function(a, b){
                    return a - b;
                });
            }

            if(weekArr.length === 0) this.currentInfo.day_of_week = '-1';
            else this.currentInfo.day_of_week = weekArr.join(',');
        },
        // 更新時間(小時)
        hourChange($event) {
            this.currentInfo.hour = $event.target.value;
        },
        // 更新時間(分鐘)
        minuteChange($event) {
            this.currentInfo.minute = $event.target.value;
        },
        // 顯示結束日期選項
        showEndDate($event){
            console.log($event.target.checked)
            if($event.target.checked)
                this.currentInfo.stop_date = moment().format('YYYY-MM-DD');
            else{
                this.currentInfo.stop_date = "";
                this.instantPickStopDate = "";
            }
            console.log(this.currentInfo.stop_date)
        },
        // 更新結束日期
        changeEndDateValue(value){
            this.checkDateReasonable(this.instantPickStartDate, value)
            this.instantPickStopDate = value;
        },
        // 顯示個別執行動作的表單 & 更新cav, cmd
        showCommandValue(ctl_info){
            console.log(ctl_info)
            if(ctl_info.control_type in this.currentInfo.cav){
                delete this.currentInfo.cmd[ctl_info.control_type];
                delete this.currentInfo.cav[ctl_info.control_type];
                delete this.controlValue[ctl_info.control_type];
            }
            else{
                let channel = ctl_info.channel
                let cmd_info = this.controlClassList[this.currentInfo.module_name][ctl_info.control_type];
                this.updateCavCmd( ctl_info.control_type, channel, cmd_info)
            }
        },
        // 判斷這個執行動作是甚麼格式
        controlRangeValue(ctl_type){
            return Number(this.controlClassList[this.currentInfo.module_name][ctl_type].range);
        },
        updateCavCmd( control_type, channel, cmd_info){
            if(Number(cmd_info.range) === 1){
                this.controlValue[control_type] = cmd_info.value_list[0].value;
                this.currentInfo.cav[control_type] = String(channel + "_" + cmd_info.attrId + "_" + cmd_info.value_list[0].value);
            }
            else if(Number(cmd_info.range) === 2){
                this.controlValue[control_type] = " ";
                this.currentInfo.cav[control_type] = String(channel + "_" + cmd_info.attrId + "_NULL");
            }
            else{
                if(cmd_info.value_range.includes('~')){
                    this.controlValue[control_type] = cmd_info.value_range.split('~')[0];
                    this.currentInfo.cav[control_type] = String(channel + "_" + cmd_info.attrId + "_" + cmd_info.value_range.split('~')[0]);
                }else{
                    this.controlValue[control_type] = cmd_info.value_range.split('-')[0];
                    this.currentInfo.cav[control_type] = String(channel + "_" + cmd_info.attrId + "_" + cmd_info.value_range.split('-')[0]);
                }
            }
            this.currentInfo.cmd[control_type] = cmd_info.writeCmd;
        }
    },
    computed: {
        // 初始化&設定行程名稱
        currentName: {
            set(name){
                this.currentInfo.schedule_name = name;
            },
            get(){
                if(Object.keys(this.currentInfo).length > 0)
                    return this.currentInfo.schedule_name;
            }
        },
        // 回傳翻譯過後的類別陣列
        ClassKind(){
            let ClassKind = new Array();
            for(let type of Object.keys(this.commandDeviceList2))
                if(this.commandDeviceList2[type].length != 0){
                    ClassKind.push(this.$t("GENERAL." + typeToKind(type)));
                }
            return ClassKind;
        },
        // 初始化&設定分類
        currentClass: {
            set(value){
                this.currentInfo.cav = {}
                this.currentInfo.cmd = {}
                this.controlValue = {}
                let new_type = Object.keys(this.commandDeviceList2).find(type => {
                    return this.$t("GENERAL." + typeToKind(type)) === value;
                });
                let old_type = this.currentInfo.type;
                this.currentInfo.type = new_type;
                console.log("[SET CLASS]", old_type + " ---> " + new_type);
                // 如果class有變更才需要初始化成第一個設備
                if(this.commandDeviceList2[new_type].length > 0 && new_type != old_type){
                    if(new_type != '98'){
                        this.currentDevice = this.commandDeviceList2[new_type][0].dev_id;
                        delete this.currentInfo.scene_id;
                    }else {
                        this.currentDevice = this.commandDeviceList2[new_type][0].scene_id;
                        delete this.currentInfo.dev_id;
                    }
                }
            },
            get(){
                // console.log("[CURRENT INFO]\n", JSON.stringify(this.currentInfo, null, 4))
                if(Object.keys(this.currentInfo).length > 0){
                    return this.$t("GENERAL." + typeToKind(this.currentInfo.type));
                }
            },
        },
        currentDevice: {
            // 設定設備名稱 初始化執行動作
            set(value){
                console.log("[SET DEVICE]", value)
                if(value === undefined){
                    value = this.commandDeviceList2[this.currentInfo.type][0].dev_id || 
                            this.commandDeviceList2[this.currentInfo.type][0].scene_id
                }
                if(typeof value === 'object'){
                    value = value.dev_id || value.scene_id
                }
                if( this.currentInfo.type == '98'){
                    this.currentInfo.schedule_type = 'scene'
                    this.currentInfo.scene_id = value
                    delete this.currentInfo.dev_id

                    let index = Object.keys(this.commandDeviceList2).indexOf(this.currentInfo.type);
                    if(index != -1){
                        let scene_info = this.commandDeviceList2['98'].find(dev => {
                            return dev.scene_id === this.currentInfo.scene_id;
                        });
                        this.currentInfo.scene_name = scene_info.scene_name;
                        //2023 06 14 不知道為什麼 這邊要把情境的control_device_list 寫近來，造成下API有一堆的 
                        //control_device_list 裡面的 devid 進而造成431錯誤
                        //this.currentInfo.control_device_list = scene_info.control_device_list
                        this.currentInfo.schedule_type = 'scene'
                        delete this.currentInfo.dev_id
                        delete this.currentInfo.dev_name
                        delete this.currentInfo.module_name
                        delete this.currentInfo.cav
                        delete this.currentInfo.cmd
                    }
                }else{
                    this.currentInfo.schedule_type = 'cav'
                    // 初始化有子回路的設備
                    // console.log(this.ctlInfoList)
                    // if(this.ctlInfoList && this.ctlInfoList[0].channel != "NULL"){
                    //     this.currentInfo.dev_id = value.split('|')[0] + "|" + this.ctlInfoList[0].channel;
                    // }
                    // //初始化普通設備
                    // else{ 
                        this.currentInfo.dev_id = value;
                    // }
                    delete this.currentInfo.scene_id
                    delete this.currentInfo.scene_name
                    delete this.currentInfo.control_device_list
                    let index = Object.keys(this.commandDeviceList2).indexOf(this.currentInfo.type);
                    if(index != -1){
                        let dev_info = this.commandDeviceList2[this.currentInfo.type].find(dev => {
                            console.log("finding...", dev)
                            return dev.dev_id === this.currentInfo.dev_id;
                        });
                        console.log(this.currentInfo.dev_id , value, this.currentInfo.dev_id === value)
                        console.log(dev_info, this.commandDeviceList2[this.currentInfo.type], this.currentInfo.type)
                        this.ctlInfoList = dev_info.ctl_info;
                        this.currentInfo.module_name = dev_info.module_name;
                        this.currentInfo.dev_name = this.$store.state.deviceName[value] || value;
                        let ctl_value = {};
                        let ctl_checked = {};
                        if(this.currentInfo.cav){
                            for(let ctl_type of Object.keys(this.currentInfo.cav)){
                                ctl_checked[ctl_type] = true;
                                if(this.controlValue[ctl_type]){
                                    ctl_value[ctl_type] = this.controlValue[ctl_type];
                                }else {
                                    ctl_value[ctl_type] = this.currentInfo.cav[ctl_type].split('_')[2];
                                }
                            }
                        }else{ 
                            this.currentInfo.cav = {}
                            this.currentInfo.cmd = {}
                        }
                        this.controlValue = ctl_value;
                        this.controlChecked = ctl_checked;
                    }
                }  
            },
            get(){
                console.log("[CURRENT INFO]\n", JSON.stringify(this.currentInfo, null, 4))
                if(this.currentInfo.type=='98'){ 
                    return this.currentInfo.scene_id;                   
                }else{
                    return this.currentInfo.dev_id;
                }
            }
        },
        // 初始化時間(小時)
        hourSelect() {
            if(this.currentInfo) {
                return ('00' + this.currentInfo?.hour).substr(this.currentInfo?.hour?.length);
            }
        },
        // 初始化時間(分鐘)
        minuteSelect() {
            if(this.currentInfo) {
                return ('00' + this.currentInfo?.minute).substr(this.currentInfo?.minute?.length);
            }
        },
        // 初始化開始日期
        dateValue() {
            if(this.currentInfo){
                this.instantPickStartDate = this.currentInfo.start_date
                return this.currentInfo.start_date;
            }
        },
        // 回傳選擇的星期列表
        weekSelect() {
            if(this.currentInfo){
                if(this.currentInfo.day_of_week === '') return [];
                return Array.from(this.currentInfo.day_of_week.split(','), value => Number(value));
            }
        },
        // 計算是哪個排成類別
        periodValue(){
            if(this.currentInfo){
                switch(this.currentInfo.trigger_mode){
                    case 'once':
                        return 1;
                    case 'period':
                        if(this.currentInfo.day_of_week === '*')
                            return 2;
                        else return 3;
                    default:
                        break;
                }
            }
        },
        isDeviceListOpen(){
            if(this.currentInfo){
                if(this.commandDeviceList2[this.currentInfo.type]){
                    if(!this.commandDeviceList2[this.currentInfo.type].length){
                        if(this.currentInfo.type!='98'){
                            this.currentInfo.dev_id = "";
                            this.ctlInfoList = [];
                        }else{
                            this.currentInfo.scene_id = "";
                        }
                        return true;
                    }
                }
                return false;
            }
        },
        // 是否開啟星期選單
        isWeekListOpen(){
            if(this.currentInfo)
                return this.periodValue == 3 ? true : false;
        },
        // 是否開啟開始日期的選單
        isStartDateOpen(){
            if(this.currentInfo)
                return this.periodValue > 0  && this.periodValue <= 3 ? true : false;
        },
        // 是否開啟結束日期的選單
        isEndDateOpen(){
            if(this.currentInfo)
                return this.periodValue == 2 || this.periodValue == 3 ? true : false;
        },
        // 初始化結束日期
        endDateValue(){
            if(this.currentInfo){
                if(!this.currentInfo.stop_date) 
                    this.currentInfo.stop_date = ''
                this.instantPickStopDate = this.currentInfo.stop_date
                if(this.currentInfo.trigger_mode === 'period')
                    return this.currentInfo.stop_date;
            }
        },
        // 是否開啟執行動作的選單
        isCommandOpen(){
            return function(ctl_type){
                if(this.controlChecked)
                    return this.controlChecked[ctl_type];
            }
        },
        // 回傳執行動作的數值列表
        controlSelectList(){
            return function(control_type){
                if(this.currentInfo){
                    let ctl_type = this.controlClassList[this.currentInfo.module_name][control_type];
                    if(Number(ctl_type.range) === 1){
                        return ctl_type.value_list;
                    }
                        
                    else if(Number(ctl_type.range) === 3){
                        let selectArr = new Array();
                        let range = ctl_type.value_range.includes('~') ? ctl_type.value_range.split('~') : ctl_type.value_range.split('-');
                        for(let i = Number(range[0]); i <= Number(range[1]); i++)
                            selectArr.push(i);
                        return selectArr;
                    }
                }
            }
        },            
    },
    // watch:{
    //     currentInfo(){
    //         console.log(this.currentInfo)
    //     }
    // }
}
</script>

<style scoped>
.REMINDERLIST_CONTENT {
    display: flex;
    color: white;
    font-weight: bold;
    height: 100%;
    width: 100%;
    margin: auto;
    flex-direction: column;
    font-size: 2.5vw;
    line-height: 1.5;
}

input[type="radio"] {
    width: 4vmin;
    height: 4vmin;
}

input[type="checkbox"] {
    width: 4vmin;
    height: 4vmin;
}


</style>