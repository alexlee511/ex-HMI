<template>
    <div class="main" :style='stylerSize()'>
        <div class="slaveM" :style='stylerSize(100,15,0,0)'>
            <div class="slaveC _36 title_item" :style='stylerSize(7,40,2,15)'> {{ $t("GENERAL.INDEX") }} </div>
            <div class="slaveC _36 title_item" :style='stylerSize(12,40,25,15)'> {{ $t("GENERAL.DEVICE_NAME") }} </div>
            <div class="slaveC _36 title_item" :style='stylerSize(12,40,55,15)'> {{ $t("GENERAL.ATTRIBUTES_SETTING") }} </div>
        </div>

        <div class="slaveM overFlowY" :style='stylerSize(100,80,0,15)'>
            <div 
                class="slaveM text_item" 
                v-for="(stat, stat_index) in statisticsList" 
                :key="stat_index"
                :class="stat.isChange && 'change_item'"
                :style='stylerSize(100,25,0,stat_index*25)'
            >
                <div class="slaveC _36" :style='stylerSize(7,40,2,0)'>
                    {{ stat_index + 1 }}
                </div>
                <div class="slaveC _36" :style='stylerSize(30,40,16,0)'>
                    {{ devNameChange(stat.dev_id) || stat.dev_id }}
                </div>
                <div class="slaveC _36" :style='stylerSize(20,100,54,0)'>
                    <div class="slaveL">
                        <img :style='stylerSize(15,5,0,0)' @click="showAttrInfo(stat_index)" src="~assets/images/arrow_down_03.png" >
                        {{ $t("GENERAL.ATTRIBUTES_SETTING") }}: {{ stat.attr.length }}
                    </div>
                    <transition name="dropdown">
                        <div class="slaveL _28" :style='stylerSize(100,50,0,35)' v-if="currentAttributeIndex == stat_index" style="white-space: normal;">
                            <div v-for="(attr, attr_index) in stat.attr" :key="attr_index">
                                {{ attr.name }}
                            </div>
                        </div>
                    </transition>
                </div>
                
                <img class="slaveC" :style='stylerSize(3.5,35,80,0)' @click="modifyStatis(stat_index)" src="~assets/images/modify.png">
                <img class="slaveC" :style='stylerSize(3.5,35,86,0)' @click="deleteStatis(stat_index)" src="~assets/images/remove.png">
            </div>

        </div>
    </div>
</template>

<script>
import statisticsStoreMixin from "../mixin/statisticsStoreMixin"
import { DeviceName, updateProfile } from "common/constant/profile"
import { initStatis } from "solution/energy/config/statistics/statisType"
import { ConfigEvent } from '@/network/uci'
import { updateAttr } from "common/constant/attribute"

export default {
    mixins: [statisticsStoreMixin],
    data(){
        return{
            currentAttributeIndex: null,
        }
    },
    async created(){
        console.log(this.$store.state.backData.back_lang)
        //資料統計設定屬性表刷新
        updateAttr(this.$store.state.backData.back_lang)
        if(Object.keys(this.statisticsList).length == 0)
            await this.getStatisticsList();
        console.log(this.statisticsList)
        //console.log(this.addList)
        //console.log(this.deleteList)
    },
    mounted(){
        this.$bus.$on("configApply", async () => {
            this.$store.commit("setLoadingProgress");
            await this.setStatisticsList();
            setTimeout(async () => {
                await this.resetStatisticsList();
                await this.getStatisticsList();
                ConfigEvent("update", "statistics");
                this.$store.commit("setLoadingProgress");
            }, 1500);
            //await updateProfile()
            await initStatis()
            
        });
    },
    beforeDestroy(){
        this.$bus.$off("configApply");
        this.$bus.$off("previousPage");

        let path = this.$route.path.split('/');
        if(path[path.length - 1] !== 'statistics')
            this.resetStatisticsList();
    },
    methods: {
        devNameChange(dev_id){
            return DeviceName[dev_id];
        },
        showAttrInfo(value){
            if(this.currentAttributeIndex == null){
                this.currentAttributeIndex = value
            }
            else{
                this.currentAttributeIndex = null
            }
        },
        async deleteStatis(index){
            await this.deleteStatisticsList(index);
        },
        modifyStatis(value){
            let path = this.$route.path.replace(/configView/i, "changeConfig");
            this.$router.push({
                path: path,
                query: {
                    statis_id: value,
                }
            });
        },
    }
}
</script>

<style scoped>
.STATISTICS_CONTENT{
    display: flex;
    flex-direction: column;
    color: white;
    font-weight: bold;
    width: 100vw;
}

.item__toolicon{
    width: 100%;
}

</style>