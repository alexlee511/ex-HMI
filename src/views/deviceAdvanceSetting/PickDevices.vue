<template>
    <config-type-setting>
        <template v-slot:button>
            <header-button @click.native="load"> {{ $t("GENERAL.APPLY") }} </header-button>
        </template>

        <template v-slot:content>
            <div class="slaveM" :style='stylerSize(100,25,0,1)'>
                <div class="slaveC _60 title_item" :style='stylerSize(100,30,0,0)'>{{ $t('GENERAL.DEVICE_SELECT') }}</div>
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
                    v-if="selected_show == true"
                    :scroll-sensitivity="80"
                    :force-fallback="true"
                >
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
        </template>
    </config-type-setting>
</template>

<script>
import ConfigTypeSetting from "layout/configTypeSetting/ConfigTypeSetting"
import HeaderButton from "components/content/headerButton/HeaderButton"
import draggable from "vuedraggable";
import { getModuleDeviceList, setCurrentModule, setSettingConfig, SettingConfig } from "./data"
import { updateDeviceAdvance } from "network/module"

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
            totalList: [],
            selectList: [],
            showList: [],
            searchList: [],
            selected_show: false,
            search_text: "",
        };
    },
    created() {
        console.log("-----------------PICK DEVICE---------------------")
        console.log(SettingConfig)
        let devlist = getModuleDeviceList();
        for(let dev_id of devlist) {
            this.totalList.push({
                check: false,
                device_id : dev_id,
                device_name: this.nameList[dev_id] 
            })
        }
        this.watchALL();
    },
    methods: {
        //套用
        load(){
            if(this.selectList.length == 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_023")
				});
                return
            }
            else{
                //save setting
                for(let item of this.selectList){
                    updateDeviceAdvance(item.device_id, SettingConfig)
                    console.log("update2")
                }
    console.log("update3")
                //clear data
                setSettingConfig([]);
                setCurrentModule("");
                // //取得所有裝置資訊
                // updateProfile(undefined, undefined, this.getBackLang);
                // //重啟系統
                // restart();
            }
            this.$router.back()
            this.$router.back()
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
            console.log("watchSelected")
            this.updateSelectList()
            this.showList = JSON.parse(JSON.stringify(this.selectList))
            this.selected_show = true

        },
        //查看全部清單
        watchALL(){
            this.selected_show = false
            this.showList = JSON.parse(JSON.stringify(this.totalList))
        },

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
                    if(i.hasOwnProperty("device_name")){
                        let match = i.device_name.match(this.search_text)
                        if(match != null){
                            let index = this.totalList.findIndex(e => e.device_name == match.input)
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
        nameList(){
            return this.$store.state.deviceName;
        }
    },
    watch: {
        showList:function(){
            if(this.selected_show == true){
                this.selectList = JSON.parse(JSON.stringify(this.showList))
            }
            this.checkAllChoose()
        }
    },
};
</script>