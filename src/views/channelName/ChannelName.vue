<template>
    <config-type-setting>
        <template v-slot:button>
            <header-button @click.native="load"> {{ $t("GENERAL.APPLY") }} </header-button>
        </template>
        <template v-slot:content>
            <div class="main" :style='stylerSize()'>
                <div class="slaveM" :style='stylerSize(100,20,0,0)'>
                    <span class="slaveL _40 title_item" :style='stylerSize(20,30,15,3)'> {{ $t("GENERAL.SOLUTION_SELECT") }} </span>
                    <select class="slaveL _32 hmi_setting_content_select" :style='stylerSize(20,30,15,40)' v-model="curSolution" @change="keyChange()">
                        <option class="" v-for="(solution) in Object.keys(deviceList)" :key="solution" v-bind:value="solution">{{ getSolutionName(solution) }}</option>
                    </select>
                    <span class="slaveL _40 title_item" :style='stylerSize(20,30,50,3)'> {{ $t("GENERAL.MAIN_DEVICE_NAME") }} </span>
                    
                    <select class="slaveL _32 hmi_setting_content_select" :style='stylerSize(40,30,50,40)' v-model="curMainDev" >
                        <option class="" v-for="(dev, index) in Object.keys(deviceList[curSolution])" :key="index" 
                            v-bind:value=" dev || deviceList[curSolution][dev][0].id">{{ getDeviceName(dev) }}
                        </option>
                    </select>
                </div>

                <hr class="slaveM statistics_hr" :style='stylerSize(100,0.3,0,18)'>
                <div class="slaveM white_view" :style='stylerSize(100,10,0,23)'>
                    <div class="slaveC _40" :style='stylerSize(25,80,1,0)'> {{ $t("GENERAL.CHILD_DEVICE_NAME") }} </div>
                    <div class="slaveC _40" :style='stylerSize(35,80,26.5,0)'> {{ $t("GENERAL.CHILD_DEVICE_ID") }} </div>
                    <div class="slaveC _40" :style='stylerSize(20,80,67.5,0)'> {{ $t("GENERAL.CHANNELNAME_SETTING") }} </div>
                </div>
                <div class="slaveM overFlowY white_view" :style='stylerSize(100,65,0,35)'>
                    <div class="slaveM _36" v-for="(dev, dev_index) in deviceList[curSolution][curMainDev]"
                        :key="dev_index" :style='stylerSize(100,15,0,dev_index*20)'>
                        <div class="slaveC textOverflow" :style='stylerSize(25,75,1,0)'> {{ dev.name || dev.id }} </div>
                        <div class="slaveC textOverflow" :style='stylerSize(35,75,26.5,0)'> {{ dev.id }} </div>
                        <input id="inputName"  class="slaveL" :style='stylerSize(30,75,63,0)' type="text" maxlength="23" :value="dev.name||dev.id"
                            @input="addConfig($event ,dev.id)" :placeholder=" dev.name || dev.id ">
                    </div>
                </div>    
                
            </div>
        </template>
    </config-type-setting>
</template>

<script>
import ConfigTypeSetting from "layout/configTypeSetting/ConfigTypeSetting"
import HeaderButton from "components/content/headerButton/HeaderButton"

import { DeviceName } from "common/constant/profile"
import { setNameData, deleteConfigName } from "network/setConfig"
import { solution_to_name } from "common/constant/solution"

