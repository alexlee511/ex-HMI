<template>
    <config-type-setting>
        <template v-slot:button>
            <header-button @click.native="goPickDevice()"> {{ $t("GENERAL.NEXT_STEP") }} </header-button>
        </template>

        <template v-slot:content>
            <div class="slaveM" :style='stylerSize(100,90,0,10)'>
                    <span class="slaveL title _40" :style='stylerSize(15,8,5,0)'>{{ $t("GENERAL.DEVICE_KIND") }}:</span>
                    <select class="slaveL _40 hmi_setting_content_select" :style='stylerSize(40,8,5,8)' v-model="deviceKind">
                        <option v-for="(item, key) in devKindList" :value="item" :key="key">
                            {{ translation(item) }}
                        </option>
                    </select>

                    <span class="slaveL title _40" :style='stylerSize(15,8,58,0)'>{{ $t("GENERAL.DEVICE_TYPE") }}:</span>
                    <select class="slaveL _40 hmi_setting_content_select" :style='stylerSize(35,8,58,8)' v-model="deviceType">
                        <option v-for="(item, index) in devTypeList" :key="index">
                            {{ item }}
                        </option>
                    </select>

                    <div class="slaveM" :style='stylerSize(85,80,5,20)'>
                        <div v-for="(adv_item, index1) in AdvSettingList" :key="index1">
                        <span class="slaveL font _40" :style='stylerSize(100,10,0,getTopPadding(index1, 18))'> {{ adv_item.adv_name }} </span>
                        <div class="slaveM" :style='stylerSize(100,90,0,getTopPadding(index1, 18)+10)'>
                            
                            <div v-if="adv_item.adv_type == 0">
                                <ul id="adv-type-0">
                                <li v-for="(item, index2) in adv_item.set_list" :key="index2">
                                    <div class="adv-item-title">
                                    <span class="adv-item-name">{{ item.name }}</span>
                                    <span class="adv-item-desc" v-if="item.description">({{ item.description }})</span>
                                    </div>
                                    <div class="adv-options" v-if="item.mode == 1">
                                    <span v-for="(range, index3) in item.range" :key="index3">
                                        <input type="radio" :id="`${adv_item.adv_key}-${index2}-${index3}`" :value="range.value" v-model="settingConfig[index1].values[index2].value" />
                                        <label :for="`${adv_item.adv_key}-${index2}-${index3}`">{{ range.name }}</label>
                                    </span>
                                    </div>
                                    <div class="adv-options" v-if="item.mode == 2">
                                    <select v-model="settingConfig[index1].values[index2].value">
                                        <option v-for="(range, index3) in item.range" :key="index3" :value="range.value">{{ range.name }}</option>
                                    </select>
                                    </div>
                                    <div class="adv-options" v-if="item.mode == 3">
                                    <input type="text" v-model="settingConfig[index1].values[index2].value" @change="onType0InputChange($event, settingConfig[index1].values[index2])" />
                                    </div>
                                </li>
                                </ul>
                            </div>
                            
                            <div v-if="adv_item.adv_type == 1">
                                <ul id="adv-type-1">
                                <li>
                                    <div class="adv-list-header" v-for="(item, index2) in adv_item.set_list" :key="index2">
                                    <span class="adv-item-name">{{ item.name }}</span>
                                    <span class="adv-item-desc">{{ item.description }}</span>
                                    </div>
                                </li>
                                <li v-for="(fieldList, index2) in settingConfig[index1].values" :key="index2">
                                    <div class="adv-item-div" v-for="(field, index3) in fieldList" :key="index3">
                                    <input type="text" v-model="field.value" @change="onType1InputChange($event, settingConfig[index1], fieldList, field, index2 == settingConfig[index1].values.length - 1)" />
                                    </div>
                                    <div class="delete-button" v-if="index2 != settingConfig[index1].values.length - 1" @click="onDeleteClick( settingConfig[index1].values, index2)">
                                    <img src="~assets/images/remove.png" />
                                    </div>
                                </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </config-type-setting>
</template>

<script>
import ConfigTypeSetting from "layout/configTypeSetting/ConfigTypeSetting"
import HeaderButton from "components/content/headerButton/HeaderButton"
import { getAdvSettingInfo, setCurrentModule, getModuleDeviceList, setSettingConfig, SettingConfig, CurrentModule } from "./data"
import { typeToKind } from "common/constant/type"

