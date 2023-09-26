<template>
    <div class="main white_view" :style='stylerSize()'>
        <div class="title_item slaveM" :style='stylerSize(100,15,0,0)'>
            <div class="slaveC _36 text_center" :style='stylerSize(10, 100 ,0 , 0)'> {{ $t("GENERAL.INDEX") }} </div>
            <div class="slaveC _36 text_center" :style='stylerSize(10, 100 ,10, 0)'> {{ $t("GENERAL.ENABLE") }} </div>
            <div class="slaveC _36 text_center" :style='stylerSize(20, 100 ,20, 0)'> {{ $t("GENERAL.SCHEDULE_NAME") }} </div>
            <div class="slaveC _36 text_center" :style='stylerSize(30, 100 ,40, 0)'> {{ $t("GENERAL.CONTROL_DEVICE_LIST") }} </div>
            <div class="slaveC _36 text_center" :style='stylerSize(18, 100 ,70, 0)'> {{ $t("GENERAL.SCHEDULE_PERIOD") }} </div>
        </div>

        <div class="slaveM overFlowY"  :style='stylerSize(100,85,0,15)'>
            <div class=" slaveM" v-for="(item, index) in scheduleList2" :style='stylerwd(100,100,0,index)' :class="item.isChange ? 'change_item' :''" :key="index">
                <div class="slaveC _36" :style='stylerSize(10,100,0,0)'> {{ Number(index + 1) }} </div>
                <div class="slaveC _36" :style='stylerSize(10,100,10,0)'>
                    <input type="radio" @click='radiokill($event , item)' value="yes" v-model="item.enable">
                </div>
                <div class="slaveC _36" :style='stylerSize(20,100,20,0)' > {{ item.schedule_name || item.sid }} </div>
                <div class="slaveC _36" :style='stylerSize(30,100,40,0)'>
                    <div class="slaveL _36" v-if="!item.scene_id || getContextCtrlDevLength(item.scene_id)" :style='stylerSize(100,20,0,0)'> 
                        <img @click="showCommandInfo(index)" :style='stylerSize(6,25,0,0)' src="~assets/images/arrow_down_03.png" />
                        <span v-if="item.type=='98'"> {{ $t("GENERAL.CONTEXT_SETTING") }}: {{ getContextName(item.scene_id, index) }} </span>
                        <span v-else> {{ item.dev_name || item.dev_id }} </span>
                    </div>
                    <span v-else class="slaveL _36" :style='stylerSize(100,8,0,0)'> {{ $t("GENERAL.CONTEXT_SETTING") }}: {{ getContextName(item.scene_id, index) }} </span>
                       
                    <transition name="dropdown" >
                        <div v-if="currentCommandIndex == index && !item.scene_id" class="slaveL _28" :style='stylerSize(100,50,0,8)' style="white-space: normal;  word-break: break-all;">
                            <div v-for="(info, info_index) in getCommandInfo(item, index)" :key="info_index">
                                {{ info.text }}: {{ info.value }}
                            </div>
                        </div>
                        <div v-else-if="currentCommandIndex == index" class="slaveL _28" :style='stylerSize(100,50,0,8)' style="white-space: normal;  word-break: break-all;">
                            <div v-for="(dev, dev_index) in getContextDev(item.scene_id)" :key="dev_index">
                                {{ dev }}
                            </div>
                        </div>
                    </transition>
                </div>
                <div class="slaveC _36" :style='stylerSize(18,100,70.5,0)'>
                    <div class="slaveC">
                        <img @click="showScheduleInfo(index)" :style='stylerSize(28,5,0,0)' src="~assets/images/arrow_down_03.png" />
                        {{ getScheduleStatement(item) }} 
                    </div>
                    <transition name="dropdown">
                        <div v-if="currentScheduleIndex == index" class="slaveL _28" :style='stylerSize(100,50,0,8)' style="white-space: normal; word-break: break-all;">
                            <div v-for="(info, infoIndex) in getScheduleInfo(item)" :key="infoIndex"> {{info.text}}: {{ info.value }} </div>
                        </div>
                    </transition>
                </div>
                <img class="slaveC" :style='stylerSize(3,8.5,88,0)' src="~assets/images/modify.png" @click="scheduleChange(item)">
                <img class="slaveC" :style='stylerSize(3,8.5,93,0)' src="~assets/images/remove.png" @click="scheduleDelete(index)">
            </div>
        </div>
    </div>
