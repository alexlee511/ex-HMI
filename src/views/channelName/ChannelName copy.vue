<template>
    <config-type-setting>
        <template v-slot:button>
            <header-button @click.native="load"> {{ $t("GENERAL.APPLY") }} </header-button>
        </template>
        <template v-slot:content>
            <div class="main" :style='stylerSize()'>
                <div class="slaveM" :style='stylerSize(100,20,0,0)'>
                    <span class="slaveL _40 title_item" :style='stylerSize(20,30,15,3)'> {{ $t("GENERAL.MODULE_SELECT") }} </span>
                    <select class="slaveL _32 hmi_setting_content_select" :style='stylerSize(20,30,15,40)' v-model="curModule" @change="keyChange()">
                        <option class="" v-for="(value, name) in Object.keys(deviceList)" :key="value">{{ value }}</option>
                    </select>
                    <span class="slaveL _40 title_item" :style='stylerSize(20,30,50,3)'> {{ $t("GENERAL.MAIN_DEVICE_NAME") }} </span>
                    
                    <select class="slaveL _32 hmi_setting_content_select" :style='stylerSize(40,30,50,40)' v-model="curMainDev" >
                        <option class="" v-for="(dev, dev_index) in Object.keys(deviceList[curModule])" :key="dev" :value="dev" >{{ deviceList[curModule][dev][0].name + '(' + deviceList[curModule][dev][0].sub_id + ')' }}</option>
                    </select>
                </div>

                <hr class="slaveM statistics_hr" :style='stylerSize(100,0.3,0,18)'>
                <div class="slaveM white_view" :style='stylerSize(100,10,0,23)'>
                    <div class="slaveC _40" :style='stylerSize(15,80,8,0)'> {{ $t("GENERAL.CHANNEL_INDEX") }} </div>
                    <div class="slaveC _40" :style='stylerSize(15,80,34.5,0)'> {{ $t("GENERAL.CHILD_DEVICE_ID") }} </div>
                    <div class="slaveC _40" :style='stylerSize(20,80,67.5,0)'> {{ $t("GENERAL.CHILD_DEVICE_NAME") }} </div>
                </div>
                <div class="slaveM overFlowY white_view" :style='stylerSize(100,65,0,35)'>
                    <div class="slaveM _36" v-for="(sub_dev, sub_dev_index) in deviceList[curModule][curMainDev]" :key="sub_dev_index" :style='stylerSize(100,15,0,sub_dev_index*20)'>
                        <div class="slaveC" :style='stylerSize(7,75,12,0)'> {{ sub_dev.channel }} </div>
                        <div class="slaveC" :style='stylerSize(35,75,25,0)'> {{ sub_dev.sub_id }} </div>
                        <input class="slaveL hmi_setting_content_input" :style='stylerSize(30,75,63,0)' type="text"  maxlength="15"
                            @input="addConfig" :value="subDeviceName(sub_dev.sub_id)">
                    </div>
                </div>    
                
            </div>
        </template>
    </config-type-setting>
</template>

<script>
import ConfigTypeSetting from "layout/configTypeSetting/ConfigTypeSetting"
import HeaderButton from "components/content/headerButton/HeaderButton"
import deviceCardMixin from "common/mixin/deviceCardMixin"

import { Dev_List_Obj, DeviceName } from "common/constant/profile"
import { setNameData, deleteConfigName } from "network/setConfig"

export default{
    components: {
        ConfigTypeSetting,
        HeaderButton,
        deviceCardMixin
    },
    data(){
        return{
            curModule: "",
            curMainDev: "",
            deviceList: {},
            configName: [],
        }
    },
    created(){
        /*init deviceList*/
        // for(let card in this.$store.state.card){
        //     let devObj = {}
        //     for( let dev of card){
        //         devObj[dev.id] = 
        //     }
        // }
        for(const module of Object.keys(Dev_List_Obj)){
            let moduleDevice = {};
            console.log("🎇🎇🎇devListObj🎇🎇🎇")
            console.log(JSON.stringify(Dev_List_Obj,null,4))
            for(const main_dev of Dev_List_Obj[module]){
                moduleDevice[main_dev.dev_id] = [{channel: "N" , sub_id:main_dev.dev_id , name: DeviceName[main_dev.dev_id] || main_dev.dev_id}]
                if(main_dev.sub_list && main_dev.sub_list.length > 0){
                    moduleDevice[main_dev.dev_id] = moduleDevice[main_dev.dev_id].concat( Object.entries(main_dev.sub_list).map(sub_dev => {
                        console.log(sub_dev)
                        return{
                            channel: sub_dev[0],
                            sub_id: sub_dev[1].sub_id,
                            name: DeviceName[sub_dev[1].sub_id] || sub_dev[1].sub_id 
                        }
                    }))
                }
            }
            this.deviceList[module] = moduleDevice;
        }
        if(Object.keys(this.deviceList).length > 0){    
            this.curModule = Object.keys(this.deviceList)[0];
            this.curMainDev = Object.keys(this.deviceList[this.curModule])[0];
        }
    },
    computed: {
    },
    methods: {
        keyChange(){
            this.curMainDev = Object.keys(this.deviceList[this.curModule])[0];
        },
        subDeviceName(value){
            for(let i of this.configName){
                if(i.devid ==  value){
                    return i.name
                }
            }
            return DeviceName[value];
        },
        addConfig(event){
            ////console.log(event)
            let value = event.target.value;
            let dev_id = event.path[1].innerText.split('\n')[1];
            let flag = true;
            for(let i of this.configName){
                ////console.log(i)
                if(i.devid ==  dev_id){
                    flag   = false
                    i.name = value
                    break
                }
            }
            if(flag){
                this.configName.push({'devid':dev_id , 'name':value})
            }
            for(let i of this.deviceList[this.curModule][this.curMainDev]){
                console.log("🎆🎆🎆🎆🎆deviceList🎆🎆🎆🎆🎆🎆")
                console.log(JSON.stringify(this.deviceList,null,4))
                if(i.sub_id ==  dev_id){
                    i.name = value
                    break
                }
            }
            this.$forceUpdate();
        },
        async load(){
            // add {id:name,id:name}
            // del [id,id,id,id]
            this.$store.commit("setLoadingProgress");
            this.$store.state.totalLoading = 3;

            console.log("🎈🎈🎈🎈🎈🎈🎈🎈🎈🎈")
            console.log(JSON.stringify(this.configName,null,4))

            //解析有哪些要刪除，那些要修改or新增
            let del_list = []
            let add_list = {}
            
            for(let i of this.configName){
                if(i.name == ""){
                    del_list.push(i.devid)
                }else{
                    add_list[i.devid] = i.name
                }
            }
            this.$store.state.completeLoading += 1;
            console.log(del_list)
            console.log(add_list)
            console.log("✌✌✌✌✌✌✌✌✌✌✌✌✌✌")
            if(del_list.length != 0){
                let res = await deleteConfigName(del_list);
                //console.log(res);
                if(res.status == 'ok'){
                    for(let  dev_id of del_list){
                        delete DeviceName[dev_id];
                    }
                }
            }
            this.$store.state.completeLoading += 1;
            
            if(Object.keys(add_list).length != 0){
                let res = await setNameData(add_list);
                //console.log(res);
                if(res.status == 'ok'){
                    for(let  dev_id of Object.keys(add_list)){
                        DeviceName[dev_id] = add_list[dev_id];
                    }
                }
            }
            this.$store.state.completeLoading += 1;
            setTimeout(() => {
                this.configName = [];
                this.$store.commit("setLoadingProgress");
            }, 1500);
        }
    }
}
</script>

<style scoped>

</style>