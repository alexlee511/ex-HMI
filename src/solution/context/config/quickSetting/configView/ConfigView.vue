<template>
    <div class="main white_view" :style='stylerSize()'>
        <div class="slaveC _36" :style='stylerSize(18,6,23,5)'>{{ $t('GENERAL.INPUT_CONTEXT_NAME') }}</div>
        <input class="slaveL _32 hmi_setting_content_input" :style='stylerSize(25,6,42,5)' v-model="currentName" @input="checkValue(currentName)"/>
        <button class="slaveC _32 hmi_setting_content_button animate" :style='stylerSize(14,8,76+adv_flag*(-5),4+adv_flag*14)' 
            @click="adv_flag = !adv_flag;"> {{ adv_flag ? $t('GENERAL.CANCEL_ADVANCED_SETTING') : $t('GENERAL.ENABLE_ADVANCED_SETTING')}}
        </button> 
        <div class="title_item slaveM animate" :style='stylerSize(100-adv_flag*30,10,0,18)'>
            <div class="slaveC _36" :style='stylerSize(10,100,9.5,0)'>{{ $t('GENERAL.ORDER') }}</div>
            <div class="slaveC _36" :style='stylerSize(10,100,27,0)'>{{ $t('GENERAL.MODE') }}</div>
            <div class="slaveC _36" :style='stylerSize(15,100,47,0)'>{{ $t('GENERAL.CONTROL_DEVICE_LIST') }}</div>
        </div>

        <!--ADVANCED SETTING-->
        <div class="slaveM" :style='stylerSize(37,50,58,30)' style="overflow: hidden;">
            <transition name="slide" >
                <div v-show="adv_flag" class="slaveM white-box _28" :style='stylerSize(100,100,0,0)' >

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
                    <drop-down-select class="slaveM" :style="stylerSize(50,10,35,53)" :key="forceRerenderKey"
                        :defaultPicked="parseInt(dependency_index)"
                        :itemList="scenelist"
                        :attr="'scene_name'"
                        :max_selection="3"
                        @itemClicked="selectContext">
                    </drop-down-select>
                    
                    </div>
            </transition>
        </div>

        <div class="slaveM overFlowY animate"   :style='stylerSize(100-adv_flag*35,70,0,30)'>
            <draggable
                v-model="configList"
                :disabled="!enabled"
                class="slaveC draggableMain_V2"
                :style='stylerSize(80,100,10,0)'
                ghost-class="ghost"
                @start="dragging = true"
                @end="dragging = false"
                :scroll-sensitivity="80"
                :force-fallback="true"
            >
                <div class="slaveM" v-for="(item, index) in configList" :style='stylerSize(95,30,1,1+index*32)' :class="item.isModify && 'change_item'" :key="index" ><!--:class="item.isModify && 'change_item'"-->
                    <div class="slaveC draggablebutton_V2" :style='stylerSize(100,95,0,0)'>
                        <div class="slaveC _36" :style='stylerSize(8+adv_flag*3,50,1,5)'>{{ index+1 }}</div>
                        <div class="slaveC _36" :style='stylerSize(25,50,15,5)'>{{ item.description}}:{{item.model_name}}</div>
                        <div class="slaveC _36 " :style='stylerSize(20,100,50+adv_flag*4,5)'>
                            <img class="slaveL" :style='stylerSize(16+adv_flag*10,27,adv_flag*105,3)' src="~assets/images/arrow_down_03.png" @click="showItemClick(index)"/> 
                            total: {{item.device_count}}
                            <transition name="dropdown" v-if="activeShow === index ">
                                <div class="slaveL _24 divfocus" :style='stylerSize(135+adv_flag*40,50,0,40)' style="word-wrap:break-word; white-space: nowrap; overflow-x:auto;" >
                                    <div v-for="(itemx, indey) in item.device_list" :key="indey" >
                                        {{ nameList[itemx.device_id] || itemx.device_id }}
                                    </div>
                                </div>
                            </transition>
                        </div>
                        <img class="slaveL" :style='stylerSize(4.5+adv_flag*2,40-adv_flag*8,80+adv_flag*3,5)' src="~assets/images/modify.png" @click="goChange(item, index)"/>
                        <img class="slaveL" :style='stylerSize(4.5+adv_flag*3,40-adv_flag*8,88+adv_flag*3,5)' src="~assets/images/remove.png" @click="deleteDevice(item)"/>
                    </div>
                </div>
            </draggable>
            
        </div>
    </div>
