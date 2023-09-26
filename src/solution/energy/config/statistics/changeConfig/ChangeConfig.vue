<template>
    <div class="STATISTICS_CONTENT">
        <div class="row row-no-padding">
            <div class="col-12 row row-no-padding" style="align-items: center; margin: 1.5vh auto;">
                <div class="col-3" style="color: #01ffff"> {{ $t("GENERAL.SELECT_METER") }} </div>
                <div class="col-9">
                    <span class="col-10"> {{ $t("GENERAL.TARGET_METER") }}: </span>
                    <el-select :value="currentDev" @change="deviceChange" class="col-10" :placeholder="$t('GENERAL.CHOOSE')">
                        <el-option v-for="(dev, dev_index) in deviceList" :key="dev_index"
                            :value="dev.dev_id" :label="dev.dev_name">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <hr class="statistics_hr">
            <div class="col-12 row row-no-padding">
                <div class="col-6">
                    <div class="col-12" style="text-align: center; margin-bottom: 3vh;">
                        <span> {{ $t("GENERAL.METER_ATTRIBUTE") }} </span>
                    </div>
                    <dragable class="dragable_view" group="attribute" :list="currentAttrList">
                        <div class="dragable_item" v-for="(attr, attr_index) in currentAttrList" :key="attr_index">
                            {{ attr.name }}
                        </div>
                    </dragable>
                </div>

                <div class="col-6">
                    <div class="col-12" style="text-align: center; margin-bottom: 3vh;">
                        <span> {{ $t("GENERAL.ATTRIBUTES") }} </span>
                    </div>
                    <dragable class="dragable_view" group="attribute" :list="currentChooseList">
                        <div class="dragable_item" v-for="(choose, choose_index) in currentChooseList" :key="choose_index">
                            {{ choose.name }}
                        </div>
                    </dragable>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import dragable from "vuedraggable"
import { Notification } from "element-ui"
import { statis_type } from "../statisType"
import { createNamespacedHelpers } from "vuex"
import { DeviceName } from "common/constant/profile"
import statisticsStoreMixin from "../mixin/statisticsStoreMixin"
const { mapState: mapCommandState } = createNamespacedHelpers('deviceCommand');

export default {
    mixins: [statisticsStoreMixin],
    components: {
        dragable,
    },
    data(){
        return{
            statis_id: this.$route.query.statis_id,
            currentDev: null,
            currentAttrList: [],
            currentChooseList: [],  // 目前選擇的屬性列表
        }
    },
    created(){
        // modified statistics setting
        console.log(this.deviceAttr)
        if(this.statis_id){
            this.currentDev = this.statisticsList[this.statis_id].dev_id;
            this.currentChooseList = this.statisticsList[this.statis_id].attr;
            // first, filter attribute that can be setup
            let attrList = this.deviceAttr[this.currentDev].filter(attr => {
                for(let item of Object.keys(statis_type)){
                    if(item.indexOf('-') != -1){
                        const [min, max] = item.split('-').map(item => Number(item));
                        if(Number(attr.value) >= min && Number(attr.value) <= max)
                            return true;
                    }
                    else if(item == attr.value) return true;
                }
                return false;
            })
            // second filter attribute that doesn't exist in currentChooseList
            for(let attr of attrList){
                if(this.currentChooseList.find(item => item.value == attr.value))
                    continue;
                else this.currentAttrList.push(attr);
            }
            
        }
        // add statistics setting
        else{
            if(this.deviceList.length > 0){
                this.currentDev = this.deviceList[0].dev_id;
                this.currentAttrList = this.deviceAttr[this.currentDev].filter(attr => {
                    for(let item of Object.keys(statis_type)){
                        if(item.indexOf('-') != -1){
                            const [min, max] = item.split('-').map(item => Number(item));
                            if(Number(attr.value) >= min && Number(attr.value) <= max)
                                return true;
                        }
                        else if(item == attr.value) return true;
                    }
                    return false;
                });
            }
        }
    },
    mounted(){
        this.$bus.$on("configLoad", () => {
            // check if there is a setting attribute
            //console.log(this.currentChooseList)
            //console.log(this.currentAttrList)
            if(this.currentChooseList.length == 0){
                Notification({
                    type: 'error',
                    title: this.$t("GENERAL.DATA_MISSING"),
                    message: this.$t("GENERAL.DATA_MISSING_ATTRIBUTE"),
                });
                //console.log(this.statisticsList)
                return;
            }
            let newConfig = {
                dev_id: this.currentDev,
                attr: JSON.parse(JSON.stringify(this.currentChooseList))
            };
            let nonUseConfig = {
                dev_id: this.currentDev,
                attr: JSON.parse(JSON.stringify(this.currentAttrList))
            };
            
            if(this.statis_id)
                this.modifyStatisticsList({
                    index: this.statis_id,
                    config: newConfig,
                    del_config: nonUseConfig,
                });
            else
                this.addStatisticsList(newConfig);
            this.$router.back();
        });
        this.$bus.$on("previousPage", async() => {
            if(this.currentChooseList.length == 0){
                await this.getStatisticsList();
            }
        });
    },
    beforeDestroy(){
        this.$bus.$off("configLoad");
        this.$bus.$off("previousPage");

        let path = this.$route.path.split('/');
        if(path[path.length - 1] !== 'statistics')
            this.resetStatisticsList();
    },
    computed: {
        ...mapCommandState({
            deviceAttr: state => state.deviceAttrList,
            deviceCmd: state => state.commandDeviceList,
        }),
        deviceList(){
            if(Object.keys(this.deviceAttr).length > 0){
                let deviceList = [];
                for(let dev of Object.keys(this.deviceAttr)){
                    let module = dev.substr(2, 2);
                    // only module 10, 11, 12 meter can be set
                    if(module == '10' || module == '11' || module == '12'){
                        console.log(dev)
                        let dev_name = DeviceName[dev] ? DeviceName[dev] : dev;
                        deviceList.push({
                            dev_id: dev,
                            dev_name: dev_name,
                        });
                    }
                }
                // filter device that has been setup
                return deviceList.filter(dev => {
                    let choose = true;
                    for(let stats of this.statisticsList)
                        if(stats.dev_id == dev.dev_id) choose = false;
                    return choose;
                });
            }
            else return [];
        },
        currentDevAttr(){
            if(this.currentDev !== null){
                return this.currentAttrList = this.deviceAttr[this.currentDev].filter(attr => {
                    for(let item of Object.keys(statis_type)){
                        if(item.indexOf('-') != -1){
                            const [min, max] = item.split('-').map(item => Number(item));
                            if(Number(attr.value) >= min && Number(attr.value) <= max)
                                return true;
                        }
                        else if(item == attr.value) return true;
                    }
                    return false;
                });
            }
        }
    },
    methods: {
        deviceChange(value){
            for(let statis of this.statisticsList){
                if(statis.dev_id == value){
                    Notification({
                        type: 'warning',
                        title: this.$t("GENERAL.SETTING_ERROR"),
                        message: this.$t("GENERAL.SETTING_ERROR_REPEAT_DEVICE")
                    })
                    return;
                }
            }
            this.currentDev = value;
        }
    }
}
</script>

<style>

.STATISTICS_CONTENT{
    display: flex;
    color: white;
    font-weight: bold;
    width: 90vw;
    height: 80vh;
    margin: auto;
    flex-direction: column;
    font-size: 2.5vw;
    line-height: 1.5;
}

</style>