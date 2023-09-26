<template>
    <config-type-setting>
        <template v-slot:button>
            <header-button @click.native="load"> {{ $t("GENERAL.APPLY") }} </header-button>
        </template>
        <template v-slot:content>
            <div class="main background_01" :style='stylerSize(90,93,5,5)'>
            
                <div class="slaveL _36 font" :style='stylerSize(25,10,5,0)'> {{ $t("GENERAL.MODULE_SELECT")}} </div>
                <select class="slaveC selectMain _36" :style='stylerSize(40,8,5,5)' v-model="curModule" @change="keyChange()"
                    :no-data-text="$t('GENERAL.NO_DATA')" :placeholder="$t('GENERAL.CHOOSE')">
                    <option class="selectItem _36" v-for="(module, module_index) in Object.keys(deviceList)" :key="module_index"
                        :value="module" >{{module}}</option>
                </select>
                
                <div class="slaveM background_01 overFlowY" :style='stylerSize(35,75,5,20)'>
                    <div 
                        class="slaveM _36" 
                        v-for="(dev, dev_index) in Object.keys(deviceList[curModule])" 
                        :key="dev_index" 
                        :style='stylerSize(100,15,0,dev_index*15)'
                    >
                        <span class="slaveC" :style='stylerSize(100,80,0,20)' @click="checkClick(dev)" v-if="dev.check">☑ {{ dev }}</span>
                        <span class="slaveC" :style='stylerSize(100,80,0,20)' @click="checkClick(dev)" v-else>☐ {{ dev }}</span>
                        
                    </div>
                </div>
                <div class="slaveM background_01" :style='stylerSize(50,75,45,20)'>

                </div>
            </div>
        </template>
    </config-type-setting>
</template>

<script>
import ConfigTypeSetting from "layout/configTypeSetting/ConfigTypeSetting"
import HeaderButton from "components/content/headerButton/HeaderButton"
import { Dev_List_Obj, DeviceName } from "common/constant/profile"
import { typeToModule } from "common/constant/type"
import { getModuleAdvance } from "network/module"
import { deleteConfigName } from "network/setConfig"

export default{
    components: {
        ConfigTypeSetting,
        HeaderButton
    },
    data(){
        return{
            curModule: "",
            curMainDev: "",
            deviceList: {},
            configName: [],
            deleteConfig: [],
        }
    },
    async created(){
        console.log(this.$store.state.backData.lang)
        let res = await getModuleAdvance(this.$store.state.backData.lang)
        console.log(res)
        let response = {};
        if (res.status == 'ok') {
            for (let modeule of res.module_list) {
                let deviceList = {};
                for (let device of modeule.device_list) {
                    if (device.set_value.length > 0) {
                        deviceList[device.dev_id] = {};
                        for (let setting of device.set_value) {
                            deviceList[device.dev_id][setting.key] = setting.value;
                        }
                    }
                }
                response[modeule.module_name] = { adv_list: modeule.adv_list, device_list: deviceList };
            }
            //context.commit('updateModuleAdvanceList', response);
        }
        console.log(response)
        for(const module of Object.keys(Dev_List_Obj)){
            let moduleDevice = {};
            //console.log(Dev_List_Obj[module])
            for(const main_dev of Dev_List_Obj[module]){
                moduleDevice[main_dev.dev_id] = {check: false}
                /*if(main_dev.sub_list && main_dev.sub_list.length > 0){
                    moduleDevice[main_dev.dev_id] = moduleDevice[main_dev.dev_id].concat( Object.entries(main_dev.sub_list).map(sub_dev => {
                        //console.log(sub_dev)
                        return{
                            channel: sub_dev[0],
                            sub_id: sub_dev[1].sub_id,
                        }
                    }))
                }*/
            }
            //console.log(moduleDevice)
            this.deviceList[module] = moduleDevice;
            //console.log(this.deviceList)
        }

        if(Object.keys(this.deviceList).length > 0){
            this.curModule = Object.keys(this.deviceList)[0];
            this.curMainDev = Object.keys(this.deviceList[this.curModule])[0];
        }
        console.log(this.deviceList)
    },
    computed: {

        moduleList(){
            let moduleList = [];
            if(Object.keys(this.deviceList).length > 0)
                moduleList = Object.keys(this.deviceList);
            return moduleList;
        },
        mainDeviceList(){
            let deviceList = [];
            if(this.curModule.length > 0 && Object.keys(this.deviceList[this.curModule]).length > 0){
                deviceList = Object.keys(this.deviceList[this.curModule]).map(dev_id => {
                    return{
                        dev_id: dev_id,
                        name: DeviceName[dev_id] || dev_id,
                    }
                });
                this.curMainDev = deviceList[0].name + '(' + deviceList[0].dev_id + ')';
            }
            //console.log(deviceList)
            return deviceList;
        },
        subDeviceList(){
            let deviceList = [];
            let regex = /\((.+?)\)/g
            let options = this.curMainDev.match(regex)
            let mainDev = options[0].substring(1, options[0].length - 1)
            //console.log(options[0])
            if(this.curMainDev.length > 0 && this.deviceList[this.curModule][mainDev].length > 0)
                deviceList = this.deviceList[this.curModule][mainDev];
            return deviceList;
        },
    },
    methods: {
        /*translation(value){
            const result = Object.entries(typeToModule).find(module => module[1] === value);
            if(result) return result[0];
            else return value;
        },*/
        changeModuleName(value){
            return typeToModule[value] || value;
        },
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
            ////console.log(del_list)
            ////console.log(add_list)
            ////console.log("✌✌✌✌✌✌✌✌✌✌✌✌✌✌")
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