</template>

<script>
import { setSceneList } from "network/scence"
import draggable from "vuedraggable";
import dropDownSelect from "components/common/selectsingle/dropDownSelect";
import { true_config , Delsetting , restart, draggableList, sceneName, saveName, advanced_data } from "../ston/data.js";

export default {
    components: {
        draggable,
        dropDownSelect
    },
    data() {
        return {
            currentName: "",
            activeShow: null,
            nameList: [],
            controlList: [],
            flag: -1,
            list_len: 0,
            temp_index: -1,
            temp_list: [],
            configList: [],
            action_list: [],
            enabled: true,
            adv_flag: false,
            dependency_flag: false,
            dependency_index: -1,
            hintMessage: "",
            delayTime: "",
            dependency: "",
            dependencyDelayTime: "",
            scenelist: [],
            forceRerenderKey: 0,
            clearFlag: false,
        }
    },
    //mixins: [],
    created(){
        this.currentName = sceneName
        //console.log(this.$store.state.deviceCommand.deviceControlList)
        //console.log(this.configList)
        console.log(true_config, advanced_data)
        this.configList = true_config
        
        for(let card of this.$store.state.solutionData.context.card){
            for(let dev of card.device){
                this.scenelist.push({
                    "scene_id": dev.scene_id,
                    "scene_name": dev.scene_name,
                });
            }
        }
        
        advanced_data["message"] ? this.hintMessage = advanced_data["message"] : "" ;
        advanced_data["delay"] ? this.delayTime = advanced_data["delay"] : "" ;
        advanced_data["dependency_delay_time"] ? this.dependencyDelayTime = advanced_data["dependency_delay_time"] : "" ;
        
        if(advanced_data["dependency"]){
            this.dependency = advanced_data["dependency"];
            this.dependency_flag = true;
            this.dependency_index = this.scenelist.findIndex( s => { return s.scene_id === this.dependency});
        }

        for(let item of Object.keys(advanced_data)){
            if(advanced_data[item]) {
                this.adv_flag = true ;
                break;
            }
        }
    },
    async mounted() {
        this.nameList = this.$store.state.deviceName;
        console.log(this.nameList)
        ////console.log(this.list)
        this.$bus.$on("previousPage", async() => {
            console.log("離開")
            restart()       //清除ston的list與暫存
            this.clearFlag = true;
            console.log(true_config)
        });

        this.$bus.$on("configApply", async() => {
            this.clearFlag = true;
            if(this.currentName.length == 0 || true_config.length == 0){
                this.$notify({
					type: 'info',
					title: this.$t("GENERAL.NOTICE"),
					message: this.$t("GENERAL.ERROR_MSG_013")
				});
                return
            }
            this.$store.commit("setLoadingState");
            
            //console.log("第"+i+"次", "存前")
            await this.save_list();
            setTimeout(() => {
                restart()       //清除ston的list與暫存
                this.$notify({
					type: 'success',
					title: this.$t("GENERAL.SUCCESS_TITLE"),
					message: this.$t("GENERAL.SETTING_SUCCESS")
				});
                this.$router.back()
                this.$store.commit("setLoadingState");
            }, 2500);
        })
    },
    async beforeDestroy() {
        if(!this.clearFlag){
            advanced_data["message"] = this.hintMessage;
            advanced_data["delay"] = this.delayTime;
            advanced_data["dependency"] = this.dependency;
            advanced_data["dependency_delay_time"] = this.dependencyDelayTime;
        }
        this.$bus.$off('configApply')
        this.$bus.$off("previousPage")
    },
    computed: {
        stylerwd: function(){
            return function(w='100',h='100',k='0',t='0',f='0'){
                let tmp = ""
                let len = this.list_len
                let top = 0
                if(len > 5){
                        top = 20*t + 20
                }
                else if(len < 3){
                        top = 20*t+3*len
                }
                else{
                        top = 20*t+4*len
                }
                
                //console.log(this.flag,t,this.temp_index)
                if(this.flag>-1 && t>this.flag){
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+top+"%;"; 
                }
                else{
                    tmp = "width: "+w+"%;height:"+h+"%;left:"+k+"%;top:"+(20*t)+"%;";
                }
                return tmp
            }
        },
    },
    methods: {
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
        
        //修改
        goChange(item, index) {
            console.log(index)
            console.log(item)
            let path = this.$route.path.replace(/configView/i, "ChangeConfig")
            
            if(true_config.length == 0){
                for(let i of this.configList){
                    //console.log(i)
                    true_config.push(i)
                }
            }
            console.log(true_config)
            this.$router.push({
                path: path,
                query: {
                    //sceneId: item.scene_id,
                    orderId: index,
                    isChange: true,
                },
            });
        },
        deleteDevice(item) {
            if(true_config.length == 0){
                for(let i of this.configList){
                    true_config.push(i)
                }
            }
            Delsetting(item)
            console.log(true_config)
        },
        showItemClick(index) {
            //console.log(index)
            this.list_len = this.configList[index].device_count
            if(index === this.activeShow){
                this.activeShow = null
                this.flag = -1
                this.temp_index = -1
            }else{
                this.activeShow = index
                this.flag = index
                this.temp_index = index
            }
            
        },
        //套用
        async save_list(){
            console.log(true_config)
            let statement = "";
            for(let item of true_config) {
                console.log(item)
                for(let i of item.device_list) {
                    let cav = i.channel + "_" + item.attrId + "_" + item.model
                    statement = statement + `${i.device_id}_${item.cmd}_${cav};`
                }
                
                //delete item.isModify
            }
            console.log(this.currentName)
            console.log(statement)

            let tmp_arr = [this.hintMessage, this.delayTime, this.dependency, this.dependencyDelayTime];
            for(let i in tmp_arr){
                if(tmp_arr[i] == undefined) tmp_arr.splice( i, 1);
            }
            const res = await setSceneList(
                this.currentName,
                statement.substr(0, statement.length - 1),
                undefined,
                !this.hintMessage ? undefined : this.hintMessage,
                !this.delayTime ? undefined : this.delayTime,
                !this.dependency ? undefined : this.dependency,
                !this.dependencyDelayTime ? undefined : this.dependencyDelayTime,
            )
            console.log(res)
            console.log(true_config)
            if(true_config.length != 0) {
                this.configList = JSON.parse(JSON.stringify(true_config))
                restart();         //清除ston的list與暫存
            }
            //console.log(this.configList)
        },
        resetDefault(){
            this.hintMessage = advanced_data["message"];
            this.delayTime = advanced_data["delay"];
            this.dependency = advanced_data["dependency"];
            this.dependencyDelayTime = advanced_data["dependency_delay_time"];
            this.dependency_flag = false;
            this.dependency_key = -1;
            this.forceRerenderKey += 1;
        },
        selectContext(index){
            //let index = this.$refs.selectContext.val;
            //console.log(index, scenelist[index].scene_name)
            this.dependency = this.scenelist[index].scene_id
            // console.log(this.dependency)
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
        dependencyShow(){
            if(this.dependency_flag){
                this.dependency_index = -1;
            }else{
                //打勾後顯示原先已選取的設備
                this.dependency_index = this.scenelist.findIndex(s => {return s.scene_id === this.dependency});
            }
            this.forceRerenderKey += 1;
        }
    },

    watch:{
        configList:function(){
            draggableList(this.configList)    //顯示的List排序變了，存在ston的list排序也要一起變
        },
        currentName: function(){
            saveName(this.currentName)        //將情境名稱暫存直到套用完離開此頁
        },
        delayTime(){
            this.checkMax(0);
        },
        dependencyDelayTime(){
            this.checkMax(1);
        }
    }
}
</script>

<style scoped>
.ghost {
    opacity: 0.5;
    background: #c8ebfb;
}

.white-box {
    /* border: 1px solid #ffffff; */
    background-color: #8eb1bee0;
    color: #ffffff;
    border-radius: 5px;
}

.white-box span {
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