export default{
    components: {
        ConfigTypeSetting,
        HeaderButton,
    },
    data(){
        return{
            curSolution: "",
            curMainDev: "",
            deviceList: {},
            configName: [],
            configSol: [],
            holder: "",
        }
    },
    created(){
        /*init deviceList*/
        let data = this.$store.state.solutionData
        let solutions = Object.keys(data) //key === solutions
        let all_sub_dev = this.$store.state.allSubDev
        
        for(let sol of solutions){
            if(sol=='context') continue;
            for(let card of data[sol].card){
                if(card.device.length==0) continue; //no device
                if(!this.deviceList[sol]) this.$set(this.deviceList, sol, {}) //initialize
                for(let dev of card.device){ 
                    let devid = dev.deviceId
                    
                    //只有子設備的設備
                    if(devid.includes('|')){
                        let main_id = devid.split('|')[0]
                        if(this.deviceList[sol][main_id] !== undefined) break;
                        this.$set(this.deviceList[sol], main_id, [])
                        this.deviceList[sol][main_id].push({
                            'id'   : main_id,
                            'name' : DeviceName[main_id] == '' ?  main_id : DeviceName[main_id]
                        })
                        //所有子設備已經預先存在store裏
                        for(let subdev of all_sub_dev[main_id]){
                            this.deviceList[sol][main_id].push({
                                'id'   : subdev,
                                'name' : DeviceName[subdev] == '' ?  subdev : DeviceName[subdev]
                            })
                        }
                        break;
                    }

                    this.$set(this.deviceList[sol], devid, [])
                    
                    //沒有子設備的主設備/充電樁的
                    this.deviceList[sol][devid].splice(0, 0, {
                        'id'   : devid,
                        'name' : dev.deviceName || devid
                    })

                    //charging
                    let sub = dev.cntIdList
                    if( sub ){
                        for(let i in sub){
                            let pile = devid + '|' + sub[i].padStart(2, '0')
                            this.deviceList[sol][devid].push ({
                                'id'   : pile,
                                'name' : DeviceName[pile] == '' ? pile : DeviceName[pile]
                            })
                        }
                    }
                }  
            }
        }
        
        if(Object.keys(this.deviceList).length > 0){
            this.curSolution = Object.keys(this.deviceList)[0];
            this.curMainDev = Object.keys(this.deviceList[this.curSolution])[0];
        }
    },
    methods: {
        getDeviceName(dev){ 
            return DeviceName[dev] || dev
        },
        getSolutionName(sol){
            return this.$t("GENERAL."+solution_to_name[sol])
        },
        keyChange(){
            this.curMainDev = Object.keys(this.deviceList[this.curSolution])[0]
        },
        addConfig(event, dev_id){
            console.log(event.target.value)
            let value = event.target.value;

            let flag = true;
            for(let i of this.configName){
                if(i.devid ==  dev_id){
                    flag   = false
                    i.name = value
                    break
                }
            }
            if(flag){
                this.configName.push({'devid':dev_id , 'name':value})
                this.configSol.push([this.curSolution, this.curMainDev])
            }
        },
        updateDeviceList( solution, target_main_dev_id, target_dev_id, new_name){
            console.log( solution, target_main_dev_id, target_dev_id, new_name)
            for(let dev of this.deviceList[solution][target_main_dev_id]){
                if(dev.id==target_dev_id)
                    this.$set( dev, 'name', new_name)
            }
            this.$forceUpdate()
            console.log("DEVICE_LIST NOW: ", this.deviceList[solution][target_main_dev_id])
        },
        async load(){
            this.$store.commit("setLoadingProgress");
            this.$store.state.totalLoading = 3;

            //解析有哪些要刪除，那些要修改or新增
            let del_list = [] // [id, id, ...]
            let add_list = {} // {id:name, id:name, ...}
            let del_update_list = []
            let add_update_list = []
            console.log("🥮🥮🥮🥮🥮🥮🥮🥮🥮🥮")
            console.log(this.configName)
            for(let i in this.configName){
                if(this.configName[i].name == ""){
                    del_list.push(this.configName[i].devid)
                    del_update_list.push(this.configSol[i])
                }else{
                    add_list[this.configName[i].devid] = this.configName[i].name
                    add_update_list.push(this.configSol[i])
                }
            }
            this.$store.state.completeLoading += 1;

            if(del_list.length != 0){
                let res = await deleteConfigName(del_list);
                if(res.status == 'ok'){
                    let i = 0;
                    for(let dev_id of del_list){
                        delete DeviceName[dev_id];
                        await this.updateDeviceList(del_update_list[i][0], del_update_list[i][1], dev_id, '')
                        i += 1;
                    }
                }
            }
            this.$store.state.completeLoading += 1;
            
            if(Object.keys(add_list).length != 0){
                console.log()
                let res = await setNameData(add_list);
                if(res.status == 'ok'){
                    let i = 0;
                    for(let dev_id of Object.keys(add_list)){
                        DeviceName[dev_id] = add_list[dev_id];
                        await this.updateDeviceList(add_update_list[i][0], add_update_list[i][1], dev_id, add_list[dev_id])
                        i += 1;
                    }
                }
            }
            this.$store.state.completeLoading += 1;
            setTimeout(() => {
                this.configName = [];
                this.configSol = [];
                this.$store.commit("setLoadingProgress");
            }, 1500);

        }
    }
}
</script>