export default {
    components: {
        ConfigTypeSetting,
        HeaderButton
    },
    data(){
        return{
            AdvSettingInfo: {},
            ModuleDeviceList: {},
            deviceType: "",
            deviceKind: "",
            moduleList: [],
            settingConfig: [],
            currentModule: "",
            oldConfigFlag: false,
        }
    },
    async created(){
        this.$store.state.loading = true;

        if(SettingConfig.length>0){
            this.oldConfigFlag = true;
        }

        this.AdvSettingInfo = await getAdvSettingInfo();

        if(this.oldConfigFlag){
            this.settingConfig = SettingConfig;
            this.currentModule = CurrentModule;
            this.deviceKind = typeToKind(this.currentModule.substring(0,2));
            this.deviceType = this.currentModule.substring(3,this.currentModule.length);
            console.log(this.currentModule,this.deviceKind,this.deviceType)
        }else{
            this.deviceKind = this.devKindList[0];
        }
        // console.log(JSON.stringify(this.AdvSettingInfo, null, 4));
        console.log(this.AdvSettingInfo)
        this.$store.state.loading = false;
    },
    mounted(){
        this.$bus.$on("previousPage", () => {
            console.log("Clear data")
            setSettingConfig([]);
            setCurrentModule("");
        });
    },
    beforeDestroy() {
        // 避免在挑選設備按返回時清除已設定的資料
        this.$bus.$off("previousPage");
    },
    methods: {
        goPickDevice(){
            if( getModuleDeviceList().length==0 ){
                this.$notify({
                    type: 'error',
                    title: '',
                    message: this.$t("GENERAL.NO_DEVICE")
                })
            }else{
                // 檢查是否只設定其中幾個
                for(let item of this.settingConfig){
                    let cnt_zero = 0;
                    for(let val of item.values){
                        if(val.value == ""){
                            cnt_zero += 1;
                        }
                    }
                    if( cnt_zero < item.values.length && cnt_zero > 0 ){
                        this.$notify({
                                type: 'error',
                                title: '',
                                message: this.$t("GENERAL.ERROR_MSG_013")
                            })
                        return;
                    }
                }
                setSettingConfig(this.settingConfig);
                setCurrentModule(this.currentModule);
                this.$router.push({
                    path: "/PickDevices",
                });
            }
        },
        getTopPadding( index, height){
            if(index == 0) return 0;
            let sum = 0;
            for(let i in this.AdvSettingList){
                if(i==index) break;
                sum += this.AdvSettingList[i].set_list.length
            }
            return sum*=height;
        },
        onType0InputChange(event, field) {
            const regex = new RegExp(field.range, "gm");
            let text = event.target.value;
            let m;

            field.correct = false;

            while ((m = regex.exec(text)) !== null) {
                if (m.index === regex.lastIndex) {
                regex.lastIndex++;
                }

                m.forEach((match, groupIndex) => {
                field.correct = true;
                });
            }

            if (!field.correct) {
                this.$notify({
                    type: 'error',
                    title: '',
                    message: this.$t("GENERAL.ERROR_MSG_011")
                })
                field.value = field.default_value;
            }
        },
        onType1InputChange(event, dataList, fieldList, field, isLast) {
            const regex = new RegExp(field.range, "gm");
            let text = event.target.value;
            let m;

            field.correct = false;

            while ((m = regex.exec(text)) !== null) {
                if (m.index === regex.lastIndex) {
                regex.lastIndex++;
                }

                m.forEach((match, groupIndex) => {
                field.correct = true;
                });
            }

            if (!field.correct) {
                this.$notify({
                    type: 'error',
                    title: '',
                    message: this.$t("GENERAL.ERROR_MSG_011")
                })
                field.value = field.default_value;
            }

            if (isLast) {
                let correctCounter = 0;
                let newArray = [];
                for (let item of fieldList) {
                if (item.correct) correctCounter++;
                newArray.push({ correct: false, value: "", range: item.range, default_value: item.default_value });
                }

                if (correctCounter == fieldList.length) {
                dataList.values.push(newArray);
                }
            }
        },
        onDeleteClick(dataList, index2) {
            dataList.splice(index2, 1);
        },
    },
    computed: {
        devKindList(){
            let tmplist = Object.keys(this.AdvSettingInfo).map( e => {
                return typeToKind(e.substring(0,2));
            })
            let set = new Set(tmplist);
            tmplist = [...set];
            return tmplist;
        },
        devTypeList() {
            let tmplist = [];
            let type = typeToKind(this.deviceKind);
            for(let module of Object.keys(this.AdvSettingInfo)){
                if(type == module.substring(0,2)){
                    tmplist.push(module.substring(3, module.length));
                }
            }
            return tmplist;
        },
        AdvSettingList(){
            return this.AdvSettingInfo[this.currentModule];
        },
        
    },
    watch:{
        deviceKind(){
            if(this.oldConfigFlag){
                return;
            }
            this.deviceType = this.devTypeList[0];
            this.settingConfig = [];
        },
        deviceType(){
            if(this.oldConfigFlag){
                return;
            }
            this.currentModule = typeToKind(this.deviceKind) + '-' + this.deviceType;
            this.settingConfig = [];
            setCurrentModule(this.currentModule);
        },
        currentModule(){
            if( this.oldConfigFlag){
                this.oldConfigFlag = false;
                return;
            }
            if(!this.deviceKind || !this.deviceType) return;
            console.log(this.currentModule)
            console.log(this.settingConfig)
            // this.settingConfig = [];
            for (let advance of this.AdvSettingList) {
                let advType = advance.adv_type;
                let ranges = advance.set_list.map((item) => item.range);
                let defValues = advance.set_list.map((item) => (item.default_value ? item.default_value : ""));
                let item = { key: advance.adv_key, type: advType, values: [] };

                if (advType == 0) {
                    item.values = advance.set_list.map((item) => {
                        return { correct: true, value: item.default_value, range: item.range, default_value: item.default_value };
                    });
                } else if (advType == 1) {
                    let dataList = advance.set_list.map((item, index) => {
                        return { correct: false, value: defValues[index], range: ranges[index], default_value: defValues[index] };
                    });
                    item.values.push(dataList);
                }
                this.settingConfig.push(item);
            }
        }
    }
}

</script>

<style scoped src="@/assets/css/otherConfigAdvance.css" />