</template>

<script>
import HeaderButton from "components/content/headerButton/HeaderButton"
import scheduleStoreMixin from "../mixin/scheduleStoreMixin"
import { Ctl_List_Obj } from "common/constant/profile"
import { ConfigEvent } from "network/uci"

export default {
    mixins: [scheduleStoreMixin],
    components: {
        HeaderButton,
    },
    data(){
        return{
            currentScheduleIndex: null,
            currentCommandIndex: null,
            flagDate: null,
            flagCommand: null,
            scheduleList2:[],
            flag: -1,
            infoLength: 0,
            weekDictionary:{
                0: this.$t("GENERAL.SUNDAY"),
                1: this.$t("GENERAL.MONDAY"),
                2: this.$t("GENERAL.TUESDAY"),
                3: this.$t("GENERAL.WEDNESDAY"),
                4: this.$t("GENERAL.THURSDAY"),
                5: this.$t("GENERAL.FRIDAY"),
                6: this.$t("GENERAL.SATURDAY")
            }
        };
    },
    async created(){
        //初始化抓之前儲存的資料
        if(!this.scheduleList.length)
            await this.GetScheduleList();
        this.scheduleList2 = this.scheduleList ;
        
        console.log("------------------------------")
        
        
    },
    mounted() {
        this.$bus.$on("configApply", async () => {
            this.$store.commit("setLoadingState");
            await this.SetScheduleList();
            this.$router.back();
            this.$store.commit("setLoadingState");
            // setTimeout(async () => {
            //     await this.resetScheduleList();
            //     await this.GetScheduleList();
            //     this.scheduleList2 = this.scheduleList ;
            //     ConfigEvent("update", "schedule")
            // }, 1500);
        });
    },
    beforeDestroy() {
        this.$bus.$off("configApply");
        this.$bus.$off("previousPage");

        let path = this.$route.path.split('/');
        if(path[path.length - 1] !== "scheduleList")
            this.resetScheduleList();
    },
    methods: {
        radiokill($event , data){
            if(data.enable == 'no'){
                data.enable = 'yes'
                $event.target.checked = true
            }else{
                data.enable = 'no'
                $event.target.checked = false
            }
            data.isChange = true
        },
        scheduleChange(item) {
            let path = this.$route.path.replace(/configView/i, "changeConfig");
            this.$router.push({
                path: path,
                query: {
                    scheduleId: item.sid,
                },
            });
        },
        async scheduleDelete(index) {
            this.deleteScheduleList(index);
        },
        getScheduleStatement(info){
            if(info.trigger_mode === 'once')
                return this.$t("GENERAL.PERIOD_ONCE");
            else{
                if(info.day_of_week === '*')
                    return this.$t("GENERAL.PERIOD_DAY");
                else return this.$t("GENERAL.PERIOD_WEEK");
            }
        },
        getScheduleInfo(info){
            let infoList = [
                {
                    text: this.$t("GENERAL.SPECIFIED_TIME"),
                    value: `${info.hour}:${info.minute}`,
                },
            ];
            if(info.trigger_mode === 'once'){
                infoList.push({
                    text: this.$t("GENERAL.START_DATE"),
                    value: `${info.year}/${info.month}/${info.day}`,
                })
            }
            else{
                infoList.push({
                    text: this.$t("GENERAL.START_DATE"),
                    value: info.start_date.replace(/-/g, '/'),
                });
                if(info.is_end_date){
                    infoList.push({
                        text: this.$t("GENERAL.END_DATE"),
                        value: info.stop_date.replace(/-/g, '/'),
                    });
                }
                if(info.day_of_week !== '*'){
                    let weekString = '';
                    let weekArr = info.day_of_week.split(',');
                    for(let value of weekArr)
                      weekString =  weekString.concat(this.weekDictionary[value], ',');
                    infoList.push({
                        text: this.$t("GENERAL.SCHEDULE_PERIOD"),
                        value: weekString.substring(0, weekString.length - 1),
                    });
                }
            }
            this.infoLength = infoList.length
            return infoList;
        },
        getCommandInfo(info, index){
            let infoList = [];

            //update data from GetScheduleList()
            this.scheduleList2 = this.scheduleList
            if(typeof(info.cmd)=="string" || typeof(info.cav)=="string" || !info.module_name){
                info.module_name = this.scheduleList2[index].module_name
                info.cav = this.scheduleList2[index].cav
                info.cmd = this.scheduleList2[index].cmd
            }
            
            for(let ctl_type of Object.keys(info.cmd)){
                let cmd_val = info.cav[ctl_type].split('_')[2];
                let ctl_info = Ctl_List_Obj[info.module_name][ctl_type];
                if(ctl_info.range === '1')
                    cmd_val = ctl_info.value_list.find(item => item.value === cmd_val).name;
                infoList.push({
                    "text": ctl_info.description,
                    "value": cmd_val,
                });
            }
            this.infoLength = infoList.length
            return infoList;
        },
        getContextCtrlDevLength(scene_id){
            if(this.Context_List_Obj[scene_id].control_device_list && 
                this.Context_List_Obj[scene_id].control_device_list.length>0)
                    return true
            return false
        },
        getContextDev(scene_id){
            this.infoLength = this.Context_List_Obj[scene_id].control_device_list.length
            let deviceList = [];
            for(let dev of this.Context_List_Obj[scene_id].control_device_list){
                deviceList.push(this.$store.state.deviceName[dev.dev_id]||dev.dev_id);
            }
            return deviceList;
        },
        getContextName(scene_id){
            // console.log(Context_List_Obj[scene_id])
            // if(!Context_List_Obj[scene_id]) return this.scheduleDelete(index);
            return this.Context_List_Obj[scene_id].scene_name
        },
        //判斷是否展開
        showScheduleInfo(value){
            //確保re-render時已經獲得最新資料來show
            this.scheduleList2 = this.scheduleList
            if(this.currentScheduleIndex === value){ 
                this.currentScheduleIndex = null;    
                this.flag = -1        //以flag的數值判斷要移動的位置
            }     
            else{
                this.currentScheduleIndex = value;
                this.currentCommandIndex = null
                this.flag = value
            }
        },
        showCommandInfo(value){
            this.scheduleList2 = this.scheduleList
            if(this.currentCommandIndex === value){
                this.currentCommandIndex = null;
                this.flag = -1
            }
            else{
                this.currentCommandIndex = value;
                this.currentScheduleIndex = null
                this.flag = value
            }
        },
    },
    computed:{
        stylerwd: function(){
            return function(w='100',h='100',k='0',t='0'){
                let tmp = ""
                if(this.flag>-1 && t>this.flag ){         //位置依照下拉式列表的長度移動位置
                    tmp = "width: "+w+"%;height:"+(h)+"%;left:"+k+"%;top:"+(20*t+this.infoLength*5.7)+"%;"; 
                }
                else{                        //位置不動
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+(20*t)+"%;";
                }
                return tmp 
            }
        },
        Context_List_Obj(){
            let contextObj = {}
            for(let card of this.$store.state.solutionData.context.card){
                for(let context of card.device){
                    contextObj[context.scene_id] = {
                        'control_device_list': context.control_list,
                        'scene_name': context.scene_name
                    };
                }
            }
            return contextObj;
        }
    }
}
</script>

<style scoped>

.dropdown-enter-to, .dropdown-leave {
    max-height: 30vw ;
}
</style>