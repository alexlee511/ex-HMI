<template>
    <div class="main" :style='stylerSize()'>
        <div class="slaveM" :style='stylerSize(100,25,0,1)'>
            <div class="slaveC _60 title_item" :style='stylerSize(100,30,0,0)'>{{ $t('GENERAL.ENABLE_CONTROL_DEVICE') }}</div>
            <!--header-button class="slaveC" :style='stylerSize(0,0,63.5,0)' @click.native="sortall">{{$t('GENERAL.SORT')}}</header-button-->
            <div class="slaveL _36" :style='stylerSize(30,35,13,68)'>
                <i class="el-icon-search"></i>
                <div class="slaveL _36 user_account" :style='stylerSize(85,90,13,0)' :class="selected_show == true && 'click_none'">
                    <input :style='stylerSize(100,100,0,0)' type="text" class="" :placeholder="search_hint" v-model="search_text" @input="search"/>
                </div>
            </div>
            <button class="slaveC _36 hmi_setting_content_button" :style='stylerSize(15,34,55,68)' v-if="selected_show" @click="watchALL">{{ $t("GENERAL.CHECK_ALL_LIST") }}</button>
            <button class="slaveC _36 hmi_setting_content_button" :style='stylerSize(15,34,55,68)' v-else @click="watchSelected">{{ $t("GENERAL.CHECK_SELECTED_LIST") }}</button>
            <header-button class="slaveC" :style='stylerSize(0,0,72,68)' @click.native="All">{{ $t(allfont) }}</header-button>
        </div>
        <div class="slaveM" :style='stylerSize(100,70,0,30)'>
            <draggable
                v-model="showList"
                :disabled="!enabled"
                class="slaveC draggableMain_V2"
                :style='stylerSize(75,100,13.5,0)'
                ghost-class="ghost"
                @start="dragging = true"
                @end="dragging = false"
                v-if="selected_show == true"
                :scroll-sensitivity="80"
                :force-fallback="true"
            ><!--@change="handleDragList"-->
                <div
                    class="slaveC _32 "
                    v-for="(item, index) in showList"
                    :key="index"
                    :style='stylerSize(90,20,3,1+index*25)'
                >
                    <div class="slaveC draggablebutton" :style='stylerSize(100,75,0,0)'  v-if="update">
                        <span   class="slaveC" :style='stylerSize(100,80,0,20)' @click="checkClick(item)" v-if="item.check">☑ {{nameList[item.device_id] || item.device_id }}</span>
                        <span   class="slaveC" :style='stylerSize(100,80,0,20)' @click="checkClick(item)" v-else>☐ {{nameList[item.device_id] || item.device_id }}</span>
                    </div>
                </div>
            </draggable>
            <draggable
                v-else
                v-model="showList"
                :disabled="true"
                class="slaveC draggableMain_V2"
                :style='stylerSize(75,100,13.5,0)'
                ghost-class="ghost"
                @start="dragging = true"
                @end="dragging = false"
                :scroll-sensitivity="80"
                :force-fallback="true"

            ><!--@change="handleDragList"-->
                <div
                    class="slaveC _32 draggablebutton_V3"
                    v-for="(item, index) in showList"
                    :key="index"
                    :style='stylerSize(90,20,3,1+index*25)'
                    
                >
                    <div class="slaveC " :style='stylerSize(100,75,0,0)'  v-if="update">
                        <span   class="slaveC" :style='stylerSize(100,80,0,20)' @click="checkClick(item)" v-if="item.check">☑ {{nameList[item.device_id] || item.device_id }}</span>
                        <span   class="slaveC" :style='stylerSize(100,80,0,20)' @click="checkClick(item)" v-else>☐ {{nameList[item.device_id] || item.device_id }}</span>
                    </div>
                </div>
            </draggable>
        </div>
    </div>
</template>

<script>
import ConfigTypeSetting from "layout/configTypeSetting/ConfigTypeSetting";
import HeaderButton from "components/content/headerButton/HeaderButton";
import draggable from "vuedraggable";
import { true_config , Setsetting , Addsetting , cur_obj , resetTempType} from "../ston/data.js";

