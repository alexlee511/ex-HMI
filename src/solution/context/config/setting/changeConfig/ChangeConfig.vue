<template>
    <div v-if="currentSolution" class="main" :style='stylerSize()'>

        <!--ADVANCED SETTING-->
        <div class="slaveM" :style='stylerSize(45,50,50.5,30)' style="overflow: hidden;">
            <transition name="slide" >
                <div v-if="adv_flag" class="slaveM list-group-item _28" :style='stylerSize(100,100,0,0)' >

                    <div class="slaveM" :style="stylerSize(22,10,3,13)">{{ $t('GENERAL.HINT_MESSAGE') }} : </div>
                    <input class="slaveM input-box" :style="stylerSize(45,10,27,13)" maxlength="30" v-model="hintMessage"/>

                    <div class="slaveM" :style="stylerSize(22,10,3,33)">{{ $t('GENERAL.DELAY_TIME') }} : </div>
                    <input class="slaveM input-box" :style="stylerSize(50,10,27,33)" v-model="delayTime"/>
                    <div class="slaveM" :style="stylerSize(10,10,80,33)">{{ $t('GENERAL.UNIT_MILLISECONDS') }}</div>

                    <transition-group name="fade">
                        <div key="fade" v-show="dependency_flag">
                            <div class="slaveM" :style="stylerSize(22,10,3,73)">{{ $t('GENERAL.DELAY_TIME') }} : </div>
                            <input class="slaveM input-box" :style="stylerSize(40,10,27,73)" v-model="dependencyDelayTime"/>
                            <div class="slaveM" :style="stylerSize(5,10,70,73)">{{ $t('GENERAL.UNIT_SECONDS') }}</div>
                        </div>
                    </transition-group>
                    
                    <button class="slaveM hmi_setting_content_button" :style="stylerSize(22,11,75,85)" @click="resetDefault()">{{ $t('GENERAL.RESET_DEFAULT') }}</button>
            
                    <div class="slaveM" :style="stylerSize(22,10,3,53)">{{ $t('GENERAL.DEPENDENCY') }} : </div>
                    <input type="checkbox" class="slaveM" :style="stylerSize(10,10,25,53)" v-model="dependency_flag" @click="dependencyShow()"/>
                    <drop-down-select class="slaveM" :style="stylerSize(50,10,35,53)" :key="componentKey[2]"
                        :defaultPicked="parseInt(dependency_index)"
                        :itemList="scenelist"
                        :attr="'scene_name'"
                        :max_selection="3"
                        @itemClicked="selectContext">
                    </drop-down-select>
                    
                    </div>
            </transition>
        </div>

        <div class="slaveM" :style='stylerSize(100,30,0,2)'>
            <span class="slaveC _36 text_item" :style='stylerSize(10,20,45,0)'>{{ $t("GENERAL.CONTEXT_NAME") }}</span>
            <input class="slaveL _32 hmi_setting_content_input" :style='stylerSize(25,25,37.5,25)' v-model="currentName" @input="checkValue(currentName)"/>
            <button class="slaveC _32 hmi_setting_content_button animate" :style='stylerSize(10,20,45+adv_flag*(-22),65)' @click="addDevice">加入設備</button>
            <button class="slaveC _32 hmi_setting_content_button animate" :style='stylerSize(14,20,76+adv_flag*(-10),65)' 
                @click="adv_flag = !adv_flag;"> {{ adv_flag ? $t('GENERAL.CANCEL_ADVANCED_SETTING') : $t('GENERAL.ENABLE_ADVANCED_SETTING')}}
            </button> 
        </div>

        <div class="slaveM overFlowY animate" :style='stylerSize(100+adv_flag*(-50.5),70,0,30)'>
            <draggable :list="isSelectArr" class="list-group" ghost-class="ghost" @start="dragging = true" @end="dragging = false">
                <div class="slaveM _32 " :style='stylerSize(80+adv_flag*(20),15,10,index2*15)' v-for="(item, index2) in isSelectArr" :key="index2">
                    <div class='slaveM list-group-item' :style='stylerSize(100,90,0,5)'>
                        <div class="slaveM select-item overFlowX" :style='stylerSize(30+adv_flag*(7),80,1,10)'>
                            <div class="slaveC" :style='stylerSize(100,100,0,15)' >{{ nameList[item.dev_id] || item.dev_id }}</div>
                        </div>
                        <div class="slaveM select-item overFlowX" :style='stylerSize(20+adv_flag*(7),80,32+adv_flag*(7),10)'>
                            <div class="slaveC" :style='stylerSize(100,100,0,15)'>{{item.description}}</div>
                        </div>
                        <div class="slaveM select-item overFlowX" :style='stylerSize(11+adv_flag*(7),80,52+adv_flag*(14),10)'>
                            <div class="slaveC" :style='stylerSize(100,100,0,15)'>{{item.name}}</div>
                        </div>
                        <img class="slaveM" src="~assets/images/remove.png" :style='stylerSize(5+adv_flag*(2),70,93+adv_flag*(-10),15)' @click="deleteItem(index2)"/>
                    </div>
                </div>
            </draggable>
        </div>

        <el-dialog custom-class="dialog-class" :visible.sync="dialog_flag" :append-to-body="true" :style='stylerSize(150,100,-25,0)'>
            <div v-if="dialog_flag" Style="height: 60vh;" >
                <div class="main" :style='stylerSize()'>
                    <span class="slaveC _36 text_item" :style='stylerSize(15,8,1,10)'>{{ $t("GENERAL.SOLUTION_SELECT") }}</span>
                    <select class="slaveL _28 hmi_setting_content_select" :style='stylerSize(25,8,16,10)' v-model="currentSolution">
                        <option v-for="(item, index) in solutionEnabledList" :key="index" :value="item">
                            {{ $t("GENERAL."+getSolutionName(item)) }}
                        </option>
                    </select>
                    <span class="slaveC _36 text_item" :style='stylerSize(15,8,43,10)'>{{ $t("GENERAL.DEVICE_NAME") }}</span>
                    <select class="slaveL _32 hmi_setting_content_select" :style='stylerSize(40,8,58,10)' v-model="currentDevIndex">
                        <option
                            v-for="(item, index) in deviceList[currentSolution]"
                            :key="index"
                            :value="index"
                        >{{ nameList[item.deviceId] || item.deviceId }}</option>
                    </select> 

                    <div class="slaveM select-item" :style='stylerSize(97,68,1.5,25)' >
                        <div class="slaveM" v-for="(key, index) in Object.keys(deviceList[currentSolution][currentDevIndex].ctlInfo)"
                            :key="index" :style='stylerSize(100,15,0,20*(index-1)+30)'>

                            <span class="slaveM _32 title" :style='stylerSize(25,100,0,15)'> 
                                {{deviceList[currentSolution][currentDevIndex].ctlInfo[key].description}} 
                            </span>
                                
                            <!--選單超出頁面故在下面使用自定義下拉選單-->
                            <!--<select class="slaveL _32 hmi_setting_content_select" :style='stylerSize(40,100,25,0)' 
                                v-model="deviceList[currentSolution][currentDevIndex].currentSelect[deviceList[currentSolution][currentDevIndex].ctlInfo[index].description]">
                                <option v-for="(des_info, index_des_info) in deviceList[currentSolution][currentDevIndex].ctlInfo[index].value_list" 
                                    :key="index_des_info" :value="des_info.value">
                                        {{ des_info.name }}
                                </option>
                            </select>-->
                                
                            <button class="slaveC _32 hmi_setting_content_button" :style='stylerSize(15,100,75,0)' 
                                @click="itemJoin(key,index)">
                                    {{ $t("GENERAL.APPEND") }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <!--自定義下拉選單-->
            <div :key="componentKey[0]" v-if="currentCtlInfoLength>1" 
                class="slaveM" :style='stylerSize(40,0.9,27,35)'>
                <div :style="toTheFrontCSS(Object.keys(deviceList[currentSolution][currentDevIndex].ctlInfo).length-index)" 
                    class="slaveM" v-for="(key, index) in Object.keys(deviceList[currentSolution][currentDevIndex].ctlInfo)"
                    :key="index" style="height:100%; width:100%;">
                    <drop-down-select class="slaveL _32" :style='stylerSize(100,750,0,index*1400)'
                        :defaultPicked="0"
                        :itemList="deviceList[currentSolution][currentDevIndex].ctlInfo[key].value_list"
                        :attr="'name'"
                        :max_selection="4"
                        @itemClicked="selectControlMode(key)"
                        ref="selectCtlMode">
                    </drop-down-select>
                </div>
            </div>
            <div :key="componentKey[1]" v-else class="slaveM" :style='stylerSize(40,0.9,27,35)'>
                <drop-down-select class="slaveL _32" :style='stylerSize(100,800,0,40)'
                    :defaultPicked="0"
                    :itemList="deviceList[currentSolution][currentDevIndex].ctlInfo[Object.keys(deviceList[currentSolution][currentDevIndex].ctlInfo)[0]].value_list"
                    :attr="'name'"
                    :max_selection="4"
                    @itemClicked="selectControlMode(0)"
                    ref="selectCtlMode">
                </drop-down-select>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Draggable from "vuedraggable";
import dropDownSelect from "components/common/selectsingle/dropDownSelect";
import { translateSolution } from "common/constant/solution"
import { true_config , show_config , Setsetting , Addsetting , SceneList } from "../../../data/ston/data.js";

import { mapState, mapMutations, mapActions, mapGetters } from "vuex";

export default {
    components: {
        Draggable,
        dropDownSelect,
    },
    data() {
        return {
            sceneId: this.$route.query.sceneId,
            orderId: this.$route.query.orderId,
            isChange: this.$route.query.change,
            dependency_index: -1,
            isSelectArr: [],
            temp_control_list:[],
            nameList: {},
            temp_sceneId: 0,
            currentSolution: "",
            currentDevIndex: 0,
            currentCtlIndex: {},
            currentCtlInfoLength: 0,
            currentName: "",
            temp_orderConfig: [],
            dialog_flag : false , 
            deviceList: {},
            adv_flag: 0,
            dependency_flag: false,
            hintMessage: "",
            delayTime: "",
            dependency: "",
            dependencyDelayTime: "",
            solutionEnabledList: [],
            scenelist: [],
            componentKey: [0,0,0],
            previousPageFlag: false,
        };
    },
    created() {
        console.log("true config", true_config);
        let devCtlList = this.$store.state.deviceCommand.deviceControlList;
        if(this.sceneId && true_config.length) {
            let index= this.orderId;
            this.currentName = true_config[index].scene_name;
            this.isSelectArr = JSON.parse(JSON.stringify(true_config[index].control_list));
            this.temp_control_list = JSON.parse(JSON.stringify(true_config[index].control_list));

            if(true_config[index].message || true_config[index].delay>0 || true_config[index].dependency) this.adv_flag = 1;
            this.hintMessage = true_config[index].message;
            this.delayTime = true_config[index].delay > 0 ? true_config[index].delay : "";
            
            if(true_config[index].dependency !== "") {
                this.dependency_flag = true;
                this.dependency = true_config[index].dependency;
                this.dependencyDelayTime = true_config[index].dependency_delay_time > 0 ? 
                    true_config[index].dependency_delay_time : "";
            }
        }

        if(this.sceneId){
            for(let scene of true_config){
                if(scene.scene_id === this.sceneId) continue;
                this.scenelist.push({
                    scene_id: scene.scene_id,
                    scene_name: scene.scene_name
                });
            }
            if(this.dependency) {
                this.dependency_index = this.scenelist.findIndex(s => {return s.scene_id === this.dependency});
            }
        }else{
            for(let scene of SceneList){
                this.scenelist.push({
                    scene_id: scene.scene_id,
                    scene_name: scene.scene_name
                });
            }
        }
        
        
        this.nameList = this.$store.state.deviceName;

        let checkEmpty = true;
        for(let sol of this.$store.state.backData.solutionEnable){
            for(let card of this.$store.state.solutionData[sol].card){
                for(let dev of card.device){
                    if(devCtlList.hasOwnProperty(dev.deviceId)){
                        checkEmpty = false;
                        break;
                    }
                }
                if(!checkEmpty) break;
            }
            if(!checkEmpty) {
                this.solutionEnabledList.push(sol);
                checkEmpty = true;

                this.deviceList[sol] = [];
                let cnt = 0;
                for(let card of this.$store.state.solutionData[sol].card){
                    for(let dev of card.device){
                        if(devCtlList.hasOwnProperty(dev.deviceId)){
                            this.deviceList[sol].push({});
                            this.deviceList[sol][cnt]["deviceId"] = dev.deviceId;
                            this.deviceList[sol][cnt]["ctlInfo"] = JSON.parse(JSON.stringify(devCtlList[dev.deviceId]));
                            cnt += 1;
                        }
                    }
                }
            }
        }
        this.currentSolution = this.solutionEnabledList[0];
        if(!this.currentSolution){
            this.$notify({
                type: 'info',
                title: this.$t("GENERAL.NOTICE"),
                message: "請新增可控制設備。"
            })
            return this.$router.back();
        }
        console.log(this.currentSolution)
        console.log(this.deviceList)
    },
    mounted() {
        this.$bus.$on("configLoad", () => {
            // 確認有沒有更改
            if(!this.checkEmpty){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_013")
				});
                return 
            } 
            let empty_flag = true
            let emp_id = -1

            if(this.sceneId == undefined){
                this.temp_orderConfig = JSON.parse(JSON.stringify(show_config))
                this.temp_orderConfig = this.temp_orderConfig.sort(function (a, b) {
                    return Number(a.scene_id) < Number(b.scene_id) ? 1 : -1;
                });
                for(let i = this.temp_orderConfig.length-1; i >= 0; i--) {
                    empty_flag = false
                    if(i == 0){
                        break
                    }
                    if((Number(this.temp_orderConfig[i].scene_id)+1) != Number(this.temp_orderConfig[i-1].scene_id)){
                        empty_flag = true
                        emp_id = Number(this.temp_orderConfig[i].scene_id)+1
                        break
                    }
                    else{
                        continue
                    }
                }
                if(empty_flag == true){
                    this.sceneId = emp_id
                }
                else{ 
                    this.sceneId = (Number(this.temp_orderConfig[0].scene_id) + 1)
                }
            }
            //console.log(this.isSelectArr)
            this.save();
            this.$router.back()
        })
        this.$bus.$on("previousPage", () => {
            this.isSelectArr = JSON.parse(JSON.stringify(this.temp_control_list));
            this.previousPageFlag = true;
        });
    },
    beforeDestroy() {
        this.$bus.$off("previousPage");
        this.$bus.$off("configLoad");
        if(!this.adv_flag) {
            this.resetDefault();
        }
    },
    computed: {
        ...mapGetters(["getBackLang"]),
        checkEmpty() {
            if(this.isSelectArr.length === 0 || !this.currentName) {
                return false
            }
            return true
        },
    },
    methods: {
        //將設備資訊加入物件儲存
        itemJoin(key, index) {
            let ctlList = this.deviceList[this.currentSolution][this.currentDevIndex].ctlInfo;
            if(Object.keys(this.currentCtlIndex).length < Object.keys(ctlList).length){
                // 切換方案後，初始化當前選擇的控制動作
                for(let idx in ctlList){
                    this.selectControlMode(idx);
                }
            }
            console.log(this.currentCtlIndex)
            let item = ctlList[key];
            let ctl_value = item.value_list[this.currentCtlIndex[index]].value
            const obj = {
                cav: `${item.channel}_${item.attrId}_${ctl_value}`,
                cmd: item.writeCmd,
                description: item.description,
                dev_id: item.target_id,
                name: item.value_list[this.currentCtlIndex[index]].name
            }
            this.isSelectArr.push(obj)
            this.$notify({
                type: 'success',
                title: this.$t("GENERAL.APPEND_SUCCESS"),
            });
        },
        addDevice() {
            this.$bus.$emit("dialogClick");
            this.dialog_flag = true;
        },
        deleteItme(index) {
            this.$emit("deleteItem", index)
        },
        deleteItem(index) {
            console.log("delete", index)
            this.isSelectArr.splice(index, 1)
        },
        getSolutionName(value){
            return translateSolution(value);
        },
        //限制字數
        checkValue(attr) {
            // 中文、中文標點、按1長度，英文、英文符號、数字按0.5長度計算
            let cnReg = /([\u4e00-\u9fa5]|[\u3000-\u303F]|[\uFF00-\uFF60])/;
            let maxLimitStr = 10; //10個中文
            let pass = true;
            let substringStr = "";
            let length = 0;
            let strArr = attr.split("");
            strArr.map((str) => {
                if (pass) {
                    if (cnReg.test(str)) {
                        //中文
                        length++;
                    } else {
                        //英文
                        length += 0.5;
                    }
                    //大於最大限制的时候
                    if (length > maxLimitStr) {
                        pass = false;
                        this.$notify({
                            type: 'info',
                            title: this.$t("GENERAL.INPUT_TEXT_LENGTH_OVER"),
                            message: this.$t("GENERAL.INPUT_TEXT_LIMIT")
                        });
                        //將校驗的字符截取返回
                        this.currentName = substringStr;
                    } else {
                        substringStr += str;
                        //console.log(substringStr)
                    }
                }
            });
            return pass;
        },
        selectContext(index){
            this.dependency = SceneList[index].scene_id
            this.dependency_index = index
        },
        resetDefault(){
            if(!this.sceneId || !this.adv_flag){
                this.hintMessage = "";
                this.delayTime = "";
                this.dependency = "";
                this.dependencyDelayTime = "";
                this.dependency_index = -1;
                this.dependency_flag = false;
            }else{
                let index = this.orderId;
                this.hintMessage = true_config[index].message;
                this.delayTime = true_config[index].delay > 0 ? true_config[index].delay : "";
                this.dependency = true_config[index].dependency;
                this.dependency_index = this.scenelist.findIndex(s => {return s.scene_id === this.dependency});
                this.dependency_flag = this.dependency ? true : false;
                this.dependencyDelayTime = true_config[index].dependency_delay_time > 0 ? 
                    true_config[index].dependency_delay_time : "";
            }
            this.componentKey[2] += 1; //force re-render
        },
        checkMax(flag){
            switch(flag){
                case 0:
                    if(this.delayTime>10000) this.delayTime = 10000;
                    break;
                case 1:
                    if(this.dependencyDelayTime>180) this.dependencyDelayTime = 180;
                    break;
            }
        },
        selectControlMode(ctl_info_index){
            if(this.$refs.selectCtlMode.pickedIndex === undefined){
                this.currentCtlIndex[ctl_info_index] = this.$refs.selectCtlMode[ctl_info_index].pickedIndex;
            }else{
                this.currentCtlIndex[ctl_info_index] = this.$refs.selectCtlMode.pickedIndex;
            }
        },
        save(){
            if(this.previousPageFlag) return;
            let item = {
                control_count: this.isSelectArr.length,
                control_list: this.isSelectArr,
                scene_id: this.sceneId,
                orderId: this.orderId,
                scene_name: this.currentName,
                isModify: true,
                message: this.hintMessage,
                delay: this.delayTime,
                dependency_delay_time: this.dependencyDelayTime,
            }
            item.dependency = this.dependency_flag ? this.dependency : "" ;
            //判斷是不是編輯狀態
            if(this.isChange == "true") {
                Setsetting(this.orderId, item)
            }
            else{
                Addsetting(item);
            }
        },
        forceRerender(){
            if(this.currentCtlInfoLength>1){
                this.componentKey[0] += 1;
            }else{
                this.componentKey[1] += 1;
            }
        },
        dependencyShow(){
            if(this.dependency_flag){
                this.dependency_index = -1;
            }else{
                //打勾後顯示原先已選取的設備
                this.dependency_index = this.scenelist.findIndex(s => {return s.scene_id === this.dependency});
            }
            this.componentKey[2] += 1;
        },
        toTheFrontCSS(n){
            return `z-index: ${n}`;
        },
    },
    watch: {
        currentSolution(){
            this.currentDevIndex = 0;
            if(this.currentSolution){
                this.currentCtlInfoLength = Object.keys(this.deviceList[this.currentSolution][0].ctlInfo).length;
            }
            this.forceRerender();
        },
        delayTime(){
            this.checkMax(0);
        },
        dependencyDelayTime(){
            this.checkMax(1);
        },
        currentDevIndex(){
            this.currentCtlInfoLength = Object.keys(this.deviceList[this.currentSolution][this.currentDevIndex].ctlInfo).length;
        }
    },
};
</script>

<style scoped>
.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}
.list-group {
    margin-top: 30px;
}
.list-group-item {
    /* border: 1px solid #ffffff; */
    background-color: #8eb1bee0;
    margin-bottom: 5px;
    height: 80px;
    color: #ffffff;
    display: flex;
    border-radius: 5px;
    align-items: center;
    justify-content: space-around;
}

.list-group-item span {
    width: 70%;
}
.select-item {
    display: flex;
    flex-direction: column;
    border: 0.5px solid rgba(116, 152, 203, 0.8);;
    border-radius: 4px;
    background:  rgba(47, 126, 166, 0.905);
}
.select-item span {
    text-align: center;
}

.input-box{
    border-radius: 4px;
    border: none;
}

.animate{
    transition: 1s;
}

.slide-enter-active,
.slide-leave-active,
.fade-enter-active,
.fade-leave-active{
    transition: all 1s;
}

.slide-enter,
.slide-leave-to{
    transform: translateX(100%);
}

.fade-enter,
.fade-leave-to{
    opacity: 0
}
.fade-leave,
.fade-enter-to{
    opacity: 1
}
</style>