export default {
    components: {
        ConfigTypeSetting,
        HeaderButton,
        draggable,
    },
    data() {
        return {
            update: true,
            enabled: true,
            dragging: false,
            allfont:'GENERAL.CHOOSE_ALL',
            choose :'GENERAL.CHOOSE_ALL',
            cancel :'GENERAL.CANCEL_ALL',
            search_hint: this.$t('GENERAL.SEARCH_MATCH_NAME'),
            //從data.js接收前一頁的設定
            orderId: cur_obj["orderId"],
            attrId: cur_obj["attrId"],
            writeCmd: cur_obj["writeCmd"],
            type: cur_obj["type"],
            description: cur_obj["description"],
            model: cur_obj["model"],
            model_name: cur_obj["model_name"],
            isChange: cur_obj["isChange"],
            nameList: {},
            totalList: [],
            selectList: [],
            showList: [],
            searchList: [],
            selected_show: false,
            search_text: "",
        };
    },
    created() {
        // console.log(this.$store.state.deviceCommand.deviceControlList)
        // console.log(this.attrId, this.writeCmd, this.model,this.model_name)
        this.nameList = this.$store.state.deviceName
        //將與前一頁設定對應的設備整理出來
        for(let i of Object.keys(this.$store.state.deviceCommand.deviceControlList)){
            if(i.substr(2, 2) == this.type){
                for(let j of Object.keys(this.$store.state.deviceCommand.deviceControlList[i])){
                    if(this.$store.state.deviceCommand.deviceControlList[i][j].attrId == this.attrId && this.$store.state.deviceCommand.deviceControlList[i][j].writeCmd == this.writeCmd){
                        if(this.nameList[i] != undefined){
                            this.totalList.push({"device_id": i, "check": false, "deviceName": this.nameList[i], "channel": this.$store.state.deviceCommand.deviceControlList[i][j].channel})
                        }
                        else{ 
                            this.totalList.push({"device_id": i, "check": false, "channel": this.$store.state.deviceCommand.deviceControlList[i][j].channel})
                        }
                    }
                }
            }
        }
        //若為編輯狀態，則確認有無之前所設定的設備
        if(this.isChange == true){
            for(let i of true_config[this.orderId].device_list){
                let index = this.totalList.findIndex(e => e.device_id == i.device_id)
                if(index != -1){
                    this.totalList[index].check = true
                }
            }
            this.updateSelectList()
        }

        this.showList = JSON.parse(JSON.stringify(this.totalList))
        console.log(this.totalList)
        console.log(this.description)
    },
    mounted() {
        console.log(this.selectList)
        this.$bus.$on("configLoad", () => {
            if(this.selectList.length == 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_023")
				});
                return
            }
            else{
                let item = {
                    type: this.type,
                    attrId: this.attrId,
                    cmd: this.writeCmd,
                    description: this.description,
                    device_list: this.selectList,
                    device_count: this.selectList.length,
                    model: this.model,
                    model_name: this.model_name,
                    isMotify: true,
                }

                if(this.isChange == true) {
                    Setsetting(this.orderId, item)
                }
                else{
                    Addsetting(item);
                }
            }

            console.log(true_config)
            //console.log(typeof(this.isChange))
            //let path = this.$route.path.replace(/configView/i, "ConfigView")
            /*this.$router.push({
                path: "/configView/context/quickSetting",
            });*/
            resetTempType()
            this.$router.back()
            this.$router.back()
        })
    },
    beforeDestroy(){
        this.$bus.$off("configLoad")
    },
    methods: {
        translation(value) {
            return this.$t(`${value}`)
        },
        //更新已選清單
        updateSelectList(){
            let temp_list = JSON.parse(JSON.stringify(this.selectList))
            this.selectList = []
            for(let i of this.totalList){
                if(i.check == true){
                    this.selectList.push(i)
                }
            }
            if(this.selectList.length != 0){
                console.log(temp_list)
                if(temp_list.length != 0){
                    for(let i of this.selectList){
                        let index = temp_list.findIndex(e => e.device_id == i.device_id)
                        if(index != -1){
                            continue
                        }
                        else{
                            temp_list.push(i)
                            
                        }
                    }
                    for(let i of temp_list){
                        let index = this.selectList.findIndex(e => e.device_id == i.device_id)
                        if(index != -1){
                            continue
                        }
                        else{
                            let del_index = temp_list.indexOf(i)
                            temp_list.splice(del_index, 1)
                        }
                    }
                    this.selectList = JSON.parse(JSON.stringify(temp_list))
                } 
            }
            temp_list = []
        },
        //選擇(打勾或無)
        checkClick(item) {  
            item.check = !item.check;
            let index = this.totalList.findIndex(e => e.device_id == item.device_id)
            this.totalList[index] = JSON.parse(JSON.stringify(item))
            this.checkAllChoose()
            this.updateSelectList()
            //console.log(this.showList)
            //console.log(this.totalList)
        },
        //查看已選清單
        watchSelected(){
            this.updateSelectList()
            this.showList = JSON.parse(JSON.stringify(this.selectList))
            this.selected_show = true

        },
        //查看全部清單
        watchALL(){
            console.log(this.totalList)
            this.selected_show = false
            this.showList = JSON.parse(JSON.stringify(this.totalList))
        },

        /*sortall() {
            if(this.sortFlag == 1){
                this.displayList = this.displayList.sort(function (a, b) {
                    return a.deviceName.localeCompare(b.deviceName, "zh-hant");
                });
            }else{
                this.displayList = this.displayList.sort(function (a, b) {
                    return b.deviceName.localeCompare(a.deviceName, "zh-hant");
                });
            }
            
            this.sortFlag *= -1;
            this.$forceUpdate()
            //this.handleDragList()
        },*/

        //全選(以所顯示的List為範圍)
        All() {
            if(this.allfont == this.choose){
                for(let item of this.showList) {
                    item.check = true;
                }
                this.allfont = this.cancel ;
            }else{
                for(let item of this.showList) {
                    item.check = false;
                }
                this.allfont = this.choose ;
            }
            for(let i of this.showList) {
                if(i.check == true) {
                    let index = this.totalList.findIndex(e => e.device_id == i.device_id)
                    this.totalList[index].check = true
                }
                else{
                    let index = this.totalList.findIndex(e => e.device_id == i.device_id)
                    this.totalList[index].check = false
                }
            }
            console.log(this.totalList)
            this.updateSelectList()
        },
        //搜尋匹配條件的設備
        search(){
            this.searchList = []
            if(this.search_text.length == 0){
                this.showList = JSON.parse(JSON.stringify(this.totalList))
            }
            else{
                for(let i of this.showList){
                    if(i.hasOwnProperty("deviceName")){
                        let match = i.deviceName.match(this.search_text)
                        if(match != null){
                            let index = this.totalList.findIndex(e => e.deviceName == match.input)
                            this.searchList.push(this.totalList[index])
                        }
                        console.log(match)
                    }
                    else{
                        let match = i.device_id.match(this.search_text)
                        if(match != null){
                            let index = this.totalList.findIndex(e => e.device_id == match.input)
                            this.searchList.push(this.totalList[index])
                        }
                        console.log(match)
                    }
                }
                this.showList = JSON.parse(JSON.stringify(this.searchList))
            }
            
        },
        //檢查是否全部設備已選取
        checkAllChoose(){
            let check = 0
            for(let i of this.showList){
                if(i.check == false){
                    check += 1
                }
            }
            if(check == 0){
                this.allfont = this.cancel;
            }
            else{
                this.allfont = this.choose
            }
        }
    },
    computed: {

    },
    watch: {
        showList:function(){
            console.log(this.showList)
            if(this.selected_show == true){
                this.selectList = JSON.parse(JSON.stringify(this.showList))
            }

            this.checkAllChoose()
        }
    },
};
</script>

